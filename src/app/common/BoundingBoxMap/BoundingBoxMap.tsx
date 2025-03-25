import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';

interface BoundingBoxMapProps {
  west: number;
  east: number;
  south: number;
  north: number;
}

export default function BoundingBoxMap({
  west,
  east,
  south,
  north,
}: BoundingBoxMapProps) {
  const coordinates: LatLngExpression[] = [
    [north, west], // Northwest corner
    [north, east], // Northeast corner
    [south, east], // Southeast corner
    [south, west], // Southwest corner
    [north, west], // Back to Northwest to close the box
  ];

  // Calculate the center of the coordinates
  const getCenter = (): LatLngExpression | undefined => {
    if (!coordinates.length) return undefined;

    const lats = coordinates.map((coord) => coord[0]);
    const lngs = coordinates.map((coord) => coord[1]);

    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

    return [centerLat, centerLng];
  };

  const calculateZoom = (): number => {
    const latDiff = Math.abs(north - south);
    const lngDiff = Math.abs(east - west);
    const maxDiff = Math.max(latDiff, lngDiff);

    // This is a rough approximation:
    // zoom = 14 for differences around 0.01 degrees
    // zoom = 10 for differences around 0.2 degrees
    // zoom = 6 for differences around 3 degrees
    // zoom = 4 for differences around 12 degrees
    if (maxDiff < 0.01) return 14;
    if (maxDiff < 0.2) return 10;
    if (maxDiff < 3) return 6;
    if (maxDiff < 12) return 4;
    return 2;
  };

  if (!getCenter()) return null;
  return (
    <div className="h-3/4 w-full">
      <MapContainer
        center={getCenter()}
        zoom={calculateZoom()}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polygon
          positions={coordinates}
          pathOptions={{ color: 'blue', weight: 3 }}
        />
      </MapContainer>
    </div>
  );
}
