import { GetStationResponse } from '@upstream/upstream-api';
import GeometryMap from '../../../common/GeometryMap/GeometryMap';
const StatsSection = ({ station }: { station: GetStationResponse }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Station Coverage</h2>
      {station && station.geometry && (
        <GeometryMap geoJSON={station.geometry} />
      )}
    </div>
  );
};

export default StatsSection;
