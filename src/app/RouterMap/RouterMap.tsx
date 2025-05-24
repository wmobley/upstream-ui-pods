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
import SensorTooltip from '../common/SensorTooltip/SensorTooltip';

interface RouterMapProps {
  measurements: MeasurementItem[];
  showPoints?: boolean;
}

export default function RouterMap({
  measurements,
  showPoints = true,
}: RouterMapProps) {
  const coordinates = measurements.map((m) => [
    // @ts-expect-error - Geometry coordinates type is not properly defined in the API
    m.geometry?.coordinates[1],
    // @ts-expect-error - Geometry coordinates type is not properly defined in the API
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
      {showPoints &&
        getReducedPoints(measurements).map((measurement, index) => {
          const position: LatLngExpression = [
            // @ts-expect-error - Geometry coordinates type is not properly defined in the API
            measurement.geometry?.coordinates[1],
            // @ts-expect-error - Geometry coordinates type is not properly defined in the API
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
                <SensorTooltip
                  value={measurement.value}
                  timestamp={measurement.collectiontime}
                  precision={10}
                  className="min-w-[200px]"
                />
              </Tooltip>
            </CircleMarker>
          );
        })}
    </MapContainer>
  );
}
