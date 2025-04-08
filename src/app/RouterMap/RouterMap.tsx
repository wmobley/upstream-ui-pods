import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Tooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { MeasurementItem } from '@upstream/upstream-api';
import { getCenter, getReducedPoints } from '../../utils/mapRendering';

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
    <MapContainer center={center} zoom={10} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline
        positions={coordinates as LatLngExpression[]}
        pathOptions={{ color: 'blue', weight: 3 }}
      />
      {getReducedPoints(measurements).map((measurement, index) => {
        const position: LatLngExpression = [
          // @ts-expect-error
          measurement.geometry?.coordinates[1],
          // @ts-expect-error
          measurement.geometry?.coordinates[0],
        ];

        return (
          <CircleMarker
            key={index}
            center={position}
            radius={5}
            pathOptions={{
              color: '#1a73e8',
              fillColor: '#1a73e8',
              fillOpacity: 0.7,
              weight: 1,
            }}
          >
            <Tooltip>
              Point {index + 1}
              {measurement.value !== undefined && (
                <>
                  <br />
                  Value: {measurement.value.toFixed(2)}
                </>
              )}
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
