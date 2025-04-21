import * as React from 'react';
import { line, curveCatmullRom, area } from 'd3-shape';
import { DataPoint } from '../../utils/dataProcessing';

interface ChartDimensions {
  innerWidth: number;
  mainHeight: number;
  mainInnerHeight: number;
  overviewHeight: number;
  overviewInnerHeight: number;
  spacing: number;
}

interface Scales {
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  overviewXScale: d3.ScaleLinear<number, number>;
  overviewYScale: d3.ScaleLinear<number, number>;
}

interface TooltipData {
  x: number;
  y: number;
  data: DataPoint;
}

interface MainChartProps {
  data: DataPoint[];
  scales: Scales;
  chartDimensions: ChartDimensions;
  margin: { top: number; right: number; bottom: number; left: number };
  dimensions: { width: number; height: number };
  showArea: boolean;
  showLine: boolean;
  showPoints: boolean;
  pointRadius: number;
  colors: {
    line?: string;
    area?: string;
    point?: string;
  };
  xAxisTitle: string;
  yAxisTitle: string;
  xFormatter: (date: Date | number) => string;
  yFormatter: (value: number) => string;
  setTooltip: React.Dispatch<React.SetStateAction<TooltipData | null>>;
}

const MainChart: React.FC<MainChartProps> = ({
  data,
  scales,
  chartDimensions,
  margin,
  dimensions,
  showArea,
  showLine,
  showPoints,
  pointRadius,
  colors,
  xAxisTitle,
  yAxisTitle,
  xFormatter,
  yFormatter,
  setTooltip,
}) => {
  // Memoize path generators for main chart
  const paths = React.useMemo(() => {
    // Main chart paths
    const mainLineGenerator = line<DataPoint>()
      .x((d) => scales.xScale(d.timestamp.getTime()))
      .y((d) => scales.yScale(d.value))
      .curve(curveCatmullRom.alpha(0.5));

    const mainAreaGenerator = area<DataPoint>()
      .x((d) => scales.xScale(d.timestamp.getTime()))
      .y0(() => scales.yScale(0))
      .y1((d) => scales.yScale(d.value))
      .curve(curveCatmullRom.alpha(0.5));

    return {
      mainLinePath: mainLineGenerator(data),
      mainAreaPath: mainAreaGenerator(data),
    };
  }, [data, scales]);

  // Memoize axis ticks for main chart
  const axisTicks = React.useMemo(() => {
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

  return (
    <g
      transform={`translate(${margin.left},${margin.top})`}
      className="main-chart"
    >
      {/* Data visualization layer */}
      <g className="data-layer">
        {showArea && (
          <path
            d={paths.mainAreaPath || ''}
            fill={colors.area}
            fillOpacity={0.2}
            stroke="none"
          />
        )}
        {showLine && (
          <path
            d={paths.mainLinePath || ''}
            fill="none"
            stroke={colors.line}
            strokeWidth={2}
          />
        )}
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
        {/* Interactive overlay for tooltip */}
        <g>
          {data.map((d) => (
            <circle
              key={d.timestamp.getTime()}
              cx={scales.xScale(d.timestamp.getTime())}
              cy={scales.yScale(d.value)}
              r={pointRadius + 5}
              fill="transparent"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const svgRect = e.currentTarget
                  .closest('svg')
                  ?.getBoundingClientRect();
                if (!svgRect) return;

                setTooltip({
                  x: rect.left - svgRect.left,
                  y: rect.top - svgRect.top,
                  data: d,
                });
              }}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </g>
      </g>

      {/* Axes layer - rendered last to be on top */}
      <g className="axes-layer">
        {/* X Axis */}
        <g
          transform={`translate(0,${chartDimensions.mainInnerHeight})`}
          className="x-axis"
        >
          <rect
            x={-margin.left}
            y={0}
            width={dimensions.width}
            height={margin.bottom}
            fill="white"
          />
          <line
            x1={0}
            x2={chartDimensions.innerWidth}
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
            x={chartDimensions.innerWidth}
            y={chartDimensions.mainInnerHeight}
            textAnchor="end"
            fill="var(--gray-600)"
            className="text-xs"
          >
            {xAxisTitle}
          </text>
        </g>
        {/* Y Axis */}
        <g className="y-axis">
          <rect
            x={-margin.left}
            y={-margin.top}
            width={margin.left}
            height={
              chartDimensions.mainInnerHeight + margin.top + margin.bottom
            }
            fill="white"
          />
          <line
            x1={0}
            x2={0}
            y1={0}
            y2={chartDimensions.mainInnerHeight}
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
            x={-chartDimensions.mainInnerHeight}
            y={-30}
            textAnchor="start"
            fill="var(--gray-600)"
            className="text-xs"
          >
            {yAxisTitle}
          </text>
        </g>
      </g>
    </g>
  );
};

export default MainChart;
