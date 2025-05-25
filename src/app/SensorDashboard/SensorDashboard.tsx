import { useDetail } from '../../hooks/sensor/useDetail';
import QueryWrapper from '../common/QueryWrapper';
import React from 'react';
import MeasurementsSummary from '../Sensor/Measurements/MeasurementsSummary';
import StatsSection from './_components/StatsSection';
interface SensorDashboardProps {
  campaignId: string;
  stationId: string;
  sensorId: string;
}

const SensorDashboard: React.FC<SensorDashboardProps> = ({
  campaignId,
  stationId,
  sensorId,
}) => {
  const { data, isLoading, error } = useDetail(campaignId, stationId, sensorId);

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <header className="mb-8">
          <div className="mt-6">
            <h1 className="text-3xl font-bold">{data?.variablename}</h1>
            <p className="text-gray-600">{data?.description}</p>
          </div>
        </header>

        <section className="h-[400px] grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
          <StatsSection
            campaignId={campaignId}
            stationId={stationId}
            sensorId={sensorId}
          />
        </section>

        <section className="flex flex-col gap-10 bg-white rounded-lg p-4 shadow-md">
          <QueryWrapper isLoading={isLoading} error={error}>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Explore sensor data
            </h2>
            {data && (
              <MeasurementsSummary
                campaignId={campaignId}
                stationId={stationId}
                sensorId={sensorId}
                data={data}
              />
            )}
          </QueryWrapper>
        </section>
      </div>
    </QueryWrapper>
  );
};

export default SensorDashboard;
