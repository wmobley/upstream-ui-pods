import { Campaign } from '../../../common/types';
import Card from '../../../common/Card/Card';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <Card
      title={campaign.name}
      subtitle={`${campaign.startDate} - ${campaign.endDate}`}
      to={`/campaigns/${campaign.id}`}
    />
  );
};

export default CampaignCard;
