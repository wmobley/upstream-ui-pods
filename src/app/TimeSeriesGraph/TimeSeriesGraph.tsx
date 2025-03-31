import * as React from 'react';
import { useList } from '../../hooks/measurements/useList';
import TimeSeriesChart, { DataPoint } from '../TimeSeriesChart';

const TimeSeriesGraph = () => {
  const { data: response, isLoading, error } = useList('1', '19', '44', 1000);
  const [data, setData] = React.useState<DataPoint[] | null>(null);

  React.useEffect(() => {
    const points: DataPoint[] =
      response?.items.map(
        (item) =>
          ({
            date: item.collectiontime,
            value: item.value,
          }) as DataPoint,
      ) || [];
    setData(points);
  }, [response]);

  if (!data || isLoading || error) {
    return <div>Loading...</div>;
  }
  if (data && data.length === 0) {
    return <div>No data</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p> Number of points: {response?.size}</p>
      <TimeSeriesChart
        data={data}
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
          return new Date(date).toLocaleTimeString();
        }}
        yFormatter={(value: number) => value.toFixed(1)}
      />
    </div>
  );
};

export default TimeSeriesGraph;
