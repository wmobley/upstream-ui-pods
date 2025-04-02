import { useList } from '../../../hooks/measurements/useList';
import { useListConfidenceValues } from '../../../hooks/measurements/useListConfidenceValues';
import LineConfidenceChart from '../../LineConfidenceChart';
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
  const { data, isLoading, error } = useListConfidenceValues(
    campaignId,
    stationId,
    sensorId,
  );
  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      {data && (
        <>
          <LineConfidenceChart
            data={data}
            width={1600}
            height={800}
            gapThresholdMinutes={120}
          />
        </>
      )}
    </QueryWrapper>
  );
};

export default LineConfidenceViz;
