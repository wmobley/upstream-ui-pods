import RouterMap from '../../RouterMap/RouterMap';
import { ListMeasurementsResponsePagination } from '@upstream/upstream-api';
const StatsSection = ({
  data,
}: {
  data: ListMeasurementsResponsePagination | null;
}) => {
  if (data === null) return null;
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Sensor Route</h2>
      <div className="h-3/4 w-full">
        <RouterMap measurements={data?.items} />
      </div>
    </div>
  );
};

export default StatsSection;
