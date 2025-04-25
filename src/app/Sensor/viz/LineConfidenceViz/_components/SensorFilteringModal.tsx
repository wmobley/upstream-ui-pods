import {
  ListSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGetRequest,
  SensorItem,
} from '@upstream/upstream-api';
import { useList } from '../../../../../hooks/sensor/useList';
import Modal from '../../../../common/Modal/Modal';
import { useLineConfidence } from '../context/LineConfidenceContext';
import React, { useMemo, useState } from 'react';
import QueryWrapper from '../../../../common/QueryWrapper/QueryWrapper';

const SensorFilteringModal = React.memo(() => {
  const {
    campaignId,
    stationId,
    addSensor,
    addSensorModalOpen,
    setAddSensorModalOpen,
  } = useLineConfidence();

  const [selectedSensors, setSelectedSensors] = useState<
    Record<string, boolean>
  >({});

  const filters: ListSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGetRequest =
    useMemo(
      () => ({
        campaignId: parseInt(campaignId),
        stationId: parseInt(stationId),
        limit: 1000,
      }),
      [campaignId, stationId],
    );

  const {
    data: sensors,
    isLoading: sensorsLoading,
    error: sensorsError,
  } = useList({
    filters,
  });

  const handleToggleSensor = (sensorId: string) => {
    setSelectedSensors((prev) => ({
      ...prev,
      [sensorId]: !prev[sensorId],
    }));
  };

  const handleSubmit = () => {
    // Add each selected sensor
    Object.entries(selectedSensors).forEach(([sensorId, isSelected]) => {
      if (isSelected) {
        addSensor(campaignId, stationId, sensorId);
      }
    });
    setAddSensorModalOpen(false);
  };

  return (
    <Modal
      isOpen={addSensorModalOpen}
      onClose={() => setAddSensorModalOpen(false)}
      title="Sensor Filtering"
      className="max-w-screen-md h-[90vh]"
    >
      <QueryWrapper isLoading={sensorsLoading} error={sensorsError}>
        <div className="p-4 flex flex-col gap-6">
          <div className="flex flex-col gap-3 h-[65vh] overflow-y-auto py-2">
            {sensors?.items?.map((sensor: SensorItem) => (
              <div
                key={sensor.id}
                className="p-2 rounded hover:bg-gray-100 transition-colors"
              >
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={selectedSensors[sensor.id.toString()] || false}
                    onChange={() => handleToggleSensor(sensor.id.toString())}
                    className="m-0"
                  />
                  <span>{`${sensor.alias || `Sensor ${sensor.id}`}`}</span>
                </label>
              </div>
            ))}
            {!sensors?.items?.length && (
              <p>No sensors available for this station</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
            <button
              className="px-4 py-2 rounded font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
              onClick={() => setAddSensorModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded font-medium bg-primary text-white hover:bg-primary-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={
                Object.values(selectedSensors).filter(Boolean).length === 0
              }
            >
              Add Selected Sensors
            </button>
          </div>
        </div>
      </QueryWrapper>
    </Modal>
  );
});

export default SensorFilteringModal;
