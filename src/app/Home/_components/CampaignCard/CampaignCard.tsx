import Card from '../../../common/Card/Card';
import { ListCampaignsResponseItem } from '@upstream/upstream-api';
import GeometryMap from '../../../common/GeometryMap/GeometryMap';
import PublishingStatusIndicator from '../../../common/PublishingStatusIndicator/PublishingStatusIndicator';

interface CampaignCardProps {
  campaign: ListCampaignsResponseItem;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const startDate = campaign.startDate?.toLocaleDateString();
  const endDate = campaign.endDate?.toLocaleDateString();
  const dates = `${startDate} ${endDate ? `- ${endDate}` : '- Present'}`;
  const Map = () => {
    if (campaign.geometry) {
      return <GeometryMap geoJSON={campaign.geometry as GeoJSON.Geometry} />;
    }
    return null;
  };

  const StatusIndicator = () => (
    <div className="mt-2">
      <PublishingStatusIndicator
        isPublished={campaign.isPublished || false}
        publishedAt={campaign.publishedAt}
      />
    </div>
  );

  if (campaign.geometry) {
    return (
      <Card
        title={campaign.name}
        subtitle={dates}
        subtitleChildren={<StatusIndicator />}
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
        subtitle={dates}
        subtitleChildren={<StatusIndicator />}
        to={`/campaigns/${campaign.id}`}
        tags={campaign.summary.variableNames?.filter(
          (variable) => variable !== null,
        )}
      />
    );
  }
};

export default CampaignCard;
