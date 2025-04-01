import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { MeasurementItem } from '@upstream/upstream-api';
import { getCenter } from '../../utils/mapRendering';

interface RouterMapProps {
  measurements: MeasurementItem[];
}

export default function RouterMap({ measurements }: RouterMapProps) {
  const coordinates = measurements.map((m) => [
    // @ts-expect-error
    m.geometry?.coordinates[1],
    // @ts-expect-error
    m.geometry?.coordinates[0],
  ]);

  const center = getCenter(measurements);

  if (!center) return null;
  return (
    <div className="h-screen w-full">
      <MapContainer center={center} zoom={10} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline
          positions={coordinates as LatLngExpression[]}
          pathOptions={{ color: 'blue', weight: 3 }}
        />
      </MapContainer>
    </div>
  );
}
