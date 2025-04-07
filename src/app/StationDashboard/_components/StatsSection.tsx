import { GetStationResponse } from '@upstream/upstream-api';
import GeometryMap from '../../common/GeometryMap/GeometryMap';
const StatsSection = ({ station }: { station: GetStationResponse }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Station Coverage</h2>

      <div className="h-3/4 w-full">
        {station && station.geometry && (
          <GeometryMap geoJSON={station.geometry as GeoJSON.Geometry} />
        )}
      </div>
    </div>
  );
};

export default StatsSection;
