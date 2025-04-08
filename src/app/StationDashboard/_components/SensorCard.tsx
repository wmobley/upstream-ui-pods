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
      subtitleChildren={
        <div className="flex flex-col gap-2">
          <span className="text-gray-500">Units: {sensor.units}</span>
          <span className="text-gray-500">Alias: {sensor.alias}</span>
        </div>
      }
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
