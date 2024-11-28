import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { useDetail } from '../../hooks/campaign/useDetail';
import { Tile } from '../common/Tile';
import { CarLine } from '../common/CarLine';

export default function RouterMap() {
  const { measurements } = useDetail();
  const coordinates = measurements.map((m) => [m.latitude, m.longitude]);

  // Calculate the center of the coordinates
  const getCenter = (): LatLngExpression | undefined => {
    if (!measurements.length) return undefined;

    const lats = measurements.map((coord) => coord.latitude);
    const lngs = measurements.map((coord) => coord.longitude);

    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

    return [centerLat, centerLng];
  };

  if (!getCenter()) return null;
  return (
    <div className="h-screen w-full">
      <MapContainer center={getCenter()} zoom={10} className="h-full w-full">
        <Tile />
        <CarLine coordinates={coordinates as LatLngExpression[]} />
      </MapContainer>
    </div>
  );
}
