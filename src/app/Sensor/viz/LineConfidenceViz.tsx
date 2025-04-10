import { useState } from 'react';
import { useListConfidenceValues } from '../../../hooks/measurements/useListConfidenceValues';
import LineConfidenceChart from '../../LineConfidenceChart';
import QueryWrapper from '../../common/QueryWrapper';
import { formatNumber } from '../../common/NumberFormatter/NumberFortatterUtils';
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
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    [number, number] | null
  >(null);

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      {data && (
        <div className="flex flex-col items-center justify-center h-screen">
          <LineConfidenceChart
            data={data}
            width={1600}
            height={800}
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
        </div>
      )}
    </QueryWrapper>
  );
};

export default LineConfidenceViz;
