import { MapContainer, CircleMarker, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { Interval } from '../../app/common/types';
import { useState } from 'react';
import Tile from '../common/Tile/Tile';
import CarLine from '../common/CarLine/CarLine';
import { createGoogleStreetViewUrl } from '../common/GoogleMaps/GoogleMapsStreet';
import { MeasurementItem } from '@upstream/upstream-api';
import Legend from '../common/Legend/Legend';
import { getColorByValue } from '../common/Intervals';
import { getReducedPoints } from '../../utils/mapRendering';
import { getCenter } from '../../utils/mapRendering';

interface HeatMapProps {
  measurements: MeasurementItem[];
  intervals: Interval[];
}

export default function HeatMap({ measurements, intervals }: HeatMapProps) {
  const [selectedInterval, setSelectedInterval] = useState<Interval | null>(
    null,
  );
  const [selectedPoint, setSelectedPoint] = useState<{
    value: number;
    percentile: number;
    position: LatLngExpression;
  } | null>(null);

  if (!measurements) return null;
  return (
    <div className="h-[500px] w-full relative">
      {selectedPoint && (
        <div className="absolute bottom-8 left-8 z-[1000] bg-white p-4 rounded-lg shadow-lg">
          <a
            href={createGoogleStreetViewUrl({
              position: selectedPoint?.position as LatLngExpression,
            })}
          >
            Google Maps Street View
          </a>
        </div>
      )}
      <MapContainer center={getCenter()} zoom={9} className="h-full w-full">
        <Tile />
        <CarLine measurements={measurements} />
        {getReducedPoints(measurements).map((m, index) => {
          const value = m.value;

          return (
            <CircleMarker
              key={index}
              center={[m.geometry?.coordinates[1], m.geometry?.coordinates[0]]}
              radius={6}
              pathOptions={{
                color: getColorByValue(value, intervals),
                fillOpacity: 1,
                weight: 1,
              }}
              eventHandlers={{
                click: () => {
                  setSelectedPoint({
                    value,
                    // percentile: 0,
                    position: [
                      m.geometry?.coordinates[1],
                      m.geometry?.coordinates[0],
                    ] as LatLngExpression,
                  });
                },
              }}
            />
          );
        })}

        {selectedPoint && (
          <Marker position={selectedPoint.position as LatLngExpression}>
            <Tooltip direction="bottom" offset={[0, 20]} opacity={1} permanent>
              Value: {selectedPoint.value.toFixed(2)}
              <br />
              Position: {selectedPoint.position.toString()}
            </Tooltip>
          </Marker>
        )}
      </MapContainer>
      <Legend
        title={title}
        intervals={intervals}
        selectedInterval={selectedInterval}
        onIntervalSelect={setSelectedInterval}
      />
    </div>
  );
}
