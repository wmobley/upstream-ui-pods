export const createGoogleStreetViewUrl = (params: {
  latitude: number;
  longitude: number;
  heading?: number;
  pitch?: number;
  zoom?: number;
}) => {
  const { latitude, longitude, heading = 90, pitch = 10, zoom = 3 } = params;

  return `https://www.google.com/maps/@${latitude},${longitude},${zoom}a,75y,${heading}h,${pitch}t/data=!3m1!1e1`;
};

// Example usage:
// const link = createGoogleStreetViewUrl({
//     latitude: -32.9278015,
//     longitude: -71.5181699,
//     heading: 90,
//     pitch: 0
// });
