import React, { useState } from 'react';
import { useLineConfidence } from '../context/LineConfidenceContext';

interface AddSensorButtonProps {
  className?: string;
  campaignId: string;
  stationId: string;
}

export const AddSensorButton: React.FC<AddSensorButtonProps> = ({
  className,
  campaignId,
  stationId,
}) => {
  const { addSensor } = useLineConfidence();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newSensorId, setNewSensorId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (campaignId && stationId && newSensorId) {
      addSensor(campaignId, stationId, newSensorId);
      // Reset form
      setNewSensorId('');
      setIsFormOpen(false);
    }
  };

  return (
    <div className={className}>
      {!isFormOpen ? (
        <button
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          onClick={() => setIsFormOpen(true)}
        >
          Compare
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
          <h3 className="text-lg font-medium mb-3">
            Add Sensor for Comparison
          </h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="sensorId" className="block text-sm font-medium">
                Sensor ID
              </label>
              <input
                id="sensorId"
                type="text"
                value={newSensorId}
                onChange={(e) => setNewSensorId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
              >
                Add Sensor
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
