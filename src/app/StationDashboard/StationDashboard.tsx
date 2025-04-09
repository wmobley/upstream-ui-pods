import { useDetail } from '../../hooks/station/useDetail';
import QueryWrapper from '../common/QueryWrapper';
import React from 'react';
import StatsSection from './_components/StatsSection';
import { SensorTable } from './_components/SensorTable';

interface StationDashboardProps {
  campaignId: string;
  stationId: string;
}

const StationDashboard: React.FC<StationDashboardProps> = ({
  campaignId,
  stationId,
}) => {
  const { station, isLoading, error } = useDetail(campaignId, stationId);

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

        <SensorTable campaignId={campaignId} stationId={stationId} />
      </div>
    </QueryWrapper>
  );
};

export default StationDashboard;
