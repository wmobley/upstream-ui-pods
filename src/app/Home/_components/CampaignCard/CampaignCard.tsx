import Card from '../../../common/Card/Card';
import { ListCampaignsResponseItem } from '@upstream/upstream-api';
import GeometryMap from '../../../common/GeometryMap/GeometryMap';

interface CampaignCardProps {
  campaign: ListCampaignsResponseItem;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const Map = () => {
    if (campaign.geometry) {
      return <GeometryMap geoJSON={campaign.geometry as GeoJSON.Geometry} />;
    }
    return null;
  };

  if (campaign.geometry) {
    return (
      <Card
        title={campaign.name}
        subtitle={`${campaign.startDate?.toLocaleDateString()} - ${campaign.endDate?.toLocaleDateString()}`}
        to={`/campaigns/${campaign.id}`}
        tags={campaign.summary.variableNames?.filter(
          (variable) => variable !== null,
        )}
      >
        <Map />
      </Card>
    );
  } else {
    return (
      <Card
        title={campaign.name}
        subtitle={`${campaign.startDate?.toLocaleDateString()} - ${campaign.endDate?.toLocaleDateString()}`}
        to={`/campaigns/${campaign.id}`}
        tags={campaign.summary.variableNames?.filter(
          (variable) => variable !== null,
        )}
      />
    );
  }
};

export default CampaignCard;
