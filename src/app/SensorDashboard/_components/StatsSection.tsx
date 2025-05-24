import RouterMap from '../../RouterMap/RouterMap';
import { useList } from '../../../hooks/measurements/useList';
import QueryWrapper from '../../common/QueryWrapper';
interface StatsSectionProps {
  campaignId: string;
  stationId: string;
  sensorId: string;
}
const StatsSection = ({
  campaignId,
  stationId,
  sensorId,
}: StatsSectionProps) => {
  const { data, isLoading, error } = useList(
    campaignId,
    stationId,
    sensorId,
    500,
    500,
  );
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Sensor Route</h2>
      <QueryWrapper isLoading={isLoading} error={error}>
        {data && (
          <div className="h-3/4 w-full">
            <RouterMap measurements={data?.items} showPoints={false} />
          </div>
        )}
      </QueryWrapper>
    </div>
  );
};

export default StatsSection;
