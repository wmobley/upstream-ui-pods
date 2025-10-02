import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDetail } from '../../../../hooks/campaign/useDetail';
import { useDelete } from '../../../../hooks/campaign/useDelete';
import { useDelete as useDeleteStations } from '../../../../hooks/station/useDelete';
import { useIsOwner } from '../../../../hooks/auth/usePermissions';
import QueryWrapper from '../../../common/QueryWrapper';
import ConfirmDialog from '../../../common/ConfirmDialog';
import StationCard from '../../../Station/_components/StationCard';
import GeometryMap from '../../../common/GeometryMap/GeometryMap';
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteStationsDialog, setShowDeleteStationsDialog] = useState(false);

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
                <p className="text-gray-600">
                  {campaign?.startDate?.toLocaleDateString()} -{' '}
                  {campaign?.endDate?.toLocaleDateString()}
                </p>
              </div>
              {canDeleteData && (
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  Delete Campaign
                </button>
              )}
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
                    onClick={() => setShowDeleteStationsDialog(true)}
                    disabled={!campaign?.stations || campaign.stations.length === 0}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete all stations in this campaign"
                  >
                    Delete All Stations
                  </button>
                </div>
              )}
              <Link
                to={`/campaigns/${campaignId}/stations/new`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Create New Station
              </Link>
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
