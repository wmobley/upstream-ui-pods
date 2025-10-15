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
  const rawCampaign = campaign as unknown as Record<string, unknown>;
  const isPublished = (() => {
    const camel = rawCampaign['isPublished'];
    if (typeof camel === 'boolean') {
      return camel;
    }
    const snake = rawCampaign['is_published'];
    if (typeof snake === 'boolean') {
      return snake;
    }
    const summary = rawCampaign['summary'] as Record<string, unknown> | undefined;
    const summaryCamel = summary?.['isPublished'];
    if (typeof summaryCamel === 'boolean') {
      return summaryCamel;
    }
    const summarySnake = summary?.['is_published'];
    if (typeof summarySnake === 'boolean') {
      return summarySnake;
    }
    const publishedAtValue = rawCampaign['publishedAt'] ?? rawCampaign['published_at'];
    return Boolean(publishedAtValue);
  })();
  const publishedAt = (() => {
    const value = rawCampaign['publishedAt'] ?? rawCampaign['published_at'];
    if (value instanceof Date) {
      return value;
    }
    if (typeof value === 'string') {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  })();
  const Map = () => {
    if (campaign.geometry) {
      return <GeometryMap geoJSON={campaign.geometry as GeoJSON.Geometry} />;
    }
    return null;
  };

  const StatusIndicator = () => (
    <div className="mt-2">
      <PublishingStatusIndicator
        isPublished={isPublished}
        publishedAt={publishedAt}
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
