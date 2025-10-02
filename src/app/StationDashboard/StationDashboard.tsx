import { useDetail } from '../../hooks/station/useDetail';
import { useDelete as useDeleteSensors } from '../../hooks/sensor/useDelete';
import { useDeleteStation } from '../../hooks/station/useDeleteStation';
import { useIsOwner } from '../../hooks/auth/usePermissions';
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
  const { canDelete: canDeleteData } = useIsOwner(campaignId);
  const deleteSensors = useDeleteSensors(campaignId, stationId);
  const deleteStation = useDeleteStation();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showDeleteSensorsDialog, setShowDeleteSensorsDialog] = useState(false);
  const [showDeleteStationDialog, setShowDeleteStationDialog] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);

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
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-20">
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
        </div>
      </div>
    </QueryWrapper>
  );
};

export default StationDashboard;
