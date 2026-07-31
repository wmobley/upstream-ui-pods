import 'leaflet/dist/leaflet.css';
import { LatLng, LatLngBounds } from 'leaflet';
import { TileLayer, CircleMarker, Popup, useMapEvents } from 'react-leaflet';
import { GeoJSON } from 'react-leaflet';
import { MapContainer } from 'react-leaflet';
import '../../../utils/leaflet';

type Position = GeoJSON.Position;
type Coordinates = Position | Position[] | Position[][] | Position[][][];

export interface GeometryMapMarker {
  position: GeoJSON.Point;
  color?: string;
  label?: string;
}

interface GeometryMapProps {
  geoJSON: GeoJSON.Geometry;
  /** Extra pins rendered on top of the base geometry, e.g. a note's own
   * location alongside the measurement's location. Optional, backward
   * compatible with existing read-only usages. */
  markers?: GeometryMapMarker[];
  /** When provided, clicking the map reports the picked point instead of
   * being purely read-only. Used only by the note-location picker. */
  onPick?: (point: GeoJSON.Point) => void;
}

const ClickHandler = ({ onPick }: { onPick: (point: GeoJSON.Point) => void }) => {
  useMapEvents({
    click(e) {
      onPick({ type: 'Point', coordinates: [e.latlng.lng, e.latlng.lat] });
    },
  });
  return null;
};

const GeometryMap = ({ geoJSON, markers, onPick }: GeometryMapProps) => {
  if (!geoJSON || Object.keys(geoJSON).length === 0) {
    console.log('no geoJSON');
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
  console.log(data);

  // Calculate bounds from GeoJSON coordinates (+ any extra markers, since a
  // marker's whole purpose can be to sit *offset* from the base geometry —
  // e.g. a note's own location vs. the measurement's — so it must be folded
  // into the viewport calculation or it can render off-screen).
  const calculateBounds = (
    geometry: GeoJSON.Geometry,
    extraPoints?: GeometryMapMarker[],
  ): LatLngBounds => {
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
      coordinates: Coordinates,
      geometry: GeoJSON.Geometry,
    ) => {
      if (geometry.type === 'Point') {
        processCoordinates(coordinates as Position);
      } else if (
        geometry.type === 'LineString' ||
        geometry.type === 'MultiPoint'
      ) {
        (coordinates as Position[]).forEach((coord) =>
          processCoordinates(coord),
        );
      } else if (
        geometry.type === 'Polygon' ||
        geometry.type === 'MultiLineString'
      ) {
        (coordinates as Position[][]).forEach((ring) => {
          ring.forEach((coord) => processCoordinates(coord));
        });
      } else if (geometry.type === 'MultiPolygon') {
        (coordinates as Position[][][]).forEach((polygon) => {
          polygon.forEach((ring) => {
            ring.forEach((coord) => processCoordinates(coord));
          });
        });
      } else if (geometry.type === 'GeometryCollection') {
        geometry.geometries.forEach((geom) => {
          if ('coordinates' in geom) {
            traverseCoordinates(geom.coordinates, geom);
          }
        });
      }
    };

    if ('coordinates' in geometry) {
      traverseCoordinates(geometry.coordinates, geometry);
    }

    extraPoints?.forEach((marker) => processCoordinates(marker.position.coordinates));

    return new LatLngBounds(
      new LatLng(minLat, minLng),
      new LatLng(maxLat, maxLng),
    );
  };

  const bounds = calculateBounds(geoJSON, markers);

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
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={data} />
      {markers?.map((marker, i) => (
        <CircleMarker
          key={`marker-${i}`}
          center={[marker.position.coordinates[1], marker.position.coordinates[0]]}
          radius={7}
          pathOptions={{ color: marker.color ?? '#ea580c', fillColor: marker.color ?? '#ea580c', fillOpacity: 0.9 }}
        >
          {marker.label && <Popup>{marker.label}</Popup>}
        </CircleMarker>
      ))}
      {onPick && <ClickHandler onPick={onPick} />}
    </MapContainer>
  );
};

export default GeometryMap;
