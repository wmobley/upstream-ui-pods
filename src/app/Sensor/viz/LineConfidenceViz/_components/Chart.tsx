import LineConfidenceChart from '../../../../LineConfidenceChart';
import { formatNumber } from '../../../../common/NumberFormatter/NumberFortatterUtils';
import QueryWrapper from '../../../../common/QueryWrapper';
import { useLineConfidence } from '../context/LineConfidenceContext';

export const Chart = () => {
  // Get the time range from context
  const {
    selectedTimeRange,
    setSelectedTimeRange,
    aggregatedData,
    aggregatedLoading,
    aggregatedError,
    allPoints,
  } = useLineConfidence();

  return (
    <QueryWrapper isLoading={aggregatedLoading} error={aggregatedError}>
      {aggregatedData && (
        <LineConfidenceChart
          data={aggregatedData}
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
          maxValue={Math.max(...aggregatedData.map((item) => item.maxValue))}
          minValue={Math.min(...aggregatedData.map((item) => item.minValue))}
        />
      )}
    </QueryWrapper>
  );
};
