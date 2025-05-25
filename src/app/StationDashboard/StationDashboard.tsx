import { useDetail } from '../../hooks/station/useDetail';
import QueryWrapper from '../common/QueryWrapper';
import React, { useState } from 'react';
import StatsSection from './_components/StatsSection';
import { SensorTable } from './_components/SensorTable';
import UploadDataModal from './_components/UploadDataModal';

interface StationDashboardProps {
  campaignId: string;
  stationId: string;
}

const StationDashboard: React.FC<StationDashboardProps> = ({
  campaignId,
  stationId,
}) => {
  const { station, isLoading, error } = useDetail(campaignId, stationId);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <header className="mb-8">
          <div className="mt-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{station?.name}</h1>
              <p className="text-gray-600">{station?.description}</p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add New Data
            </button>
          </div>
        </header>

        <section className="h-[400px] grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {station && <StatsSection station={station} />}
        </section>

        <SensorTable campaignId={campaignId} stationId={stationId} />

        <UploadDataModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          campaignId={campaignId}
          stationId={stationId}
        />
      </div>
    </QueryWrapper>
  );
};

export default StationDashboard;
