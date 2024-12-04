import { Link } from 'react-router-dom';
import { Campaign } from '../../../common/types';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  return (
    <Link to={`/campaigns/${campaign.id}`} className="h-64 sm:h-80 lg:h-96">
      <div className="relative flex h-full transform items-end border-2 border-black bg-white transition-transform hover:scale-105">
        <div className="p-4 transition-opacity sm:p-6 lg:p-8">
          <h2 className="mt-4 text-xl font-medium sm:text-2xl">
            {campaign.name}
          </h2>
          <p className="text-sm text-gray-500">
            {campaign.startDate} - {campaign.endDate}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CampaignCard;
