import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StationsListResponseItem } from '@upstream/upstream-api';
import { useDeleteStation } from '../../../hooks/station/useDeleteStation';
import { useIsOwner } from '../../../hooks/auth/usePermissions';
import ConfirmDialog from '../../common/ConfirmDialog';
import PublishingStatusIndicator from '../../common/PublishingStatusIndicator/PublishingStatusIndicator';
import { renderChm } from '../../../utils/helpers';

interface StationCardProps {
  station: StationsListResponseItem;
  campaignId: string;
  to?: string;
}

const StationCard: React.FC<StationCardProps> = ({ station, campaignId, to }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { canDelete: canDeleteData } = useIsOwner(campaignId);
  const deleteStation = useDeleteStation();

  const handleDeleteStation = async () => {
    try {
      await deleteStation.mutateAsync({
        campaignId,
        stationId: station.id?.toString() || '',
      });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete station:', error);
    }
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(false);
    setShowDeleteDialog(true);
  };

  return (
    <>
      <Link to={to ?? `/stations/${station.id}`} className="h-64 sm:h-80 lg:h-96">
        <div className="relative flex-col h-full transform items-end border-2 transition-transform hover:scale-105 bg-secondary-50 border-gray-100">
          {/* Dropdown Button - Only show if user has delete permissions */}
          {canDeleteData && (
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={handleDropdownClick}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                title="More options"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-20">
                  <button
                    onClick={handleDeleteClick}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-900 transition-colors"
                  >
                    Delete Station
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="p-4 h-1/2 transition-opacity sm:p-6 lg:p-6">
            <div className="flex flex-col h-full">
              <h2 className="mt-4 text-xl font-medium sm:text-2xl my-1">{station.name}</h2>
              {station.description && <p className="text-sm text-gray-500">{station.description}</p>}
              <div className="mt-2">
                {(() => {
                  const s: Record<string, unknown> = station as unknown as Record<string, unknown>;
                  const isPub = (typeof s['isPublished'] === 'boolean') ? s['isPublished'] : (typeof s['is_published'] === 'boolean' ? s['is_published'] : false);
                  const pubAtRaw = (s['publishedAt'] as string | undefined) ?? (s['published_at'] as string | undefined) ?? undefined;
                  const pubAtDate = pubAtRaw ? new Date(pubAtRaw) : undefined;
                  return (
                    <PublishingStatusIndicator
                      isPublished={isPub}
                      publishedAt={pubAtDate ?? null}
                    />
                  );
                })()}
              </div>
              {station.sensors && station.sensors.length > 0 && (
                <div className="flex flex-wrap gap-2 my-1">
                  {station.sensors.slice(0, 5).map((sensor) => (
                    <span
                      key={sensor.id}
                      className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-700"
                    >
                      {renderChm(sensor.variableName ?? '')}
                    </span>
                  ))}
                  {station.sensors.length > 5 && (
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-700">
                      +{station.sensors.length - 5}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Station"
        message={`Are you sure you want to delete "${station.name}"? This action will permanently delete the station and all its sensors and measurements. This cannot be undone.`}
        confirmText="Delete Station"
        cancelText="Cancel"
        onConfirm={handleDeleteStation}
        onCancel={() => setShowDeleteDialog(false)}
        isLoading={deleteStation.isPending}
        danger={true}
      />
    </>
  );
};

export default StationCard;
