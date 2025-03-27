import { useList } from '../../../hooks/measurements/useList';
import RouterMap from '../../RouterMap/RouterMap';
import QueryWrapper from '../../common/QueryWrapper';
interface MeasurementsSummaryProps {
  campaignId: string;
  stationId: string;
  sensorId: string;
}

const RouteMapViz = ({
  campaignId,
  stationId,
  sensorId,
}: MeasurementsSummaryProps) => {
  const { data, isLoading, error } = useList(campaignId, stationId, sensorId);
  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      {data?.items && (
        <>
          <RouterMap measurements={data?.items} />
        </>
      )}
    </QueryWrapper>
  );
};

export default RouteMapViz;
