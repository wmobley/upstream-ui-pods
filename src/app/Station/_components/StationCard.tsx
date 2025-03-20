import Card from '../../common/Card/Card';
import { StationsListResponseItem } from '@upstream/upstream-api'; // Assuming there's a Station type

interface StationCardProps {
  station: StationsListResponseItem; // Update interface for station props
  to?: string;
}

const StationCard: React.FC<StationCardProps> = ({ station, to }) => {
  return (
    <Card
      title={station.name}
      subtitle={station.description ?? ''} // Assuming station has a location property
      to={to ?? `/stations/${station.id}`}
      tags={station.sensors.map((sensor) => sensor.variableName ?? '')} // Assuming station has parameters that can be used as tags
    />
  );
};

export default StationCard;
