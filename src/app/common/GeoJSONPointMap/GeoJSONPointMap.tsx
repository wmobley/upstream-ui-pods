import 'leaflet/dist/leaflet.css';
import { LatLng, LatLngBounds, LatLngExpression } from 'leaflet';
import { TileLayer } from 'react-leaflet';
import { GeoJSON } from 'react-leaflet';
import { MapContainer } from 'react-leaflet';

interface GeoJSONPointMapProps {
  geoJSON: GeoJSON.FeatureCollection;
}

const GeoJSONPointMap = ({ geoJSON }: GeoJSONPointMapProps) => {
  // Calculate bounds from GeoJSON
  const getBounds = (
    geoJSON: GeoJSON.FeatureCollection | GeoJSON.Feature,
  ): LatLngBounds | null => {
    const features = 'features' in geoJSON ? geoJSON.features : [geoJSON];
    const points: LatLng[] = [];

    features.forEach((feature) => {
      if (feature.geometry.type === 'Point') {
        const [lng, lat] = feature.geometry.coordinates;
        points.push(new LatLng(lat, lng));
      } else {
        points.push(new LatLng(25.8378, -106.6495));
        points.push(new LatLng(36.4299, -93.4572));
      }
    });

    return points.length ? new LatLngBounds(points) : null;
  };

  const bounds = getBounds(geoJSON);

  if (!bounds) {
    return <div>No bounds found</div>;
  }

  if (bounds) {
    return (
      <>
        <div className="h-3/4 w-full">
          <MapContainer className="h-full w-full" zoom={4} bounds={bounds}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON data={geoJSON} />
          </MapContainer>
        </div>
      </>
    );
  }
};

export default GeoJSONPointMap;
