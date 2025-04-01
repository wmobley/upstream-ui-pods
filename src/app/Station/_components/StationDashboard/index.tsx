import { useDetail } from '../../../../hooks/station/useDetail';
import QueryWrapper from '../../../common/QueryWrapper';
import React, { useState } from 'react';
import { SensorItem } from '@upstream/upstream-api';
import StatsSection from './StatsSection';
import SensorDetails from '../../../Sensor/SensorDetails/SensorDetails';

interface StationDashboardProps {
  campaignId: string;
  stationId: string;
}

const StationDashboard: React.FC<StationDashboardProps> = ({
  campaignId,
  stationId,
}) => {
  const { station, isLoading, error } = useDetail(campaignId, stationId);

  const [selectedSensor, setSelectedSensor] = useState<SensorItem | null>(null);

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <header className="mb-8">
          <div className="mt-6">
            <h1 className="text-3xl font-bold">{station?.name}</h1>
            <p className="text-gray-600">{station?.description}</p>
          </div>
        </header>

        <section className="h-[400px] grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {station && <StatsSection station={station} />}
        </section>

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
                    {sensor.variablename}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            {selectedSensor && (
              <SensorDetails
                key={selectedSensor.id}
                campaignId={campaignId}
                stationId={stationId}
                sensorId={selectedSensor.id.toString()}
              />
            )}
          </div>
        </div>
      </div>
    </QueryWrapper>
  );
};

export default StationDashboard;
