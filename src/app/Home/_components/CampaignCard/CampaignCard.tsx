import Card from '../../../common/Card/Card';
import { ListCampaignsResponseItem } from '@upstream/upstream-api';

interface CampaignCardProps {
  campaign: ListCampaignsResponseItem;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <Card
      title={campaign.name}
      subtitle={`${campaign.startDate} - ${campaign.endDate}`}
      to={`/campaigns/${campaign.id}`}
      tags={campaign.summary.variableNames?.filter(
        (variable) => variable !== null,
      )}
    />
  );
};

export default CampaignCard;
