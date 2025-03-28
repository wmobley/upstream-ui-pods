import * as React from 'react'; // v17.0.2
import { extent } from 'd3-array'; // v^2.12.1
import { line } from 'd3-shape'; // v^3.0.0
import { scaleLinear, ScaleLinear } from 'd3-scale'; // v^3.2.4
import { format } from 'd3-format';
import { useList } from '../../hooks/measurements/useList';

interface DataPoint {
  date: Date;
  value: number;
}

interface OutlinedSvgTextProps {
  stroke: string;
  strokeWidth: number;
  children: React.ReactNode;
  [key: string]: unknown;
}

interface AxisProps {
  title: string;
  formatter: (value: number | Date) => string;
}

interface YAxisProps extends AxisProps {
  yScale: ScaleLinear<number, number>;
}

interface XAxisProps extends AxisProps {
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
}

const TimeSeriesGraph = () => {
  const { data: response, isLoading, error } = useList('1', '7', '38');
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
  console.log(data);

  const width = 1600;
  const height = 800;
  const margin = { top: 10, right: 100, bottom: 30, left: 50 };
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

  const xExtent = extent(data, xAccessor) as [Date, Date];
  const yExtent = extent(data, yAccessor) as [number, number];
  const xScale = scaleLinear()
    .domain([xExtent[0].getTime(), xExtent[1].getTime()])
    .range([0, innerWidth]);
  const yScale = scaleLinear().domain(yExtent).range([innerHeight, 0]);

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
          <Line
            data={data}
            xScale={xScale}
            yScale={yScale}
            xAccessor={xAccessor}
            yAccessor={yAccessor}
          />
          {/* <Points
            radius={radius}
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

interface LineProps {
  data: DataPoint[];
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  xAccessor: (d: DataPoint) => number | Date;
  yAccessor: (d: DataPoint) => number;
}
const Line = ({ data, xScale, yScale, xAccessor, yAccessor }: LineProps) => {
  const lineBuilder = line<DataPoint>()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));
  const path = lineBuilder(data);
  return <path d={path} stroke="#9a6fb0" fill="none" strokeWidth={2} />;
};

/** fancier way of getting a nice svg text stroke */
const OutlinedSvgText: React.FC<OutlinedSvgTextProps> = ({
  stroke,
  strokeWidth,
  children,
  ...other
}) => {
  return (
    <>
      <text stroke={stroke} strokeWidth={strokeWidth} {...other}>
        {children}
      </text>
      <text {...other}>{children}</text>
    </>
  );
};

/** determine number of ticks based on space available  */
function numTicksForPixels(
  pixelsAvailable: number,
  pixelsPerTick = 70,
): number {
  return Math.floor(Math.abs(pixelsAvailable) / pixelsPerTick);
}

/** Y-axis with title  */
const YAxis: React.FC<YAxisProps> = ({ yScale, title, formatter }) => {
  const [yMin, yMax] = yScale.range();
  const ticks = yScale.ticks(numTicksForPixels(yMin - yMax, 50));

  return (
    <g data-testid="YAxis">
      <OutlinedSvgText
        stroke="#fff"
        strokeWidth={2.5}
        dx={4}
        dy="0.8em"
        fill="var(--gray-600)"
        className="font-semibold text-2xs"
      >
        {title}
      </OutlinedSvgText>

      <line x1={0} x2={0} y1={yMin} y2={yMax} stroke="var(--gray-400)" />
      {ticks.map((tick: number) => {
        const y = yScale(tick);
        return (
          <g key={tick} transform={`translate(0 ${y})`}>
            <text
              dy="0.34em"
              textAnchor="end"
              dx={-12}
              fill="currentColor"
              className="text-gray-400 text-2xs"
            >
              {formatter(tick)}
            </text>
            <line x1={0} x2={-8} stroke="var(--gray-300)" />
          </g>
        );
      })}
    </g>
  );
};

/** X-axis with title, uses CSS for text stroke  */
const XAxis: React.FC<XAxisProps> = ({
  xScale,
  title,
  formatter,
  innerHeight,
}) => {
  const [xMin, xMax] = xScale.range();
  const ticks = xScale.ticks(numTicksForPixels(xMax - xMin));

  return (
    <g data-testid="XAxis" transform={`translate(0 ${innerHeight})`}>
      <text
        x={xMax}
        textAnchor="end"
        dy={-4}
        fill="var(--gray-600)"
        className="font-semibold text-2xs"
        style={{
          textShadow: `-1px -1px 1px #fff,
                        1px -1px 1px #fff,
                        1px 1px 1px #fff,
                       -1px 1px 1px #fff`,
        }}
      >
        {title}
      </text>

      <line x1={xMin} x2={xMax} y1={0} y2={0} stroke="var(--gray-400)" />
      {ticks.map((tick: number) => {
        const x = xScale(tick);
        return (
          <g key={tick} transform={`translate(${x} 0)`}>
            <text
              y={10}
              dy="0.8em"
              textAnchor="middle"
              fill="currentColor"
              className="text-gray-400 text-2xs"
            >
              {formatter(tick)}
            </text>
            <line y1={0} y2={8} stroke="var(--gray-300)" />
          </g>
        );
      })}
    </g>
  );
};
// metrics (numeric) + dimensions (non-numeric) = fields
const fields = {
  date: {
    accessor: (d: DataPoint) => d.date,
    title: 'Date',
    formatter: (date: Date | number) => {
      if (date instanceof Date) {
        return date.toISOString();
      }
      return new Date(date).toLocaleDateString();
    },
  },
  value: {
    accessor: (d: DataPoint) => d.value,
    title: 'Value',
    formatter: format('.1f'),
  },
};
