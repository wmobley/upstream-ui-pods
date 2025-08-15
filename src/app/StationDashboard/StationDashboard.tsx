import { useDetail } from '../../hooks/station/useDetail';
import QueryWrapper from '../common/QueryWrapper';
import React, { useState } from 'react';
import StatsSection from './_components/StatsSection';
import { SensorTable } from './_components/SensorTable';
import UploadDataModal from './_components/UploadDataModal';
import {useDetail as campaignInfo} from '../../hooks/campaign/useDetail';

interface StationDashboardProps {
  campaignId: string;
  stationId: string;
}

const StationDashboard: React.FC<StationDashboardProps> = ({
  campaignId,
  stationId,
}) => {
  const { station, isLoading, error } = useDetail(campaignId, stationId);
  const { campaign } = campaignInfo(campaignId);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      <div className="px-4 md:px-8 lg:px-12 lg:py-12 lg:h-5/6 py-12 bg-secondary-100">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
          <div className='breadcrumbs'>
            <a href='/'>Explore campaigns</a>
            <span>&gt;</span>
            <a href={'/campaigns/' + campaignId}>{ campaign?.name || "campaign " + campaignId + " ..." }</a>
            <span>&gt;</span>
            <a href='#' className='active'>{station?.name}</a>
          </div>
          <header className="mb-8">
            <div className="mt-6 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">{station?.name}</h1>
                <p className="text-gray-600">{station?.description}</p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Add New Data
              </button>
            </div>
          </header>

          <section className="h-[400px] grid grid-cols-1 gap-8 mb-8">
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
      </div>
    </QueryWrapper>
  );
};

export default StationDashboard;
