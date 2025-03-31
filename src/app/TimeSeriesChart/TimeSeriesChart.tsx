import * as React from 'react';
import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { format } from 'd3-format';
import { line, curveCatmullRom, area } from 'd3-shape';

// Types
export interface DataPoint {
  timestamp: Date;
  value: number;
}

export interface TimeSeriesChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  showArea?: boolean;
  showLine?: boolean;
  showPoints?: boolean;
  pointRadius?: number;
  colors?: {
    line?: string;
    area?: string;
    point?: string;
  };
  xAxisTitle?: string;
  yAxisTitle?: string;
  xFormatter?: (date: Date | number) => string;
  yFormatter?: (value: number) => string;
}

// Default props
const defaultProps: Partial<TimeSeriesChartProps> = {
  width: 800,
  height: 400,
  margin: { top: 20, right: 30, bottom: 30, left: 40 },
  showArea: true,
  showLine: true,
  showPoints: false,
  pointRadius: 3,
  colors: {
    line: '#9a6fb0',
    area: '#9a6fb0',
    point: '#9a6fb0',
  },
  xAxisTitle: 'Time',
  yAxisTitle: 'Value',
  xFormatter: (date: Date | number) => {
    if (date instanceof Date) {
      return date.toLocaleTimeString();
    }
    return new Date(date).toLocaleTimeString();
  },
  yFormatter: format('.1f'),
};

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  width = defaultProps.width!,
  height = defaultProps.height!,
  margin = defaultProps.margin!,
  showArea = defaultProps.showArea!,
  showLine = defaultProps.showLine!,
  showPoints = defaultProps.showPoints!,
  pointRadius = defaultProps.pointRadius!,
  colors = defaultProps.colors!,
  xAxisTitle = defaultProps.xAxisTitle!,
  yAxisTitle = defaultProps.yAxisTitle!,
  xFormatter = defaultProps.xFormatter!,
  yFormatter = defaultProps.yFormatter!,
}) => {
  // Refs for D3
  const svgRef = React.useRef<SVGSVGElement>(null);

  // Memoize calculations
  const dimensions = React.useMemo(() => {
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    return { innerWidth, innerHeight };
  }, [width, height, margin]);

  // Memoize scales
  const scales = React.useMemo(() => {
    const xExtent = extent(data, (d) => d.timestamp.getTime());
    const yExtent = extent(data, (d) => d.value);

    if (!xExtent[0] || !xExtent[1] || !yExtent[0] || !yExtent[1]) {
      return null;
    }

    const xScale = scaleLinear()
      .domain([xExtent[0], xExtent[1]])
      .range([0, dimensions.innerWidth]);

    const yScale = scaleLinear()
      .domain([0, yExtent[1]])
      .range([dimensions.innerHeight, 0]);

    return { xScale, yScale };
  }, [data, dimensions.innerWidth, dimensions.innerHeight]);

  // Memoize path generators
  const paths = React.useMemo(() => {
    if (!scales) return null;

    const lineGenerator = line<DataPoint>()
      .x((d) => scales.xScale(d.timestamp.getTime()))
      .y((d) => scales.yScale(d.value))
      .curve(curveCatmullRom.alpha(0.5));

    const areaGenerator = area<DataPoint>()
      .x((d) => scales.xScale(d.timestamp.getTime()))
      .y0(() => scales.yScale(0))
      .y1((d) => scales.yScale(d.value))
      .curve(curveCatmullRom.alpha(0.5));

    return {
      linePath: lineGenerator(data),
      areaPath: areaGenerator(data),
    };
  }, [data, scales]);

  // Memoize axis ticks
  const axisTicks = React.useMemo(() => {
    if (!scales) return null;

    const xTicks = scales.xScale.ticks(5).map((tick) => ({
      value: tick,
      label: xFormatter(tick),
      x: scales.xScale(tick),
    }));

    const yTicks = scales.yScale.ticks(5).map((tick) => ({
      value: tick,
      label: yFormatter(tick),
      y: scales.yScale(tick),
    }));

    return { xTicks, yTicks };
  }, [scales, xFormatter, yFormatter]);

  if (!scales || !paths || !axisTicks) {
    return <div>Invalid data</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <svg ref={svgRef} width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Area */}
          {showArea && (
            <path
              d={paths.areaPath || ''}
              fill={colors.area}
              fillOpacity={0.2}
              stroke="none"
            />
          )}

          {/* Line */}
          {showLine && (
            <path
              d={paths.linePath || ''}
              fill="none"
              stroke={colors.line}
              strokeWidth={2}
            />
          )}

          {/* Points */}
          {showPoints && (
            <g>
              {data.map((d) => (
                <circle
                  key={d.timestamp.getTime()}
                  cx={scales.xScale(d.timestamp.getTime())}
                  cy={scales.yScale(d.value)}
                  r={pointRadius}
                  fill={colors.point}
                />
              ))}
            </g>
          )}

          {/* X Axis */}
          <g transform={`translate(0,${dimensions.innerHeight})`}>
            <line
              x1={0}
              x2={dimensions.innerWidth}
              y1={0}
              y2={0}
              stroke="var(--gray-400)"
            />
            {axisTicks.xTicks.map((tick) => (
              <g key={tick.value} transform={`translate(${tick.x},0)`}>
                <line y1={0} y2={6} stroke="var(--gray-300)" />
                <text
                  y={20}
                  textAnchor="middle"
                  fill="var(--gray-600)"
                  className="text-xs"
                >
                  {tick.label}
                </text>
              </g>
            ))}
            <text
              x={dimensions.innerWidth}
              y={-6}
              textAnchor="end"
              fill="var(--gray-600)"
              className="text-xs"
            >
              {xAxisTitle}
            </text>
          </g>

          {/* Y Axis */}
          <g>
            <line
              x1={0}
              x2={0}
              y1={0}
              y2={dimensions.innerHeight}
              stroke="var(--gray-400)"
            />
            {axisTicks.yTicks.map((tick) => (
              <g key={tick.value} transform={`translate(0,${tick.y})`}>
                <line x1={-6} x2={0} stroke="var(--gray-300)" />
                <text
                  x={-12}
                  y={4}
                  textAnchor="end"
                  fill="var(--gray-600)"
                  className="text-xs"
                >
                  {tick.label}
                </text>
              </g>
            ))}
            <text
              transform="rotate(-90)"
              x={-dimensions.innerHeight / 2}
              y={-16}
              textAnchor="middle"
              fill="var(--gray-600)"
              className="text-xs"
            >
              {yAxisTitle}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default TimeSeriesChart;
