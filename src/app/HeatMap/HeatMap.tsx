import { MapContainer, TileLayer, Polyline, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { useDetail } from '../../hooks/campaign/useDetail';
import { Interval } from '../../hooks/campaign/useDetail';
import { useState } from 'react';

const getIntervalByValue = (value: number, intervals: Interval[]) => {
  return intervals.find(
    (interval) => value >= interval.minValue && value <= interval.maxValue,
  );
};

const getColorByValue = (value: number, intervals: Interval[]) => {
  const interval = getIntervalByValue(value, intervals);
  return interval ? getColorByPercentile(interval.minPercentile) : 'blue';
};

const getColorByPercentile = (percentile: number) => {
  return `hsl(${(percentile * 360) / 100}, 100%, 50%)`;
};

function Legend({ intervals }: { intervals: Interval[] }) {
  return (
    <div className="absolute bottom-8 right-8 z-[1000] bg-white p-4 rounded-lg shadow-lg">
      <h3 className="font-semibold mb-2">Time Intervals</h3>
      <div className="space-y-2">
        {intervals.map((interval, index, array) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: getColorByPercentile(interval.minPercentile),
              }}
            />
            <span className="text-sm">
              {interval.minPercentile}% - {interval.maxPercentile}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HeatMap() {
  const { measurements, intervals } = useDetail();
  const [selectedPoint, setSelectedPoint] = useState<{
    value: number;
    percentile: number;
    position: LatLngExpression;
  } | null>(null);
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

  if (!measurements || !intervals) return null;
  return (
    <div className="h-screen w-full relative">
      <MapContainer center={getCenter()} zoom={10} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline
          positions={coordinates as LatLngExpression[]}
          pathOptions={{ color: 'blue', weight: 2, opacity: 0.6 }}
        />
        {getReducedPoints().map((coord, index, array) => {
          const value = measurements[index].measurementvalue;
          const interval = getIntervalByValue(value, intervals);

          return (
            <CircleMarker
              key={index}
              center={coord as LatLngExpression}
              radius={3}
              pathOptions={{
                color: getColorByValue(value, intervals),
                fillOpacity: 1,
                weight: 1,
              }}
              eventHandlers={{
                click: () => {
                  setSelectedPoint({
                    value,
                    percentile: interval?.minPercentile || 0,
                    position: coord as LatLngExpression,
                  });
                },
              }}
            />
          );
        })}

        {selectedPoint && (
          <div
            className="absolute z-[1001] bg-white p-2 rounded-md shadow-md"
            style={{
              left: '50%',
              top: '10px',
              transform: 'translateX(-50%)',
            }}
          >
            <p className="text-sm">
              Value: {selectedPoint.value.toFixed(2)}
              <br />
              Percentile: {selectedPoint.percentile}%
            </p>
          </div>
        )}
      </MapContainer>
      <Legend intervals={intervals} />
    </div>
  );
}
