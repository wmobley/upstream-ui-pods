import * as React from 'react'; // v17.0.2
import { extent } from 'd3-array'; // v^2.12.1
import { csvParse } from 'd3-dsv'; // v^2.0.0
import { format } from 'd3-format'; // v^2.0.0
import { scaleLinear, ScaleLinear } from 'd3-scale'; // v^3.2.4

interface DataPoint {
  revenue: number;
  vote_average: number;
  original_title: string;
  budget: number;
}

interface OutlinedSvgTextProps {
  stroke: string;
  strokeWidth: number;
  children: React.ReactNode;
  [key: string]: unknown;
}

interface AxisProps {
  title: string;
  formatter: (value: number) => string;
}

interface YAxisProps extends AxisProps {
  yScale: ScaleLinear<number, number>;
}

interface XAxisProps extends AxisProps {
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
}

const TimeSeriesGraph = () => {
  const data = useMovieData();

  const width = 800;
  const height = 400;
  const margin = { top: 10, right: 100, bottom: 30, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // read from pre-defined metric/dimension ("fields") bundles
  const xField = fields.revenue;
  const yField = fields.vote_average;

  // optionally pull out values into local variables
  const { accessor: xAccessor, title: xTitle, formatter: xFormatter } = xField;

  const yAccessor = yField.accessor;
  const yTitle = yField.title;
  const yFormatter = yField.formatter;

  if (!data) {
    return <div style={{ width, height }} />;
  }

  const radius = 4;
  const xExtent = extent(data, xAccessor) as [number, number];
  const yExtent = extent(data, yAccessor) as [number, number];
  const xScale = scaleLinear().domain(xExtent).range([0, innerWidth]);
  const yScale = scaleLinear().domain(yExtent).range([innerHeight, 0]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left} ${margin.top})`}>
          <XAxis
            xScale={xScale}
            formatter={xFormatter}
            title={xTitle}
            innerHeight={innerHeight}
          />
          <Points
            radius={radius}
            data={data}
            xScale={xScale}
            yScale={yScale}
            xAccessor={xAccessor}
            yAccessor={yAccessor}
          />
          <YAxis yScale={yScale} formatter={yFormatter} title={yTitle} />
        </g>
      </svg>
    </div>
  );
};
export default TimeSeriesGraph;

interface PointsProps {
  data: DataPoint[];
  xScale: ScaleLinear<number, number>;
  xAccessor: (d: DataPoint) => number;
  yAccessor: (d: DataPoint) => number;
  yScale: ScaleLinear<number, number>;
  radius?: number;
}

/** Draws a circle for each point in our data */
const Points = ({
  data,
  xScale,
  xAccessor,
  yAccessor,
  yScale,
  radius = 8,
}: PointsProps) => {
  return (
    <g data-testid="Points">
      {data.map((d) => {
        // without a scale, we have to compute the math ourselves
        // const x = (width * (d.revenue - minRevenue)) / (maxRevenue - minRevenue)
        // but scales make it easier for us to think about.

        const x = xScale(xAccessor(d));
        const y = yScale(yAccessor(d));
        return (
          <circle
            key={d.original_title}
            cx={x}
            cy={y}
            r={radius}
            className="text-indigo-500 hover:text-yellow-500"
            fill="currentColor"
            stroke="white"
            strokeWidth={0.5}
            strokeOpacity={1}
            fillOpacity={0.8}
            onClick={() => console.log(d)}
          />
        );
      })}
    </g>
  );
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

// fetch our data from CSV and translate to JSON
const useMovieData = () => {
  const [data, setData] = React.useState<DataPoint[]>([]);

  React.useEffect(() => {
    fetch('https://reactviz.com/datasets/tmdb_1000_movies_small.csv')
      .then((response) => response.text())
      .then((csvString) => {
        const data = csvParse(csvString, (row) => {
          return {
            budget: +row.budget,
            vote_average: +row.vote_average,
            revenue: +row.revenue,
            original_title: row.original_title,
          };
        });

        console.log('[data]', data);

        setData(data);
      });
  }, []);

  return data;
};

// very lazy large number money formatter ($1.5M, $1.65B etc)
const bigMoneyFormat = (value: number): string => {
  if (value == null) return '0';
  const formatted = format('$~s')(value);
  return formatted.replace(/G$/, 'B');
};

// metrics (numeric) + dimensions (non-numeric) = fields
const fields = {
  revenue: {
    accessor: (d: DataPoint) => d.revenue,
    title: 'Revenue',
    formatter: bigMoneyFormat,
  },
  budget: {
    accessor: (d: DataPoint) => d.budget,
    title: 'Budget',
    formatter: bigMoneyFormat,
  },
  vote_average: {
    accessor: (d: DataPoint) => d.vote_average,
    title: 'Vote Average out of 10',
    formatter: format('.1f'),
  },
};
