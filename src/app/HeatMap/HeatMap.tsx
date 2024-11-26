import { MapContainer, TileLayer, Polyline, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { useDetail } from '../../hooks/campaign/useDetail';

export default function HeatMap() {
  const { measurements } = useDetail();
  const coordinates = measurements.map((m) => [m.latitude, m.longitude]);

  // Function to get a subset of points
  const getReducedPoints = () => {
    const maxPoints = 10000; // Adjust this number based on performance
    if (coordinates.length <= maxPoints) return coordinates;

    const step = Math.ceil(coordinates.length / maxPoints);
    return coordinates.filter((_, index) => index % step === 0);
  };

  // Calculate the center of the coordinates
  const getCenter = (): LatLngExpression | undefined => {
    if (!coordinates.length) return undefined;

    const lats = coordinates.map((coord) => coord[0]);
    const lngs = coordinates.map((coord) => coord[1]);

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
          pathOptions={{ color: 'blue', weight: 2, opacity: 0.6 }}
        />
        {getReducedPoints().map((coord, index, array) => (
          <CircleMarker
            key={index}
            center={coord as LatLngExpression}
            radius={3}
            pathOptions={{
              color: `hsl(${(index * 360) / array.length}, 100%, 50%)`,
              fillOpacity: 1,
              weight: 1,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
