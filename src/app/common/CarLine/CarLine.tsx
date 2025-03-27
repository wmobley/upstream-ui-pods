import { Polyline } from 'react-leaflet';
import { MeasurementItem } from '@upstream/upstream-api';

export default function CarLine({
  measurements,
}: {
  measurements: MeasurementItem[];
}) {
  return (
    <Polyline
      positions={measurements.map((m) => [
        m.geometry?.coordinates[0],
        m.geometry?.coordinates[1],
      ])}
      pathOptions={{ color: 'blue', weight: 2, opacity: 0.6 }}
    />
  );
}
