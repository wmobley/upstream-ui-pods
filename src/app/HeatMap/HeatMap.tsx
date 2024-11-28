import { MapContainer, CircleMarker, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { useDetail } from '../../hooks/campaign/useDetail';
import { Interval } from '../../app/common/types';
import { useState } from 'react';
import Tile from '../common/Tile/Tile';
import CarLine from '../common/CarLine/CarLine';
import { getColorByValue, getIntervalByValue } from '../common/Intervals';
import { createGoogleStreetViewUrl } from '../common/GoogleMaps/GoogleMapsStreet';
import Legend from '../common/Legend/Legend';

export default function HeatMap() {
  const { measurements, intervals } = useDetail();
  const [selectedInterval, setSelectedInterval] = useState<Interval | null>(
    null,
  );
  const [selectedPoint, setSelectedPoint] = useState<{
    value: number;
    percentile: number;
    position: LatLngExpression;
  } | null>(null);

  // Filter measurements based on selected interval
  const filteredMeasurements = selectedInterval
    ? measurements.filter(
        (m) =>
          m.measurementvalue >= selectedInterval.minValue &&
          m.measurementvalue <= selectedInterval.maxValue,
      )
    : measurements;

  const title = (
    <>
      C<sub>3</sub>H<sub>4</sub>OH<sup>+</sup> Concentration
    </>
  );
  // Function to get a subset of points
  const getReducedPoints = () => {
    const maxPoints = 10000; // Adjust this number based on performance
    if (filteredMeasurements.length <= maxPoints) return filteredMeasurements;

    const step = Math.ceil(filteredMeasurements.length / maxPoints);
    return filteredMeasurements.filter((_, index) => index % step === 0);
  };

  // Calculate the center of the coordinates
  const getCenter = (): LatLngExpression | undefined => {
    if (!filteredMeasurements.length) return undefined;

    const lats = filteredMeasurements.map((m) => m.latitude);
    const lngs = filteredMeasurements.map((m) => m.longitude);

    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

    return [centerLat, centerLng];
  };

  if (!measurements || !intervals) return null;
  return (
    <div className="h-screen w-full relative">
      {selectedPoint && (
        <div className="absolute bottom-8 left-8 z-[1000] bg-white p-4 rounded-lg shadow-lg">
          <a
            href={createGoogleStreetViewUrl({
              position: selectedPoint?.position as LatLngExpression,
            })}
          >
            View on Google Maps Street View
          </a>
        </div>
      )}
      <MapContainer center={getCenter()} zoom={10} className="h-full w-full">
        <Tile />
        <CarLine measurements={measurements} />
        {getReducedPoints().map((m, index) => {
          const value = m.measurementvalue;
          const interval = getIntervalByValue(value, intervals);

          return (
            <CircleMarker
              key={index}
              center={[m.latitude, m.longitude]}
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
                    percentile: interval?.minPercentile || 0,
                    position: [m.latitude, m.longitude] as LatLngExpression,
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
