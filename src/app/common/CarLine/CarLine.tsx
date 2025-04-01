import { Polyline } from 'react-leaflet';
import { MeasurementItem } from '@upstream/upstream-api';

export default function CarLine({
  measurements,
}: {
  measurements: MeasurementItem[];
}) {
  return (
    <Polyline
      positions={measurements.map((m) => {
        const coordinates = m.geometry?.coordinates;
        if (!Array.isArray(coordinates)) return [];
        return [coordinates[0], coordinates[1]];
      })}
      pathOptions={{ color: 'blue', weight: 2, opacity: 0.6 }}
    />
  );
}
