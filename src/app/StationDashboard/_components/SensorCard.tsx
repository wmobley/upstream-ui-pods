import { SensorItem } from '@upstream/upstream-api';
import Card from '../../common/Card/Card';

interface SensorCardProps {
  sensor: SensorItem; // Update interface for station props
  campaignId: string;
  stationId: string;
  to?: string;
}

const SensorCard: React.FC<SensorCardProps> = ({
  sensor,
  campaignId,
  stationId,
  to,
}) => {
  return (
    <Card
      title={sensor.variablename ?? ''}
      subtitle={sensor.alias ?? ''} // Assuming station has a location property
      to={
        to ??
        `/campaigns/${campaignId}/stations/${stationId}/sensors/${sensor.id}`
      }
      // tags={sensor.variableName} // Assuming station has parameters that can be used as tags
      maxTags={10}
    />
  );
};

export default SensorCard;
