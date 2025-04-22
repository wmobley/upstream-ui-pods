import * as React from 'react';
import { AggregatedMeasurement } from '@upstream/upstream-api';
import { ScaleLinear } from 'd3-scale';

// Types
interface TooltipData {
  x: number;
  y: number;
  data: AggregatedMeasurement;
}

interface MainChartProps {
  data: AggregatedMeasurement[];
  scales: {
    xScale: ScaleLinear<number, number>;
    yScale: ScaleLinear<number, number>;
  };
  chartDimensions: {
    innerWidth: number;
    mainInnerHeight: number;
  };
  paths: {
    mainAreaPaths: (string | null)[];
    mainLinePaths: (string | null)[];
  };
  axisTicks: {
    xTicks: { value: number; label: string; x: number }[];
    yTicks: { value: number; label: string; y: number }[];
  };
  margin: { top: number; right: number; bottom: number; left: number };
  dimensions: { width: number; height: number };
  colors: {
    line?: string;
    area?: string;
    point?: string;
  };
  pointRadius: number;
  xAxisTitle: string;
  yAxisTitle: string;
  setTooltip: React.Dispatch<React.SetStateAction<TooltipData | null>>;
}

const MainChart: React.FC<MainChartProps> = ({
  data,
  scales,
  chartDimensions,
  paths,
  axisTicks,
  margin,
  dimensions,
  colors,
  pointRadius,
  xAxisTitle,
  yAxisTitle,
  setTooltip,
}) => {
  return (
    <g
      transform={`translate(${margin.left},${margin.top})`}
      className="main-chart"
    >
      {/* Chart background */}
      <rect
        x={0}
        y={0}
        width={chartDimensions.innerWidth}
        height={chartDimensions.mainInnerHeight}
        fill="white"
      />

      {/* Data visualization layer */}
      <g className="data-layer">
        {/* Render each segment's area */}
        {paths?.mainAreaPaths.map((path, i) => (
          <path
            key={`area-${i}`}
            d={path || ''}
            fill={colors.area}
            fillOpacity={0.2}
            stroke="none"
          />
        ))}
        {/* Render each segment's line */}
        {paths?.mainLinePaths.map((path, i) => (
          <path
            key={`line-${i}`}
            d={path || ''}
            fill="none"
            stroke={colors.line}
            strokeWidth={2}
          />
        ))}
        {/* Points */}
        <g>
          {data.map((d) => (
            <circle
              key={d.measurementTime.getTime()}
              cx={scales.xScale(d.measurementTime.getTime())}
              cy={scales.yScale(d.value)}
              r={pointRadius}
              fill={colors.point}
            />
          ))}
        </g>
        {/* Interactive overlay for tooltip */}
        <g>
          {data.map((d) => (
            <circle
              key={d.measurementTime.getTime()}
              cx={scales.xScale(d.measurementTime.getTime())}
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
