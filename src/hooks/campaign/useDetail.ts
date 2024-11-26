import { useState, useEffect } from 'react';

interface Sensor {
  alias: number;
  BestGuessFormula: string;
  postprocess: boolean;
  postprocessscript: string | null;
  units: string;
  datatype: number;
}

interface Measurement {
  measurementvalue: number;
  collectiontime: string;
  variablename: string;
  geometry: string;
}

interface MeasurementPoint {
  measurementvalue: number;
  collectiontime: string;
  variablename: string;
  latitude: number;
  longitude: number;
}

interface SensorData {
  sensor: Sensor;
  measurement: Measurement[];
}

// Add this helper function to parse geometry string
const parseGeometry = (geometry: string): [number, number] | null => {
  try {
    // Assuming format is "POINT(longitude latitude)"
    const coords = geometry
      .replace('POINT (', '')
      .replace(')', '')
      .split(' ')
      .map(Number);
    // Leaflet expects [latitude, longitude]
    return [coords[1], coords[0]];
  } catch (err) {
    console.error('Error parsing geometry:', err);
    return null;
  }
};

export const useDetail = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data.json');
        const data = await response.json();
        setSensorData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to load sensor data'),
        );
        console.error('Error loading sensor data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array means this effect runs once on mount

  // Add coordinates transformation
  const measurements: MeasurementPoint[] =
    sensorData?.measurement
      .map((m) => ({
        measurementvalue: m.measurementvalue,
        collectiontime: m.collectiontime,
        variablename: m.variablename,
        latitude: parseGeometry(m.geometry)?.[0],
        longitude: parseGeometry(m.geometry)?.[1],
      }))
      .filter((coord): coord is MeasurementPoint => !!coord) ?? [];

  return {
    sensorData,
    measurements, // Add coordinates to the return object
    loading,
    error,
  };
};
