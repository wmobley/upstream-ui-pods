import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../utils/leaflet';

interface LeafletPointMapProps {
  geoJSON: GeoJSON.FeatureCollection | GeoJSON.Feature;
  zoom?: number;
}

const LeafletPointMap: React.FC<LeafletPointMapProps> = ({
  geoJSON,
  zoom = 13,
}) => {
  // Calculate center from GeoJSON
  const getCenter = (
    geoJSON: GeoJSON.FeatureCollection | GeoJSON.Feature,
  ): LatLngExpression => {
    const features = 'features' in geoJSON ? geoJSON.features : [geoJSON];

    // Find the first Point geometry
    for (const feature of features) {
      if (feature.geometry.type === 'Point') {
        const [lng, lat] = feature.geometry.coordinates;
        return [lat, lng]; // Convert to Leaflet's [lat, lng] format
      }
    }

    // Default center if no point is found
    return [0, 0];
  };

  const center = getCenter(geoJSON);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={geoJSON} />
    </MapContainer>
  );
};

export default LeafletPointMap;
