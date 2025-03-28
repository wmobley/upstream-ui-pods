import * as React from 'react'; // v17.0.2
import { extent } from 'd3-array'; // v^2.12.1
import { line } from 'd3-shape'; // v^3.0.0
import { scaleLinear, ScaleLinear } from 'd3-scale'; // v^3.2.4
import { format } from 'd3-format';
import { MeasurementItem } from '@upstream/upstream-api';

const data = [
  { date: '2020-01-01', value: 1, timestamp: 1000 },
  { date: '2020-01-02', value: 2, timestamp: 2000 },
  { date: '2020-01-03', value: 3, timestamp: 3000 },
  { date: '2020-01-04', value: 4, timestamp: 4000 },
  { date: '2020-01-05', value: 5, timestamp: 5000 },
];

const new_data: MeasurementItem[] = [
  {
    id: 68908,
    sensorid: 38,
    variablename: null,
    collectiontime: new Date('2023-03-15T16:26:00'),
    variabletype: null,
    description: null,
    value: 0.248677831,
    geometry: {
      type: 'Point',
      coordinates: [-95.386677, 29.777058],
    },
  },
  {
    id: 68905,
    sensorid: 38,
    variablename: null,
    collectiontime: new Date('2023-03-15T16:26:00'),
    variabletype: null,
    description: null,
    value: 0.174488034,
    geometry: {
      type: 'Point',
      coordinates: [-95.386293, 29.777083],
    },
  },
  {
    id: 68897,
    sensorid: 38,
    variablename: null,
    collectiontime: new Date('2023-03-15T16:26:00'),
    variabletype: null,
    description: null,
    value: 0.246492712,
    geometry: {
      type: 'Point',
      coordinates: [-95.38526, 29.777178],
    },
  },
  {
    id: 68889,
    sensorid: 38,
    variablename: null,
    collectiontime: new Date('2023-03-15T16:26:00'),
    variabletype: null,
    description: null,
    value: 0.22345227,
    geometry: {
      type: 'Point',
      coordinates: [-95.38439, 29.777282],
    },
  },
  {
    id: 68910,
    sensorid: 38,
    variablename: null,
    collectiontime: new Date('2023-03-15T16:26:00'),
    variabletype: null,
    description: null,
    value: 0.273337957,
    geometry: {
      type: 'Point',
      coordinates: [-95.386948, 29.777052],
    },
  },
  {
    id: 68893,
    sensorid: 38,
    variablename: null,
    collectiontime: new Date('2023-03-15T16:26:00'),
    variabletype: null,
    description: null,
    value: 0.234385868,
    geometry: {
      type: 'Point',
      coordinates: [-95.3848, 29.777237],
    },
  },
  {
    id: 68899,
    sensorid: 38,
    variablename: null,
    collectiontime: new Date('2023-03-15T16:26:00'),
    variabletype: null,
    description: null,
    value: 0.196922949,
    geometry: {
      type: 'Point',
      coordinates: [-95.385525, 29.777155],
    },
  },
  {
    id: 68903,
    sensorid: 38,
    variablename: null,
    collectiontime: new Date('2023-03-15T16:26:00'),
    variabletype: null,
    description: null,
    value: 0.206870208,
    geometry: {
      type: 'Point',
      coordinates: [-95.386042, 29.777105],
    },
  },
  {
    id: 68898,
    sensorid: 38,
    variablename: null,
    collectiontime: new Date('2023-03-15T16:26:00'),
    variabletype: null,
    description: null,
    value: 0.203306633,
    geometry: {
      type: 'Point',
      coordinates: [-95.38539, 29.777167],
    },
  },
  {
    id: 68894,
    sensorid: 38,
    variablename: null,
    collectiontime: new Date('2023-03-15T16:26:00'),
    variabletype: null,
    description: null,
    value: 0.249520378,
    geometry: {
      type: 'Point',
      coordinates: [-95.384905, 29.777223],
    },
  },
  {
    id: 68890,
    sensorid: 38,
    variablename: null,
    collectiontime: new Date('2023-03-15T16:26:00'),
    variabletype: null,
    description: null,
    value: 0.272683828,
    geometry: {
      type: 'Point',
      coordinates: [-95.384488, 29.777272],
    },
  },
  {
    id: 68896,
    sensorid: 38,
    variablename: null,
    collectiontime: new Date('2023-03-15T16:26:00'),
    variabletype: null,
    description: null,
    value: 0.290021475,
    geometry: {
      type: 'Point',
      coordinates: [-95.385137, 29.777192],
    },
  },
  {
    id: 68902,
    sensorid: 38,
    variablename: null,
    collectiontime: new Date('2023-03-15T16:26:00'),
    variabletype: null,
    description: null,
    value: 0.233372155,
    geometry: {
      type: 'Point',
      coordinates: [-95.385917, 29.777117],
    },
  },
  {
    id: 68913,
    sensorid: 38,
    variablename: null,
    collectiontime: new Date('2023-03-15T16:26:00'),
    variabletype: null,
    description: null,
    value: 0.191564555,
    geometry: {
      type: 'Point',
      coordinates: [-95.387372, 29.777043],
    },
  },
  {
    id: 68895,
    sensorid: 38,
    variablename: null,
    collectiontime: new Date('2023-03-15T16:26:00'),
    variabletype: null,
    description: null,
    value: 0.239854889,
    geometry: {
      type: 'Point',
      coordinates: [-95.385017, 29.777207],
    },
  },
];

interface DataPoint {
  date: string;
  value: number;
  timestamp: number;
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
  const width = 800;
  const height = 400;
  const margin = { top: 10, right: 100, bottom: 30, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // read from pre-defined metric/dimension ("fields") bundles
  const xField = fields.timestamp;
  const yField = fields.value;

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
  xAccessor: (d: DataPoint) => number;
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
    formatter: (value: string) => value,
  },
  value: {
    accessor: (d: DataPoint) => d.value,
    title: 'Value',
    formatter: format('.1f'),
  },
  timestamp: {
    accessor: (d: DataPoint) => d.timestamp,
    title: 'Timestamp',
    formatter: format('.1f'),
  },
};
