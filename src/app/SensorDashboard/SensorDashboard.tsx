import { useDetail } from '../../hooks/sensor/useDetail';
import QueryWrapper from '../common/QueryWrapper';
import React from 'react';
import MeasurementsSummary from '../Sensor/Measurements/MeasurementsSummary';
import StatsSection from './_components/StatsSection';
import {useDetail as campaignInfo} from '../../hooks/campaign/useDetail';
import {useDetail as stationInfo} from '../../hooks/station/useDetail';

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
  const { campaign } = campaignInfo(campaignId);
  const { station } = stationInfo(campaignId, stationId );

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      <div className="px-4 md:px-8 lg:px-12 lg:py-12 lg:h-5/6 py-12 bg-secondary-100">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
          <div className='breadcrumbs'>
            <a href='/'>Explore campaigns</a>
            <span>&gt;</span>
            <a href={'/campaigns/' + campaignId}>{ campaign?.name || "campaign " + campaignId + " ..." }</a>
            <span>&gt;</span>
            <a href={'/campaigns/' + campaignId + "/stations/" + stationId}>{ station?.name || "station " + campaignId + " ..." }</a>
            <span>&gt;</span>
            <a href='#' className='active'>{data?.variablename}</a>
          </div>

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
      </div>
    </QueryWrapper>
  );
};

export default SensorDashboard;
