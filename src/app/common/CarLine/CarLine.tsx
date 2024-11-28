import { Polyline } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

export default function CarLine({
  coordinates,
}: {
  coordinates: LatLngExpression[];
}) {
  return (
    <Polyline
      positions={coordinates}
      pathOptions={{ color: 'blue', weight: 2, opacity: 0.6 }}
    />
  );
}
