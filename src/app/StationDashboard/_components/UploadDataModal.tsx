import React, { useState } from 'react';
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
  const [progress, setProgress] = useState<UploadProgress>({
    totalChunks: 0,
    currentChunk: 0,
    status: 'idle',
  });
  const uploadMutation = useUploadData();

  const handleSensorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSensorFile(e.target.files[0]);
    }
  };

  const handleMeasurementFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMeasurementFile(file);
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
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Data">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sensor Data (CSV)
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Measurement Data (CSV)
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
        </div>

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
              disabled={
                uploadMutation.isPending || (!sensorFile && !measurementFile)
              }
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
