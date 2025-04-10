import TimeSeriesChart from '../ScatterTimeSeriesChart';
import { useState } from 'react';
import { useList } from '../../hooks/measurements/useList';
import QueryWrapper from '../common/QueryWrapper';
import { DataPoint } from '../../utils/dataProcessing';
import { formatNumber } from '../common/NumberFormatter/NumberFortatterUtils';
interface TimeSeriesGraphProps {
  campaignId: string;
  stationId: string;
  sensorId: string;
  initialDownsampleThreshold?: number;
}

const TimeSeriesGraph = ({
  campaignId,
  stationId,
  sensorId,
  initialDownsampleThreshold,
}: TimeSeriesGraphProps) => {
  const [downsampleThreshold] = useState<number>(
    initialDownsampleThreshold ?? 5000,
  );
  const { data, isLoading, error } = useList(
    campaignId,
    stationId,
    sensorId,
    500000,
    downsampleThreshold,
  );
  const downsampledData = data?.items.map(
    (item) =>
      ({
        timestamp: item.collectiontime,
        value: item.value,
        geometry: item.geometry,
      }) as DataPoint,
  );

  // Add state for selected time range
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    [number, number] | null
  >(null);

  if (!downsampledData || isLoading || error) {
    return (
      <QueryWrapper isLoading={isLoading} error={error}>
        <></>
      </QueryWrapper>
    );
  }
  if (downsampledData && downsampledData.length === 0) {
    return <div>No data</div>;
  }

  // Filter data based on selected time range if needed
  const displayData = selectedTimeRange
    ? downsampledData.filter(
        (point) =>
          point.timestamp.getTime() >= selectedTimeRange[0] &&
          point.timestamp.getTime() <= selectedTimeRange[1],
      )
    : downsampledData;

  return (
    <QueryWrapper isLoading={isLoading || !downsampledData} error={error}>
      <div className="flex flex-col items-center justify-center h-screen">
        <TimeSeriesChart
          data={downsampledData}
          margin={{ top: 10, right: 100, bottom: 100, left: 100 }}
          showArea={false}
          showLine={false}
          showPoints={true}
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
          yFormatter={(value: number) => formatNumber(value)}
          onBrush={(domain) => {
            setSelectedTimeRange(domain);
            console.log(
              'Selected time range:',
              new Date(domain[0]),
              'to',
              new Date(domain[1]),
            );
          }}
        />
      </div>
    </QueryWrapper>
  );
};

export default TimeSeriesGraph;
