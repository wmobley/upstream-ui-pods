import { useDetail } from '../../hooks/sensor/useDetail';
import QueryWrapper from '../common/QueryWrapper';
import React from 'react';
import MeasurementsSummary from '../Sensor/Measurements/MeasurementsSummary';
import { useList } from '../../hooks/measurements/useList';
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
  const {
    data: measurements,
    isLoading: measurementsLoading,
    error: measurementsError,
  } = useList(campaignId, stationId, sensorId, 5000);

  return (
    <QueryWrapper
      isLoading={isLoading || measurementsLoading}
      error={error || measurementsError}
    >
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <header className="mb-8">
          <div className="mt-6">
            <h1 className="text-3xl font-bold">{data?.variablename}</h1>
            <p className="text-gray-600">{data?.description}</p>
          </div>
        </header>

        <section className="h-[400px] grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <StatsSection data={measurements} />
        </section>

        <section className="flex flex-col gap-10 bg-white rounded-lg p-4 shadow-md">
          <QueryWrapper isLoading={isLoading} error={error}>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Explore sensor data
            </h2>
            <MeasurementsSummary
              campaignId={campaignId}
              stationId={stationId}
              sensorId={sensorId}
              data={measurements}
            />
          </QueryWrapper>
        </section>
      </div>
    </QueryWrapper>
  );
};

export default SensorDashboard;
