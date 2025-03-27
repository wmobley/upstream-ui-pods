import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { useDetail } from '../../hooks/campaign/useDetail';
import { MeasurementItem } from '@upstream/upstream-api';

interface RouterMapProps {
  measurements: MeasurementItem[];
}

export default function RouterMap({ measurements }: RouterMapProps) {
  const coordinates = measurements.map((m) => [
    m.geometry?.coordinates[1],
    m.geometry?.coordinates[0],
  ]);

  // Calculate the center of the coordinates
  const getCenter = (): LatLngExpression | undefined => {
    if (!measurements.length) return undefined;

    const lats = measurements.map((coord) => coord.geometry?.coordinates[1]);
    const lngs = measurements.map((coord) => coord.geometry?.coordinates[0]);

    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

    return [centerLat, centerLng];
  };

  if (!getCenter()) return null;
  return (
    <div className="h-screen w-full">
      <MapContainer center={getCenter()} zoom={10} className="h-full w-full">
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
