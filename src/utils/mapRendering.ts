import { MeasurementItem } from '@upstream/upstream-api';
import { LatLngExpression } from 'leaflet';

export const getReducedPoints = (filteredMeasurements: MeasurementItem[]) => {
  const maxPoints = 10000; // Adjust this number based on performance
  if (filteredMeasurements.length <= maxPoints) return filteredMeasurements;

  const step = Math.ceil(filteredMeasurements.length / maxPoints);
  return filteredMeasurements.filter((_, index) => index % step === 0);
};

// Calculate the center of the coordinates
export const getCenter = (
  filteredMeasurements: MeasurementItem[],
): LatLngExpression | undefined => {
  const reducedPoints = getReducedPoints(filteredMeasurements);
  if (!reducedPoints.length) return undefined;

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  // Find min and max values in a single pass
  reducedPoints.forEach((m) => {
    const lat = m.geometry?.coordinates[1];
    const lng = m.geometry?.coordinates[0];
    if (lat !== undefined && lng !== undefined) {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    }
  });

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  return [centerLat, centerLng];
};
