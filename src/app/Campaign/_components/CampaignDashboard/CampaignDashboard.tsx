import { useDetail } from '../../../../hooks/campaign/useDetail';
import BoundingBoxMap from '../../../common/BoundingBoxMap';
import QueryWrapper from '../../../common/QueryWrapper';
import StationCard from '../../../Station/_components/StationCard';
import StatsWidget from './_components/StatsWidget';

interface CampaignDashboardProps {
  campaignId: string;
}

const CampaignDashboard: React.FC<CampaignDashboardProps> = ({
  campaignId,
}) => {
  const { campaign, isLoading, error } = useDetail(campaignId);

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
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

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Coverage</h2>
            {campaign &&
              campaign.location &&
              campaign.location.bboxWest &&
              campaign.location.bboxEast &&
              campaign.location.bboxSouth &&
              campaign.location.bboxNorth && (
                <BoundingBoxMap
                  west={campaign.location?.bboxWest}
                  east={campaign.location?.bboxEast}
                  south={campaign.location?.bboxSouth}
                  north={campaign.location?.bboxNorth}
                />
              )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Campaign Statistics</h2>
            <StatsWidget campaignId={campaignId} />
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold">Stations</h2>
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
    </QueryWrapper>
  );
};

export default CampaignDashboard;
