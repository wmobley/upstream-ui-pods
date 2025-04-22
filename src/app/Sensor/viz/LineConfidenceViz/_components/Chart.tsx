import { useList } from '../../../../../hooks/measurements/useList';
import { useListConfidenceValues } from '../../../../../hooks/measurements/useListConfidenceValues';
import LineConfidenceChart from '../../../../LineConfidenceChart';
import { formatNumber } from '../../../../common/NumberFormatter/NumberFortatterUtils';
import QueryWrapper from '../../../../common/QueryWrapper';

type AggregationInterval =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month';

export const Chart = ({
  campaignId,
  stationId,
  sensorId,
  selectedTimeRange,
  setSelectedTimeRange,
  aggregationInterval,
}: {
  campaignId: string;
  stationId: string;
  sensorId: string;
  selectedTimeRange: [number, number] | null;
  setSelectedTimeRange: (domain: [number, number]) => void;
  aggregationInterval: AggregationInterval;
}) => {
  const aggregationValue = aggregationInterval === 'second' ? 10 : 1;

  const { data, isLoading, error } = useListConfidenceValues(
    campaignId,
    stationId,
    sensorId,
    aggregationInterval,
    aggregationValue,
  );

  const {
    data: allPoints,
    isLoading: isLoadingAllPoints,
    error: errorAllPoints,
  } = useList(campaignId, stationId, sensorId);

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
        />
      )}
    </QueryWrapper>
  );
};
