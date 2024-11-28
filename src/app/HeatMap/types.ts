import { LatLngExpression } from 'leaflet';

export type HeatMapDataPoint = {
  value: number;
  percentile: number;
  position: LatLngExpression;
};
