import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { useDetail } from '../../hooks/campaign/useDetail';
import { Interval } from '../../hooks/campaign/useDetail';
import { useState } from 'react';
import Legend from './Legend';
import Tile from '../common/Tile/Tile';
import CarLine from '../common/CarLine/CarLine';
import { HeatMapDataPoint } from './types';
import MeasurementMarkers from './MeasurementMarkers';

export default function HeatMap() {
  const { measurements, intervals } = useDetail();
  const [selectedInterval, setSelectedInterval] = useState<Interval | null>(
    null,
  );
  const [selectedPoint, setSelectedPoint] = useState<HeatMapDataPoint | null>(
    null,
  );
  const coordinates = measurements.map((m) => [m.latitude, m.longitude]);

  // Filter measurements based on selected interval
  const filteredMeasurements = selectedInterval
    ? measurements.filter(
        (m) =>
          m.measurementvalue >= selectedInterval.minValue &&
          m.measurementvalue <= selectedInterval.maxValue,
      )
    : measurements;

  const filteredCoordinates = filteredMeasurements.map((m) => [
    m.latitude,
    m.longitude,
  ]);

  // Function to get a subset of points
  const getReducedPoints = () => {
    const maxPoints = 10000; // Adjust this number based on performance
    if (filteredCoordinates.length <= maxPoints) return filteredCoordinates;
    const step = Math.ceil(filteredCoordinates.length / maxPoints);
    return filteredCoordinates.filter((_, index) => index % step === 0);
  };

  // Calculate the center of the coordinates
  const getCenter = (): LatLngExpression | undefined => {
    if (!filteredCoordinates.length) return undefined;

    const lats = filteredCoordinates.map((coord) => coord[0]);
    const lngs = filteredCoordinates.map((coord) => coord[1]);

    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;

    return [centerLat, centerLng];
  };

  const title = (
    <>
      C<sub>3</sub>H<sub>4</sub>OH<sup>+</sup> Concentration
    </>
  );

  if (!measurements || !intervals) return null;
  return (
    <div className="h-screen w-full relative">
      <MapContainer center={getCenter()} zoom={10} className="h-full w-full">
        <Tile />
        <CarLine coordinates={coordinates as LatLngExpression[]} />
        <MeasurementMarkers
          coords={getReducedPoints() as LatLngExpression[]}
          measurements={filteredMeasurements}
          intervals={intervals}
          selectedPoint={selectedPoint}
          setSelectedPoint={setSelectedPoint}
        />
      </MapContainer>
      <Legend
        text={title}
        intervals={intervals}
        selectedInterval={selectedInterval}
        onIntervalSelect={setSelectedInterval}
      />
    </div>
  );
}
