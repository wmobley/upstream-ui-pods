import React, { useState } from 'react';
import Modal from '../../common/Modal/Modal';
import { useUploadData } from '../../../hooks/station/useUploadData';

interface UploadDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  stationId: string;
}

const UploadDataModal: React.FC<UploadDataModalProps> = ({
  isOpen,
  onClose,
  campaignId,
  stationId,
}) => {
  const [sensorFile, setSensorFile] = useState<File | null>(null);
  const [measurementFile, setMeasurementFile] = useState<File | null>(null);
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
      setMeasurementFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!sensorFile && !measurementFile) return;

    try {
      await uploadMutation.mutateAsync({
        campaignId: parseInt(campaignId, 10),
        stationId: parseInt(stationId, 10),
        sensorFile: sensorFile || undefined,
        measurementFile: measurementFile || undefined,
      });

      // Reset form after successful upload
      setSensorFile(null);
      setMeasurementFile(null);
      onClose();
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Data">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sensor Data (CSV)
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleSensorFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
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
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={
              uploadMutation.isPending || (!sensorFile && !measurementFile)
            }
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadDataModal;
