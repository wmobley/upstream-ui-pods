import { MapContainer, CircleMarker, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { Interval } from '../../app/common/types';
import { useState, useMemo } from 'react';
import Tile from '../common/Tile/Tile';
import CarLine from '../common/CarLine/CarLine';
import { MeasurementItem } from '@upstream/upstream-api';
import Legend from '../common/Legend/Legend';
import { getColorByValue, getIntervalByValue } from '../common/Intervals';
import '../../utils/leaflet';
import SensorTooltip from '../common/SensorTooltip/SensorTooltip';

interface HeatMapProps {
  measurements: MeasurementItem[];
  intervals: Interval[];
}

export default function HeatMap({ measurements, intervals }: HeatMapProps) {
  const [selectedInterval, setSelectedInterval] = useState<Interval | null>(
    null,
  );
  const title = 'Heat Map';
  const [selectedPoint, setSelectedPoint] = useState<{
    value: number;
    percentile: number;
    position: LatLngExpression;
  } | null>(null);

  // Filter measurements based on selected interval
  const filteredMeasurements = useMemo(() => {
    if (!measurements) return [];
    if (!selectedInterval) return measurements;

    return measurements.filter((m) => {
      if (m.value === null) return false;
      const interval = getIntervalByValue(m.value, intervals);
      return interval === selectedInterval;
    });
  }, [measurements, selectedInterval, intervals]);

  if (!measurements || measurements.length === 0) return null;

  const center: LatLngExpression = [
    // @ts-expect-error - Geometry coordinates type is not properly defined in the API
    measurements[0].geometry?.coordinates[1],
    // @ts-expect-error - Geometry coordinates type is not properly defined in the API
    measurements[0].geometry?.coordinates[0],
  ];

  return (
    <div className="h-map w-full ">
      <MapContainer center={center} zoom={9} className="h-full w-full">
        <Tile />
        <CarLine measurements={filteredMeasurements} />
        {filteredMeasurements.map((m, index) => {
          const value = m.value;
          if (value === null) return null;

          const position: LatLngExpression = [
            // @ts-expect-error - Geometry coordinates type is not properly defined in the API
            m.geometry?.coordinates[1],
            // @ts-expect-error - Geometry coordinates type is not properly defined in the API
            m.geometry?.coordinates[0],
          ];

          return (
            <CircleMarker
              key={index}
              center={position}
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
                    percentile: 0,
                    position,
                  });
                },
              }}
            />
          );
        })}

        {selectedPoint && (
          <Marker position={selectedPoint.position as LatLngExpression}>
            <Tooltip direction="bottom" offset={[0, 20]} opacity={1} permanent>
              <SensorTooltip
                value={selectedPoint.value}
                className="min-w-[200px]"
              />
            </Tooltip>
          </Marker>
        )}
      </MapContainer>

      <Legend
        title={title ? title : ''}
        intervals={intervals}
        selectedInterval={selectedInterval}
        onIntervalSelect={setSelectedInterval}
      />
    </div>
  );
}
