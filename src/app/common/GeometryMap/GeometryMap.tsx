import 'leaflet/dist/leaflet.css';
import { LatLng, LatLngBounds } from 'leaflet';
import { TileLayer } from 'react-leaflet';
import { GeoJSON } from 'react-leaflet';
import { MapContainer } from 'react-leaflet';

const GeometryMap = ({ geoJSON }: { geoJSON: GeoJSON.Geometry }) => {
  if (!geoJSON) {
    return null;
  }
  const data: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: geoJSON,
        properties: {},
      },
    ],
  };

  // Calculate bounds from GeoJSON coordinates
  const calculateBounds = (geometry: GeoJSON.Geometry): LatLngBounds => {
    let minLat = 90,
      maxLat = -90,
      minLng = 180,
      maxLng = -180;

    const processCoordinates = (coords: number[]) => {
      const lat = coords[1];
      const lng = coords[0];
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    };

    const traverseCoordinates = (
      coordinates: any[],
      geometry: GeoJSON.Geometry,
    ) => {
      if (geometry.type === 'Point') {
        processCoordinates(coordinates as number[]);
      } else if (Array.isArray(coordinates)) {
        coordinates.forEach((coord) => {
          if (Array.isArray(coord)) {
            traverseCoordinates(coord, geometry);
          } else if (typeof coord === 'number') {
            processCoordinates(coordinates as number[]);
            return;
          }
        });
      }
    };

    traverseCoordinates(geometry.coordinates, geometry);
    return new LatLngBounds(
      new LatLng(minLat, minLng),
      new LatLng(maxLat, maxLng),
    );
  };

  const bounds = calculateBounds(geoJSON);

  // Calculate appropriate zoom level based on bounds
  const calculateZoom = (bounds: LatLngBounds): number => {
    const ZOOM_MAX = 14;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const latFraction = Math.abs(ne.lat - sw.lat) / 180;
    const lngFraction = Math.abs(ne.lng - sw.lng) / 360;

    const latZoom = Math.floor(Math.log2(1 / latFraction));
    const lngZoom = Math.floor(Math.log2(1 / lngFraction));

    return Math.min(Math.min(latZoom, lngZoom), ZOOM_MAX);
  };

  const zoom = calculateZoom(bounds);
  const center = bounds.getCenter();

  return (
    <MapContainer
      className="h-full w-full"
      zoom={zoom}
      center={center}
      zoomControl={false}
      bounds={bounds}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={data} />
    </MapContainer>
  );
};

export default GeometryMap;
