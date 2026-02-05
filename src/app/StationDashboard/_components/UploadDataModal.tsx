import React, { useMemo, useState } from 'react';
import Modal from '../../common/Modal/Modal';
import { useUploadData } from '../../../hooks/station/useUploadData';
import { LINES_PER_CHUNK } from '../../../hooks/station/useUploadData';

interface UploadDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  stationId: string;
}

interface UploadProgress {
  totalChunks: number;
  currentChunk: number;
  status: 'idle' | 'uploading' | 'complete' | 'error';
  error?: string;
}

const UploadDataModal: React.FC<UploadDataModalProps> = ({
  isOpen,
  onClose,
  campaignId,
  stationId,
}) => {
  const [sensorFile, setSensorFile] = useState<File | null>(null);
  const [measurementFile, setMeasurementFile] = useState<File | null>(null);
  const [sensorHeaders, setSensorHeaders] = useState<string[]>([]);
  const [sensorAliases, setSensorAliases] = useState<string[]>([]);
  const [measurementHeaders, setMeasurementHeaders] = useState<string[]>([]);
  const [progress, setProgress] = useState<UploadProgress>({
    totalChunks: 0,
    currentChunk: 0,
    status: 'idle',
  });
  const uploadMutation = useUploadData();

  const normalizeCsvValue = (value: string) =>
    value.trim().replace(/^"|"$/g, '');

  const parseCsvHeader = (text: string) => {
    const firstLine = text.split(/\r?\n/)[0] || '';
    return firstLine
      .split(',')
      .map(normalizeCsvValue)
      .filter((value) => value.length > 0);
  };

  const readSensorFileMetadata = async (file: File) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((line) => line.length > 0);
    const headers = parseCsvHeader(text);
    const aliasIndex = headers.indexOf('alias');

    const aliases = new Set<string>();
    if (aliasIndex >= 0) {
      for (let i = 1; i < lines.length; i += 1) {
        const columns = lines[i].split(',').map(normalizeCsvValue);
        const aliasValue = columns[aliasIndex];
        if (aliasValue) {
          aliases.add(aliasValue);
        }
      }
    }

    setSensorHeaders(headers);
    setSensorAliases(Array.from(aliases));
  };

  const readMeasurementHeader = async (file: File) => {
    const text = await file.slice(0, 65536).text();
    const headers = parseCsvHeader(text);
    setMeasurementHeaders(headers);
  };

  const handleSensorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSensorFile(file);
      void readSensorFileMetadata(file);
    }
  };

  const handleMeasurementFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMeasurementFile(file);
      void readMeasurementHeader(file);
      // Calculate total chunks based on file size and lines per chunk
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n').length - 1; // Subtract header
        const totalChunks = Math.ceil(lines / LINES_PER_CHUNK);
        setProgress((prev) => ({ ...prev, totalChunks }));
      };
      reader.readAsText(file);
    }
  };

  const handleUpload = async () => {
    if (!sensorFile && !measurementFile) return;

    setProgress((prev) => ({ ...prev, status: 'uploading', currentChunk: 0 }));

    try {
      await uploadMutation.mutateAsync({
        campaignId: parseInt(campaignId, 10),
        stationId: parseInt(stationId, 10),
        sensorFile: sensorFile || undefined,
        measurementFile: measurementFile || undefined,
        onProgress: (progress) => {
          setProgress((prev) => ({
            ...prev,
            currentChunk: progress.currentChunk,
            status: progress.status,
            error: progress.error,
          }));
        },
      });

      // Reset form after successful upload but keep modal open
      setSensorFile(null);
      setMeasurementFile(null);
      setSensorHeaders([]);
      setSensorAliases([]);
      setMeasurementHeaders([]);
    } catch (error) {
      console.error('Error uploading files:', error);
      setProgress((prev) => ({
        ...prev,
        status: 'error',
        error:
          error instanceof Error
            ? error.message
            : 'An error occurred during upload',
      }));
    }
  };

  const getProgressMessage = () => {
    if (progress.status === 'idle') return null;
    if (progress.status === 'error') return `Error: ${progress.error}`;
    if (progress.status === 'complete') return 'Upload complete!';

    const percentage =
      progress.totalChunks > 0
        ? Math.round((progress.currentChunk / progress.totalChunks) * 100)
        : 0;

    return `Uploading chunk ${progress.currentChunk + 1} of ${progress.totalChunks} (${percentage}%)`;
  };

  const handleClose = () => {
    // Reset progress when closing
    setProgress({
      totalChunks: 0,
      currentChunk: 0,
      status: 'idle',
    });
    setSensorFile(null);
    setMeasurementFile(null);
    setSensorHeaders([]);
    setSensorAliases([]);
    setMeasurementHeaders([]);
    onClose();
  };

  const isCsvFile = (file: File | null) => {
    if (!file) return true;
    return file.name.toLowerCase().endsWith('.csv');
  };

  const requiredMeasurementColumns = useMemo(
    () => ['collectiontime', 'Lat_deg', 'Lon_deg'],
    [],
  );

  const missingMeasurementColumns = requiredMeasurementColumns.filter(
    (column) => !measurementHeaders.includes(column),
  );

  const missingAliasColumns = sensorAliases.filter(
    (alias) => !measurementHeaders.includes(alias),
  );

  const expectedMeasurementColumns = useMemo(() => {
    return new Set([...requiredMeasurementColumns, ...sensorAliases]);
  }, [requiredMeasurementColumns, sensorAliases]);

  const unmatchedMeasurementColumns = measurementHeaders.filter(
    (column) => !expectedMeasurementColumns.has(column),
  );

  const sensorCsvTypeInvalid = !!sensorFile && !isCsvFile(sensorFile);
  const measurementCsvTypeInvalid = !!measurementFile && !isCsvFile(measurementFile);
  const sensorAliasMissing = sensorFile ? !sensorHeaders.includes('alias') : false;
  const measurementRequiredMissing =
    measurementFile && missingMeasurementColumns.length > 0;
  const measurementAliasMissing =
    measurementFile && sensorAliases.length > 0 && missingAliasColumns.length > 0;

  const validationErrors = [
    sensorCsvTypeInvalid ? 'Sensor file must be a .csv.' : null,
    measurementCsvTypeInvalid ? 'Measurement file must be a .csv.' : null,
    sensorAliasMissing ? 'Sensor CSV must include an alias column.' : null,
    measurementRequiredMissing
      ? `Measurement CSV must include ${missingMeasurementColumns.join(', ')}.`
      : null,
    measurementAliasMissing
      ? `Measurement CSV is missing alias columns: ${missingAliasColumns.join(', ')}.`
      : null,
  ].filter((error): error is string => Boolean(error));

  const canUpload =
    !uploadMutation.isPending &&
    Boolean(sensorFile || measurementFile) &&
    validationErrors.length === 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Data">
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            Sensor Data (CSV)
            <span
              title="Sensor CSV must include an alias column. This is a list of columns within the Measurements table."
              className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-gray-300 text-[10px] text-gray-600"
            >
              i
            </span>
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleSensorFileChange}
            disabled={progress.status === 'uploading'}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-50 file:text-primary-700
              hover:file:bg-primary-100
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">
            Sensor CSV must include <code>alias</code> as a column. This is a
            list of columns within the Measurements table. CSV only.
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            Measurement Data (CSV)
            <span
              title="Required columns: collectiontime, Lat_deg (latitude), Lon_deg (longitude), plus one column per sensor alias."
              className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-gray-300 text-[10px] text-gray-600"
            >
              i
            </span>
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleMeasurementFileChange}
            disabled={progress.status === 'uploading'}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-50 file:text-primary-700
              hover:file:bg-primary-100
              disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">
            Measurement CSV must include <code>collectiontime</code>,{' '}
            <code>Lat_deg</code>, <code>Lon_deg</code>, and one column per
            sensor <code>alias</code>. Dates should be ISO (YYYY-MM-DD or full
            timestamp). Numbers should not include commas; leave blanks for
            missing values.
          </p>
        </div>

        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm font-medium text-gray-700">
            Upload checklist
          </p>
          <div className="mt-2 space-y-1 text-xs text-gray-600">
            <div>
              {sensorHeaders.includes('alias') ? '[x]' : '[ ]'} Sensor
              CSV includes <code>alias</code> column.
              {sensorFile && sensorHeaders.length > 0 && !sensorHeaders.includes('alias') && (
                <span className="ml-1 text-red-600">
                  Missing <code>alias</code>.
                </span>
              )}
            </div>
            <div>
              {measurementHeaders.length > 0 && missingMeasurementColumns.length === 0
                ? '[x]'
                : '[ ]'}{' '}
              Measurement
              CSV includes required columns.
              {measurementFile && missingMeasurementColumns.length > 0 && (
                <span className="ml-1 text-red-600">
                  Missing {missingMeasurementColumns.join(', ')}.
                </span>
              )}
            </div>
            <div>
              {sensorAliases.length > 0 && measurementHeaders.length > 0
                ? missingAliasColumns.length === 0
                  ? '[x]'
                  : '[ ]'
                : '[ ]'}{' '}
              Measurement CSV includes all sensor aliases.
              {missingAliasColumns.length > 0 && (
                <span className="ml-1 text-red-600">
                  Missing {missingAliasColumns.join(', ')}.
                </span>
              )}
            </div>
            <div>
              {measurementHeaders.length > 0
                ? unmatchedMeasurementColumns.length === 0
                  ? '[x]'
                  : '[ ]'
                : '[ ]'}{' '}
              No unmatched columns. Map or remove unmatched columns before
              continuing.
              {unmatchedMeasurementColumns.length > 0 && (
                <span className="ml-1 text-amber-600">
                  Unmatched {unmatchedMeasurementColumns.join(', ')}.
                </span>
              )}
            </div>
            <div>
              {isCsvFile(sensorFile) && isCsvFile(measurementFile) ? '[x]' : '[ ]'}{' '}
              CSV only. UTF-8 encoding recommended.
            </div>
            <div>
              [ ] Review the preview for shifted columns or encoding issues.
            </div>
            <div>
              [ ] If validation fails, fix the CSV and re-upload; previous
              attempts aren't saved.
            </div>
          </div>
        </div>

        {validationErrors.length > 0 && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <p className="font-medium">Fix these before uploading:</p>
            <ul className="mt-2 list-disc pl-5">
              {validationErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {progress.status !== 'idle' && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  progress.status === 'error'
                    ? 'bg-red-600'
                    : progress.status === 'complete'
                      ? 'bg-green-600'
                      : 'bg-primary-600'
                }`}
                style={{
                  width:
                    progress.totalChunks > 0
                      ? `${(progress.currentChunk / progress.totalChunks) * 100}%`
                      : '0%',
                }}
              />
            </div>
            <p
              className={`mt-2 text-sm ${
                progress.status === 'error'
                  ? 'text-red-600'
                  : progress.status === 'complete'
                    ? 'text-green-600'
                    : 'text-gray-600'
              }`}
            >
              {getProgressMessage()}
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            {progress.status === 'complete' ? 'Done' : 'Cancel'}
          </button>
          {progress.status !== 'complete' && (
            <button
              onClick={handleUpload}
              disabled={!canUpload}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UploadDataModal;
