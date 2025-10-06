import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDetail } from '../../../../hooks/campaign/useDetail';
import { useQueryClient } from '@tanstack/react-query';
import { useDelete } from '../../../../hooks/campaign/useDelete';
import { usePublish, useUnpublish } from '../../../../hooks/campaign/usePublish';
import { useDelete as useDeleteStations } from '../../../../hooks/station/useDelete';
import { useIsOwner } from '../../../../hooks/auth/usePermissions';
import QueryWrapper from '../../../common/QueryWrapper';
import ConfirmDialog from '../../../common/ConfirmDialog';
import StationCard from '../../../Station/_components/StationCard';
import GeometryMap from '../../../common/GeometryMap/GeometryMap';
// PublishButton was used previously; dropdown replicates its behavior here
import { hasValidGeometry } from '../../../../utils/geometryValidation';

interface CampaignDashboardProps {
  campaignId: string;
}

const CampaignDashboard: React.FC<CampaignDashboardProps> = ({
  campaignId,
}) => {
  const history = useHistory();
  const { campaign, isLoading, error } = useDetail(campaignId);
  const { canDelete: canDeleteData } = useIsOwner(campaignId);
  const deleteCampaign = useDelete();
  const deleteStations = useDeleteStations(campaignId);
  const publishCampaign = usePublish();
  const unpublishCampaign = useUnpublish();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteStationsDialog, setShowDeleteStationsDialog] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [showStationsActionDropdown, setShowStationsActionDropdown] = useState(false);

  const handleDeleteCampaign = async () => {
    try {
      await deleteCampaign.mutateAsync(campaignId);
      history.push('/');
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  const handleDeleteStations = async () => {
    try {
      await deleteStations.mutateAsync();
      setShowDeleteStationsDialog(false);
    } catch (error) {
      console.error('Failed to delete stations:', error);
    }
  };

  const handlePublish = async (cascade?: boolean) => {
    try {
      await publishCampaign.mutateAsync({
        campaignId: parseInt(campaignId),
        cascade: cascade || false,
      });
      // Optimistically update campaign cache so UI shows the unpublish state immediately
      try {
        queryClient.setQueryData(['campaign', campaignId], (old: unknown) => {
          if (!old) return old;
          const oldObj = old as Record<string, unknown>;
          return {
            ...oldObj,
            isPublished: true,
          };
        });
      } catch {
        // ignore
      }
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
    } catch (error) {
      console.error('Failed to publish campaign:', error);
    }
  };

  const handleUnpublish = async () => {
    try {
      await unpublishCampaign.mutateAsync(parseInt(campaignId));
    } catch (error) {
      console.error('Failed to unpublish campaign:', error);
    }
  };
  const _campaignObj = campaign as unknown as Record<string, unknown>;
  console.log(_campaignObj)
  // Check multiple possible locations for published flag (snake_case, camelCase, summary)
  const raw = campaign as unknown as Record<string, unknown>;
  const topIsPublished = Boolean(raw?.['is_published'] || raw?.['isPublished'] || raw?.['published_at'] || raw?.['publishedAt']);
  const summary = _campaignObj?.['summary'] as Record<string, unknown> | undefined;
  const summaryIsPublished = Boolean(summary?.['is_published'] || summary?.['isPublished']);

  // Also consider publish mutation error which may have reported "already published"
  const publishErrBody = (publishCampaign as unknown as { error?: unknown })?.error
    ? ((publishCampaign as unknown as { error?: { __bodyText?: unknown } }).error?.__bodyText as string | undefined)
    : undefined;
  let publishErrIndicatesPublished = false;
  if (publishErrBody && typeof publishErrBody === 'string') {
    try {
      const parsed = JSON.parse(publishErrBody);
      const detail = parsed && parsed.detail ? parsed.detail : parsed;
      if (typeof detail === 'string' && detail.toLowerCase().includes('already published')) {
        publishErrIndicatesPublished = true;
      }
    } catch {
      if ((publishErrBody as string).toLowerCase().includes('already published')) {
        publishErrIndicatesPublished = true;
      }
    }
  }

  const isPublishedFlag = topIsPublished || summaryIsPublished || publishErrIndicatesPublished;

  React.useEffect(() => {
    // debug: log campaign object and published flag when page loads
    console.log('Campaign debug', { campaign, isPublishedFlag });
  }, [campaign, isPublishedFlag]);

  if (!campaign) {
    return null;
  }

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      <div className="px-4 md:px-8 lg:px-12 lg:py-12 lg:h-5/6 py-12 bg-secondary-100">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
          <div className='breadcrumbs'>
            <a href='/'>Explore campaigns</a>
            <span>&gt;</span>
            <a href='#' className='active'>{campaign?.name}</a>
          </div>
          {/* Header Section */}
          <header className="mb-8">
            {/* <Navigation /> */}
            <div className="mt-6 flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{campaign?.name}</h1>
                {isPublishedFlag && (
                  <div className="inline-block ml-3 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Published
                  </div>
                )}
                <p className="text-gray-600">
                  {campaign?.startDate?.toLocaleDateString()} -{' '}
                  {campaign?.endDate?.toLocaleDateString()}
                </p>
              </div>
              <div className="relative">
                <div className="flex gap-3">
                  {canDeleteData && (
                    <div className="relative">
                      <button
                        onClick={() => setShowActionDropdown((s) => !s)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
                      >
                        Actions
                        <svg
                          className={`w-4 h-4 transition-transform`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                        {showActionDropdown && (
                          <div
                            className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-[99999]"
                            style={{ zIndex: 99999 }}
                          >
                          {/* Publish / Unpublish */}
                          {isPublishedFlag ? (
                            <button
                              onClick={async () => {
                                setShowActionDropdown(false);
                                await handleUnpublish();
                              }}
                              className="block w-full text-left px-4 py-3 text-sm text-orange-600 hover:bg-orange-50 hover:text-orange-900 transition-colors border-b border-gray-100"
                            >
                              Unpublish Campaign
                            </button>
                            ) : (
                              <>
                                <button
                                  onClick={async () => {
                                    setShowActionDropdown(false);
                                    await handlePublish(true);
                                  }}
                                  className="block w-full text-left px-4 py-3 text-sm text-green-600 hover:bg-green-50 hover:text-green-900 transition-colors border-b border-gray-100"
                                >
                                  Publish Campaign
                                </button>
                              </>
                            )}

                          {/* Station actions */}
                          <button
                            onClick={() => {
                              setShowActionDropdown(false);
                              history.push(`/campaigns/${campaignId}/stations/new`);
                            }}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border-b border-gray-100"
                          >
                            Create New Station
                          </button>

                          <button
                            onClick={() => {
                              setShowActionDropdown(false);
                              setShowDeleteStationsDialog(true);
                            }}
                            disabled={!campaign?.stations || campaign.stations.length === 0}
                            className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-100"
                          >
                            Delete All Stations
                          </button>

                          <button
                            onClick={() => {
                              setShowActionDropdown(false);
                              setShowDeleteDialog(true);
                            }}
                            className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-900 transition-colors"
                          >
                            Delete Campaign
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {hasValidGeometry(campaign) && (
            <section className="col-span-2 grid grid-cols-1 gap-8 mb-8 h-96 w-full">
              <div className="bg-white rounded-lg shadow-md p-6 w-full">
                <h2 className="text-xl font-semibold mb-4">
                  Campaign Coverage
                </h2>
                <div className="h-3/4 w-full">
                  <GeometryMap
                    geoJSON={campaign.geometry as GeoJSON.Geometry}
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-12 lg:py-12 lg:h-5/6 py-12">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Stations</h2>
            <div className="flex gap-3">
              {canDeleteData && (
                <div className="relative">
                  <button
                    onClick={() => setShowStationsActionDropdown((s) => !s)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
                  >
                    Actions
                    <svg
                      className={`w-4 h-4 transition-transform`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {showStationsActionDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-[99999]"
                      style={{ zIndex: 99999 }}
                    >
                      <button
                        onClick={() => {
                          setShowStationsActionDropdown(false);
                          history.push(`/campaigns/${campaignId}/stations/new`);
                        }}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border-b border-gray-100"
                      >
                        Create New Station
                      </button>

                      <button
                        onClick={() => {
                          setShowStationsActionDropdown(false);
                          setShowDeleteStationsDialog(true);
                        }}
                        disabled={!campaign?.stations || campaign.stations.length === 0}
                        className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-100"
                      >
                        Delete All Stations
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {campaign &&
                campaign?.stations?.map((station) => (
                  <StationCard
                    key={station.id}
                    station={station}
                    campaignId={campaignId}
                    to={`/campaigns/${campaignId}/stations/${station.id}`}
                  />
                ))}
            </div>
            <div className="flex gap-4">
              {/* <FilterControls /> */}
              {/* <ExportButton onExport={() => {}} /> */}
            </div>
            {/* <HeatMap campaignId={campaignId} /> */}
          </section>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${campaign?.name}"? This action will permanently delete the campaign and all its stations, sensors, and measurements. This cannot be undone.`}
        confirmText="Delete Campaign"
        cancelText="Cancel"
        onConfirm={handleDeleteCampaign}
        onCancel={() => setShowDeleteDialog(false)}
        isLoading={deleteCampaign.isPending}
        danger={true}
      />

      <ConfirmDialog
        isOpen={showDeleteStationsDialog}
        title="Delete All Stations"
        message={`Are you sure you want to delete all stations in "${campaign?.name}"? This action will permanently delete all stations, their sensors, and measurements. This cannot be undone.`}
        confirmText="Delete All Stations"
        cancelText="Cancel"
        onConfirm={handleDeleteStations}
        onCancel={() => setShowDeleteStationsDialog(false)}
        isLoading={deleteStations.isPending}
        danger={true}
      />
    </QueryWrapper>
  );
};

export default CampaignDashboard;
