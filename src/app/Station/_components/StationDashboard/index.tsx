import { useDetail } from '../../../../hooks/station/useDetail';
import QueryWrapper from '../../../common/QueryWrapper';
import { useDetail as useCampaignDetail } from '../../../../hooks/campaign/useDetail';
import React, { useState } from 'react';
import { SensorItem } from '@upstream/upstream-api';

interface StationDashboardProps {
  campaignId: string;
  stationId: string;
}

const StationDashboard: React.FC<StationDashboardProps> = ({
  campaignId,
  stationId,
}) => {
  const { station, isLoading, error } = useDetail(campaignId, stationId);
  const {
    campaign,
    isLoading: campaignLoading,
    error: campaignError,
  } = useCampaignDetail(campaignId);

  const [selectedSensor, setSelectedSensor] = useState<SensorItem | null>(null);

  return (
    <QueryWrapper
      isLoading={isLoading || campaignLoading}
      error={error || campaignError}
    >
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        {/* Header Section */}
        <header className="mb-8">
          <div className="mt-6">
            <h1 className="text-3xl font-bold">{campaign?.name}</h1>
            <p className="text-gray-600">{station?.name}</p>
          </div>
        </header>

        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-1/4 min-w-[250px]">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Sensors</h2>
              <div className="space-y-2">
                {station?.sensors?.map((sensor) => (
                  <button
                    key={sensor.id}
                    onClick={() => setSelectedSensor(sensor)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedSensor?.id === sensor.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    {sensor.alias}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            <section className="bg-white rounded-lg shadow-md p-6">
              {selectedSensor ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {selectedSensor.alias}
                  </h2>
                  <div className="space-y-4">
                    {/* Add sensor details here */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Sensor ID</p>
                        <p className="font-medium">{selectedSensor.id}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-medium">
                          {selectedSensor.variablename}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  Select a sensor from the list to view details
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </QueryWrapper>
  );
};

export default StationDashboard;
