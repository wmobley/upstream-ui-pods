import { useList } from '../../../hooks/measurements/useList';
import RouterMap from '../../RouterMap/RouterMap';
import QueryWrapper from '../../common/QueryWrapper';
interface MeasurementsSummaryProps {
  campaignId: string;
  stationId: string;
  sensorId: string;
}

const LineConfidenceViz = ({
  campaignId,
  stationId,
  sensorId,
}: MeasurementsSummaryProps) => {
  const { data, isLoading, error } = useList(
    campaignId,
    stationId,
    sensorId,
    500000,
    5000,
  );
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

export default LineConfidenceViz;
