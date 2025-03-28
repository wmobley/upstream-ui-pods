import * as React from 'react';
import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { format } from 'd3-format';
import { useList } from '../../hooks/measurements/useList';
import Points from './_components/Points';
import Line from './_components/Line';
import XAxis from './_components/XAxis';
import YAxis from './_components/YAxis';
import Area from './_components/Area';

interface DataPoint {
  date: Date;
  value: number;
}

// metrics (numeric) + dimensions (non-numeric) = fields
const fields = {
  date: {
    accessor: (d: DataPoint) => d.date,
    title: 'Date',
    formatter: (date: Date | number) => {
      if (date instanceof Date) {
        return date.toISOString();
      }
      return new Date(date).toLocaleTimeString();
    },
  },
  value: {
    accessor: (d: DataPoint) => d.value,
    title: 'Value',
    formatter: format('.1f'),
  },
};

const TimeSeriesGraph = () => {
  const { data: response, isLoading, error } = useList('1', '19', '44', 10000);
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

  const width = 1600;
  const height = 800;
  const margin = { top: 10, right: 100, bottom: 100, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // read from pre-defined metric/dimension ("fields") bundles
  const xField = fields.date;
  const yField = fields.value;

  // optionally pull out values into local variables
  const { accessor: xAccessor, title: xTitle, formatter: xFormatter } = xField;

  const yAccessor = yField.accessor;
  const yTitle = yField.title;
  const yFormatter = yField.formatter;

  if (!data) {
    return <div style={{ width, height }} />;
  }

  const xExtent = extent(data, xAccessor);
  const yExtent = extent(data, yAccessor);

  if (!xExtent[0] || !xExtent[1] || !yExtent[0] || !yExtent[1]) {
    return <div>Invalid data</div>;
  }

  const xScale = scaleLinear()
    .domain([xExtent[0].getTime(), xExtent[1].getTime()])
    .range([0, innerWidth]);
  const yScale = scaleLinear().domain([0, yExtent[1]]).range([innerHeight, 0]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left} ${margin.top})`}>
          <XAxis
            xScale={xScale}
            formatter={xFormatter as (value: number | Date) => string}
            title={xTitle}
            innerHeight={innerHeight}
          />
          <Area
            data={data}
            xScale={xScale}
            yScale={yScale}
            xAccessor={xAccessor}
            yAccessor={yAccessor}
          />
          {/* <Points
            radius={3}
            data={data}
            xScale={xScale}
            yScale={yScale}
            xAccessor={xAccessor}
            yAccessor={yAccessor}
          /> */}
          <YAxis yScale={yScale} formatter={yFormatter} title={yTitle} />
        </g>
      </svg>
    </div>
  );
};

export default TimeSeriesGraph;
