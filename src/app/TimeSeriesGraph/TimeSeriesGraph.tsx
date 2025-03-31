import TimeSeriesChart from '../TimeSeriesChart';
import { useProcessedMeasurements } from '../../hooks/measurements/useProcessedMeasurements';
import { useState } from 'react';

const TimeSeriesGraph = () => {
  const containerWidth = 1600;
  const { downsampledData, isLoading, error } = useProcessedMeasurements(
    '1',
    '7 ',
    '38',
    containerWidth,
  );

  // Add state for selected time range
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    [number, number] | null
  >(null);

  if (!downsampledData || isLoading || error) {
    return <div>Loading...</div>;
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
    <div className="flex flex-col items-center justify-center h-screen">
      <p>Number of points: {displayData.length}</p>
      <TimeSeriesChart
        data={downsampledData}
        width={1600}
        height={800}
        margin={{ top: 10, right: 100, bottom: 100, left: 50 }}
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
            return dateObj.toLocaleTimeString();
          }
          // For overview - show date
          return dateObj.toLocaleDateString();
        }}
        yFormatter={(value: number) => value.toFixed(1)}
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
  );
};

export default TimeSeriesGraph;
