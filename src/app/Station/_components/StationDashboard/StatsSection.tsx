import GeoJSONPointMap from '../../../common/GeoJSONPointMap/GeoJSONPointMap';
import { GetStationResponse } from '@upstream/upstream-api';
const StatsSection = ({ station }: { station: GetStationResponse }) => {
  const createGeoJSON = (
    geometry: GeoJSON.Geometry,
  ): GeoJSON.FeatureCollection => {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: geometry,
        },
      ],
    };
  };
  const data = createGeoJSON(station.geometry);
  console.log(JSON.stringify(data, null, 2));
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Station Coverage</h2>
      {station && station.geometry && <GeoJSONPointMap geoJSON={data} />}
    </div>
  );
};

export default StatsSection;
