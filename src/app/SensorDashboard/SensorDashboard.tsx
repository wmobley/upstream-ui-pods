import { useDetail } from '../../hooks/sensor/useDetail';
import { usePublish, useUnpublish } from '../../hooks/sensor/usePublish';
import QueryWrapper from '../common/QueryWrapper';
import PublishButton from '../common/PublishButton/PublishButton';
import React from 'react';
import MeasurementsSummary from '../Sensor/Measurements/MeasurementsSummary';
import StatsSection from './_components/StatsSection';
import {useDetail as campaignInfo} from '../../hooks/campaign/useDetail';
import {useDetail as stationInfo} from '../../hooks/station/useDetail';
import { renderChm } from '../../utils/helpers';

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
  // Since we removed allocations, allow all authenticated users to manage sensors
  const canDeleteData = true; // Previously: useIsOwner(campaignId)
  const publishSensor = usePublish();
  const unpublishSensor = useUnpublish();
  const [publishOverride, setPublishOverride] = React.useState<boolean | null>(null);

  const handlePublishSensor = async (cascade?: boolean) => {
    try {
      await publishSensor.mutateAsync({
        campaignId: parseInt(campaignId),
        stationId: parseInt(stationId),
        sensorId: parseInt(sensorId),
        cascade: cascade || false,
      });
      setPublishOverride(true);
    } catch (error) {
      console.error('Failed to publish sensor:', error);
      // If server indicates parent station is not published, offer to force publish
      try {
        const body = (error as unknown as Record<string, unknown>).__bodyText as string | undefined;
        if (body && body.includes('parent station is not published')) {
          const confirmForce = window.confirm('Parent station is not published. Force publish this sensor (this will ignore parent published state)?');
          if (confirmForce) {
            try {
              await publishSensor.mutateAsync({
                campaignId: parseInt(campaignId),
                stationId: parseInt(stationId),
                sensorId: parseInt(sensorId),
                cascade: cascade || false,
                force: true,
              });
              setPublishOverride(true);
            } catch (err2) {
              console.error('Failed to force publish sensor:', err2);
            }
          }
        }
      } catch {
        // ignore parsing errors
      }
    }
  };

  const handleUnpublishSensor = async () => {
    try {
      await unpublishSensor.mutateAsync({
        campaignId: parseInt(campaignId),
        stationId: parseInt(stationId),
        sensorId: parseInt(sensorId),
      });
      setPublishOverride(false);
    } catch (error) {
      console.error('Failed to unpublish sensor:', error);
    }
  };

  const isPublished = (() => {
    if (publishOverride !== null) {
      return publishOverride;
    }
    if (!data) return false;
    // Some endpoints/models expose snake_case (is_published) or camelCase (isPublished)
    const d: Record<string, unknown> = data as unknown as Record<string, unknown>;
    const camel = d['isPublished'];
    const snake = d['is_published'];
    return (typeof camel === 'boolean' ? camel : typeof snake === 'boolean' ? snake : false);
  })();

  React.useEffect(() => {
    setPublishOverride(null);
  }, [campaignId, stationId, sensorId]);

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      <div className="px-4 md:px-8 lg:px-12 lg:py-12 lg:h-5/6 py-12 bg-secondary-100">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
          <div className='breadcrumbs'>
            <a href='/'>Campaigns</a>
            <span>&gt;</span>
            <a href={'/campaigns/' + campaignId}>{ campaign?.name || "campaign " + campaignId + " ..." }</a>
            <span>&gt;</span>
            <a href={'/campaigns/' + campaignId + "/stations/" + stationId}>{ station?.name || "station " + campaignId + " ..." }</a>
            <span>&gt;</span>
            <a href='#' className='active'>{renderChm(data?.variablename || data?.alias || "")}</a>
          </div>

          <header className="mb-8">
            <div className="mt-6 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{renderChm(data?.variablename || "")}</h1>
                <p className="text-gray-600">{data?.description}</p>
              </div>
              {canDeleteData && data && (
                isPublished ? (
                  <button
                    onClick={handleUnpublishSensor}
                    disabled={unpublishSensor.isPending}
                    className="flex items-center gap-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
                    title="Unpublish this sensor"
                  >
                    <span>Unpublish</span>
                  </button>
                ) : (
                  <PublishButton
                    isPublished={isPublished}
                    onPublish={handlePublishSensor}
                    onUnpublish={handleUnpublishSensor}
                    entityType="sensor"
                    showCascadeOption={true}
                  />
                )
              )}
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
