import { useDetail } from '../../../../hooks/campaign/useDetail';
import QueryWrapper from '../../../common/QueryWrapper';
import StationCard from '../../../Station/_components/StationCard';
import GeometryMap from '../../../common/GeometryMap/GeometryMap';
import { hasValidGeometry } from '../../../../utils/geometryValidation';

interface CampaignDashboardProps {
  campaignId: string;
}

const CampaignDashboard: React.FC<CampaignDashboardProps> = ({
  campaignId,
}) => {
  const { campaign, isLoading, error } = useDetail(campaignId);

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
            <div className="mt-6">
              <h1 className="text-3xl font-bold">{campaign?.name}</h1>
              <p className="text-gray-600">
                {campaign?.startDate?.toLocaleDateString()} -{' '}
                {campaign?.endDate?.toLocaleDateString()}
              </p>
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
          <h2 className="text-xl font-semibold mb-4">Stations</h2>
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {campaign &&
                campaign?.stations?.map((station) => (
                  <StationCard
                    key={station.id}
                    station={station}
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
    </QueryWrapper>
  );
};

export default CampaignDashboard;
