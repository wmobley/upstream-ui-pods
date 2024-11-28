import { LatLngExpression } from 'leaflet';

export const createGoogleStreetViewUrl = (params: {
  position: LatLngExpression;
  heading?: number;
  pitch?: number;
  zoom?: number;
}) => {
  const { position, heading = 0, pitch = 90, zoom = 10 } = params;
  const [latitude, longitude] = position as [number, number];

  return `https://www.google.com/maps/@${latitude},${longitude},${zoom}a,75y,${heading}h,${pitch}t/data=!3m1!1e1`;
};
