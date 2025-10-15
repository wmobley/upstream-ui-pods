import { useDetail } from '../../hooks/station/useDetail';
import { useDelete as useDeleteSensors } from '../../hooks/sensor/useDelete';
import { useDeleteStation } from '../../hooks/station/useDeleteStation';
import { usePublish, useUnpublish } from '../../hooks/station/usePublish';
import QueryWrapper from '../common/QueryWrapper';
import ConfirmDialog from '../common/ConfirmDialog';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();
  const { station, isLoading, error } = useDetail(campaignId, stationId);
  const { campaign } = campaignInfo(campaignId);
  // Since we removed allocations, allow all authenticated users to manage stations
  const canDeleteData = true; // Previously: useIsOwner(campaignId)
  const deleteSensors = useDeleteSensors(campaignId, stationId);
  const deleteStation = useDeleteStation();
  const publishStation = usePublish();
  const unpublishStation = useUnpublish();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showDeleteSensorsDialog, setShowDeleteSensorsDialog] = useState(false);
  const [showDeleteStationDialog, setShowDeleteStationDialog] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [showForcePublishDialog, setShowForcePublishDialog] = useState(false);
  const [forcePublishArgs, setForcePublishArgs] = useState<{ cascade: boolean } | null>(null);
  const [publishOverride, setPublishOverride] = useState<boolean | null>(null);

  const handleDeleteSensors = async () => {
    try {
      await deleteSensors.mutateAsync();
      setShowDeleteSensorsDialog(false);
    } catch (error) {
      console.error('Failed to delete sensors:', error);
    }
  };

  const handleDeleteStation = async () => {
    try {
      await deleteStation.mutateAsync({
        campaignId,
        stationId,
      });
      setShowDeleteStationDialog(false);
      // Navigate back to campaign dashboard after successful deletion
      history.push(`/campaigns/${campaignId}`);
    } catch (error) {
      console.error('Failed to delete station:', error);
    }
  };

  const handlePublishStation = async (cascade?: boolean) => {
    try {
      await publishStation.mutateAsync({
        campaignId: parseInt(campaignId),
        stationId: parseInt(stationId),
        cascade: cascade || false,
      });
      setShowActionDropdown(false);
      setPublishOverride(true);
    } catch (error) {
      console.error('Failed to publish station:', error);
      // If server indicates parent campaign is not published, open confirm dialog to force publish
      try {
        const body = (error as unknown as Record<string, unknown>).__bodyText as string | undefined;
        if (body && body.includes('parent campaign is not published')) {
          setForcePublishArgs({ cascade: cascade || false });
          setShowForcePublishDialog(true);
        }
      } catch {
        // ignore
      }
    }
  };

  const handleUnpublishStation = async () => {
    try {
      await unpublishStation.mutateAsync({
        campaignId: parseInt(campaignId),
        stationId: parseInt(stationId),
      });
      setShowActionDropdown(false);
      setPublishOverride(false);
    } catch (error) {
      console.error('Failed to unpublish station:', error);
    }
  };

  // ...existing code...

  const isPublished = (() => {
    if (publishOverride !== null) {
      return publishOverride;
    }
    if (!station) return false;
    const s: Record<string, unknown> = station as unknown as Record<string, unknown>;
    const camel = s['isPublished'];
    const snake = s['is_published'];
    return (typeof camel === 'boolean' ? camel : typeof snake === 'boolean' ? snake : false);
  })();

  React.useEffect(() => {
    setPublishOverride(null);
  }, [campaignId, stationId]);

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
              <div className="relative">
                <button
                  onClick={() => setShowActionDropdown(!showActionDropdown)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
                >
                  Actions
                  <svg
                    className={`w-4 h-4 transition-transform ${showActionDropdown ? 'rotate-180' : ''}`}
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

                {/* Dropdown Menu */}
                {showActionDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-[99999]" style={{ zIndex: 99999 }}>
                    <button
                      onClick={() => {
                        setShowActionDropdown(false);
                        setIsUploadModalOpen(true);
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors border-b border-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Data
                      </div>
                    </button>

                    {/* Publishing options */}
                    {canDeleteData && (
                      <>
                            {isPublished ? (
                              <button
                                onClick={() => {
                                  setShowActionDropdown(false);
                                  handleUnpublishStation();
                                }}
                                className="block w-full text-left px-4 py-3 text-sm text-orange-600 hover:bg-orange-50 hover:text-orange-900 transition-colors border-b border-gray-100"
                              >
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L4.636 4.636m5.242 5.242L15.121 15.121" />
                                  </svg>
                                  Unpublish Station
                                </div>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setShowActionDropdown(false);
                                  handlePublishStation(true);
                                }}
                                className="block w-full text-left px-4 py-3 text-sm text-green-600 hover:bg-green-50 hover:text-green-900 transition-colors border-b border-gray-100"
                              >
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  Publish Station (with sensors)
                                </div>
                              </button>
                            )}
                      </>
                    )}

                    {/* Only show delete options if user has permission */}
                    {canDeleteData && (
                      <>
                        <button
                          onClick={() => {
                            setShowActionDropdown(false);
                            setShowDeleteSensorsDialog(true);
                          }}
                          disabled={!station?.sensors || station.sensors.length === 0}
                          className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-b border-gray-100"
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete All Sensors
                          </div>
                          {(!station?.sensors || station.sensors.length === 0) && (
                            <div className="text-xs text-gray-400 ml-6">No sensors to delete</div>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setShowActionDropdown(false);
                            setShowDeleteStationDialog(true);
                          }}
                          className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-900 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete Station
                          </div>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>

          <section className="h-[400px] grid grid-cols-1 gap-8 mb-8">
            {/* banner removed per user request */}
            {station && <StatsSection station={station} />}
          </section>

          <SensorTable campaignId={campaignId} stationId={stationId} />

          <UploadDataModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            campaignId={campaignId}
            stationId={stationId}
          />

          <ConfirmDialog
            isOpen={showDeleteStationDialog}
            title="Delete Station"
            message={`Are you sure you want to delete "${station?.name}"? This action will permanently delete the station and all its sensors and measurements. This cannot be undone.`}
            confirmText="Delete Station"
            cancelText="Cancel"
            onConfirm={handleDeleteStation}
            onCancel={() => setShowDeleteStationDialog(false)}
            isLoading={deleteStation.isPending}
            danger={true}
          />

          <ConfirmDialog
            isOpen={showDeleteSensorsDialog}
            title="Delete All Sensors"
            message={`Are you sure you want to delete all sensors in "${station?.name}"? This action will permanently delete all sensors and their measurements. This cannot be undone.`}
            confirmText="Delete All Sensors"
            cancelText="Cancel"
            onConfirm={handleDeleteSensors}
            onCancel={() => setShowDeleteSensorsDialog(false)}
            isLoading={deleteSensors.isPending}
            danger={true}
          />

          <ConfirmDialog
            isOpen={showForcePublishDialog}
            title="Force Publish Station"
            message={`The parent campaign is not published. Force publishing the station will ignore the parent campaign's published state. Are you sure you want to continue?`}
            confirmText="Force Publish"
            cancelText="Cancel"
            onConfirm={async () => {
              try {
                await publishStation.mutateAsync({
                  campaignId: parseInt(campaignId),
                  stationId: parseInt(stationId),
                  cascade: forcePublishArgs?.cascade || false,
                  force: true,
                });
              } catch (err) {
                console.error('Failed to force publish station:', err);
              } finally {
                setShowForcePublishDialog(false);
                setForcePublishArgs(null);
              }
            }}
            onCancel={() => {
              setShowForcePublishDialog(false);
              setForcePublishArgs(null);
            }}
            isLoading={publishStation.isPending}
            danger={false}
          />
        </div>
      </div>
    </QueryWrapper>
  );
};

export default StationDashboard;
