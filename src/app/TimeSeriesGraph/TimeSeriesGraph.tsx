import TimeSeriesChart from '../TimeSeriesChart';
import { useProcessedMeasurements } from '../../hooks/measurements/useProcessedMeasurements';

const TimeSeriesGraph = () => {
  const containerWidth = 1600;
  const { downsampledData, aggregatedData, isLoading, error } =
    useProcessedMeasurements('1', '7 ', '38', containerWidth);

  if (!downsampledData || isLoading || error) {
    return <div>Loading...</div>;
  }
  if (downsampledData && downsampledData.length === 0) {
    return <div>No data</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p> Number of points: {downsampledData.length}</p>
      <TimeSeriesChart
        data={downsampledData}
        width={1600}
        height={800}
        margin={{ top: 10, right: 100, bottom: 100, left: 50 }}
        showArea={false}
        showLine={true}
        showPoints={false}
        colors={{
          line: '#9a6fb0',
          area: '#9a6fb0',
          point: '#9a6fb0',
        }}
        xAxisTitle="Date"
        yAxisTitle="Value"
        xFormatter={(date: Date | number) => {
          if (date instanceof Date) {
            return date.toISOString();
          }
          return new Date(date).toDateString();
        }}
        yFormatter={(value: number) => value.toFixed(1)}
      />
    </div>
  );
};

export default TimeSeriesGraph;
