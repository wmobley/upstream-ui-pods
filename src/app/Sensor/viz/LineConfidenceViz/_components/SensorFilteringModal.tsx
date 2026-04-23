import {
  ListSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGetRequest,
  SensorItem,
  StationItemWithSummary,
} from '@upstream/upstream-api';
import { useList } from '../../../../../hooks/sensor/useList';
import { useList as useStationList } from '../../../../../hooks/station/useList';
import Modal from '../../../../common/Modal/Modal';
import { useLineConfidence } from '../context/LineConfidenceContextState';
import React, { useMemo, useState } from 'react';
import QueryWrapper from '../../../../common/QueryWrapper/QueryWrapper';

interface SelectedSensor {
  campaignId: string;
  stationId: string;
  id: string;
  label: string;
  stationName?: string;
}

const getSensorKey = (campaignId: string, stationId: string, sensorId: string) =>
  `${campaignId}-${stationId}-${sensorId}`;

const SensorFilteringModal = React.memo(() => {
  const {
    campaignId,
    stationId,
    addSensor,
    addSensorModalOpen,
    setAddSensorModalOpen,
  } = useLineConfidence();

  const [selectedSensors, setSelectedSensors] = useState<
    Record<string, SelectedSensor>
  >({});
  const [selectedStationId, setSelectedStationId] = useState(stationId);

  const stationFilters = useMemo(
    () => ({
      campaignId: parseInt(campaignId),
      limit: 1000,
    }),
    [campaignId],
  );

  const {
    data: stations,
    isLoading: stationsLoading,
    error: stationsError,
  } = useStationList({
    filters: stationFilters,
  });

  const selectedStation = stations?.items?.find(
    (station: StationItemWithSummary) =>
      station.id.toString() === selectedStationId,
  );

  const filters: ListSensorsApiV1CampaignsCampaignIdStationsStationIdSensorsGetRequest =
    useMemo(
      () => ({
        campaignId: parseInt(campaignId),
        stationId: parseInt(selectedStationId),
        limit: 1000,
      }),
      [campaignId, selectedStationId],
    );

  const {
    data: sensors,
    isLoading: sensorsLoading,
    error: sensorsError,
  } = useList({
    filters,
  });

  const handleToggleSensor = (sensor: SensorItem) => {
    const sensorId = sensor.id.toString();
    const sensorKey = getSensorKey(campaignId, selectedStationId, sensorId);
    const sensorLabel = sensor.alias || sensor.variablename || `Sensor ${sensorId}`;

    setSelectedSensors((prev) => {
      const next = { ...prev };

      if (next[sensorKey]) {
        delete next[sensorKey];
      } else {
        next[sensorKey] = {
          campaignId,
          stationId: selectedStationId,
          id: sensorId,
          label: sensorLabel,
          stationName: selectedStation?.name,
        };
      }

      return next;
    });
  };

  const handleSubmit = () => {
    // Add each selected sensor
    Object.values(selectedSensors).forEach((sensor) => {
      if (sensor) {
        addSensor(sensor);
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
      <QueryWrapper
        isLoading={stationsLoading || sensorsLoading}
        error={stationsError || sensorsError}
      >
        <div className="p-4 flex flex-col gap-6">
          <div>
            <label
              htmlFor="comparison-station"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Station
            </label>
            <select
              id="comparison-station"
              value={selectedStationId}
              onChange={(event) => setSelectedStationId(event.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              {stations?.items?.map((station: StationItemWithSummary) => (
                <option key={station.id} value={station.id.toString()}>
                  {station.name}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">
              Select any station in this campaign, then choose sensors to compare.
            </p>
          </div>

          <div className="flex flex-col gap-3 h-[65vh] overflow-y-auto py-2">
            {sensors?.items?.map((sensor: SensorItem) => (
              <div
                key={getSensorKey(
                  campaignId,
                  selectedStationId,
                  sensor.id.toString(),
                )}
                className="p-2 rounded hover:bg-gray-100 transition-colors"
              >
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={
                      Boolean(
                        selectedSensors[
                          getSensorKey(
                            campaignId,
                            selectedStationId,
                            sensor.id.toString(),
                          )
                        ],
                      )
                    }
                    onChange={() => handleToggleSensor(sensor)}
                    className="m-0"
                  />
                  <span>
                    {sensor.alias || sensor.variablename || `Sensor ${sensor.id}`}
                  </span>
                </label>
              </div>
            ))}
            {!sensors?.items?.length && (
              <p>No sensors available for the selected station</p>
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
