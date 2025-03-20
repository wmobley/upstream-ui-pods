import { useDetail } from '../../../../hooks/station/useDetail';
import QueryWrapper from '../../../common/QueryWrapper';
import { useDetail as useCampaignDetail } from '../../../../hooks/campaign/useDetail';
interface StationDashboardProps {
  campaignId: string;
  stationId: string;
}

const StationDashboard: React.FC<StationDashboardProps> = ({
  campaignId,
  stationId,
}) => {
  const { station, isLoading, error } = useDetail(campaignId, stationId);
  const {
    campaign,
    isLoading: campaignLoading,
    error: campaignError,
  } = useCampaignDetail(campaignId);

  return (
    <QueryWrapper
      isLoading={isLoading || campaignLoading}
      error={error || campaignError}
    >
      <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
        <h1 className="text-3xl font-bold">
          {campaign?.name} - {station?.stationname}
        </h1>
      </div>
    </QueryWrapper>
  );
};

export default StationDashboard;
