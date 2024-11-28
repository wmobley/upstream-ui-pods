import { Polyline } from 'react-leaflet';
import { MeasurementPoint } from '../types';

export default function CarLine({
  measurements,
}: {
  measurements: MeasurementPoint[];
}) {
  return (
    <Polyline
      positions={measurements.map((m) => [m.latitude, m.longitude])}
      pathOptions={{ color: 'blue', weight: 2, opacity: 0.6 }}
    />
  );
}
