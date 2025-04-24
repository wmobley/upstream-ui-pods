import { useList } from '../../../../../hooks/measurements/useList';
import { useListConfidenceValues } from '../../../../../hooks/measurements/useListConfidenceValues';
import LineConfidenceChart from '../../../../LineConfidenceChart';
import { formatNumber } from '../../../../common/NumberFormatter/NumberFortatterUtils';
import QueryWrapper from '../../../../common/QueryWrapper';
import { useLineConfidence } from '../context/LineConfidenceContext';

type AggregationInterval =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month';

interface ChartProps {
  campaignId: string;
  stationId: string;
  sensorId: string;
  aggregationInterval: AggregationInterval;
}

export const Chart = ({
  campaignId,
  stationId,
  sensorId,
  aggregationInterval,
}: ChartProps) => {
  // Get the time range from context
  const { selectedTimeRange, setSelectedTimeRange } = useLineConfidence();

  const aggregationValue = aggregationInterval === 'second' ? 10 : 1;

  const { data, isLoading, error } = useListConfidenceValues(
    campaignId,
    stationId,
    sensorId,
    aggregationInterval,
    aggregationValue,
  );

  const { data: allPoints } = useList(campaignId, stationId, sensorId);

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      {data && (
        <LineConfidenceChart
          data={data}
          allPoints={allPoints?.items ?? []}
          margin={{ top: 10, right: 100, bottom: 100, left: 100 }}
          colors={{
            line: '#9a6fb0',
            area: '#9a6fb0',
            point: '#9a6fb0',
          }}
          xAxisTitle="Date"
          yAxisTitle="Value"
          xFormatter={(date: Date | number) => {
            const dateObj = date instanceof Date ? date : new Date(date);
            // For main chart - show time
            if (selectedTimeRange) {
              return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
            }
            // For overview - show date
            return dateObj.toLocaleDateString();
          }}
          xFormatterOverview={(date: Date | number) => {
            const dateObj = date instanceof Date ? date : new Date(date);
            return dateObj.toLocaleDateString();
          }}
          yFormatter={(value: number) => {
            return formatNumber(value);
          }}
          onBrush={(domain) => {
            setSelectedTimeRange(domain);
          }}
          maxValue={Math.max(...data.map((item) => item.maxValue))}
          minValue={Math.min(...data.map((item) => item.minValue))}
        />
      )}
    </QueryWrapper>
  );
};
