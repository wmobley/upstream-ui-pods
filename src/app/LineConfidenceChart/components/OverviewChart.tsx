import * as React from 'react';
import { ScaleLinear } from 'd3-scale';

interface OverviewChartProps {
  showAreaOverview: boolean;
  showLineOverview: boolean;
  paths: {
    overviewAreaPaths: (string | null)[];
    overviewLinePaths: (string | null)[];
    additionalSensorPaths?: Array<{
      overviewAreaPaths: (string | null)[];
      overviewLinePaths: (string | null)[];
    }>;
  };
  chartDimensions: {
    mainHeight: number;
    spacing: number;
    innerWidth: number;
    overviewInnerHeight: number;
  };
  scales: {
    overviewXScale: ScaleLinear<number, number>;
  };
  margin: { top: number; right: number; bottom: number; left: number };
  colors: {
    line?: string;
    area?: string;
    point?: string;
  };
  colorPalette?: Array<{
    line: string;
    area: string;
    point: string;
  }>;
  xFormatterOverview: (date: Date | number) => string;
  overviewRef: React.RefObject<SVGGElement>;
}

const OverviewChart: React.FC<OverviewChartProps> = ({
  showAreaOverview,
  showLineOverview,
  paths,
  chartDimensions,
  scales,
  margin,
  colors,
  colorPalette,
  xFormatterOverview,
  overviewRef,
}) => {
  return (
    <g
      transform={`translate(${margin.left},${chartDimensions.mainHeight + chartDimensions.spacing})`}
      className="overview-chart"
    >
      {/* Primary sensor area paths */}
      {showAreaOverview &&
        paths?.overviewAreaPaths.map((path, i) => (
          <path
            key={`overview-area-${i}`}
            d={path || ''}
            fill={colorPalette?.[0]?.area || colors.area}
            fillOpacity={0.2}
            stroke="none"
          />
        ))}

      {/* Additional sensors area paths */}
      {showAreaOverview &&
        paths?.additionalSensorPaths?.map((sensorPaths, sensorIndex) =>
          sensorPaths.overviewAreaPaths.map((path, i) => (
            <path
              key={`overview-area-sensor-${sensorIndex}-${i}`}
              d={path || ''}
              fill={colorPalette?.[sensorIndex + 1]?.area || colors.area}
              fillOpacity={0.2}
              stroke="none"
            />
          )),
        )}

      {/* Primary sensor line paths */}
      {showLineOverview &&
        paths?.overviewLinePaths.map((path, i) => (
          <path
            key={`overview-line-${i}`}
            d={path || ''}
            fill="none"
            stroke={colorPalette?.[0]?.line || colors.line}
            strokeWidth={1}
          />
        ))}

      {/* Additional sensors line paths */}
      {showLineOverview &&
        paths?.additionalSensorPaths?.map((sensorPaths, sensorIndex) =>
          sensorPaths.overviewLinePaths.map((path, i) => (
            <path
              key={`overview-line-sensor-${sensorIndex}-${i}`}
              d={path || ''}
              fill="none"
              stroke={colorPalette?.[sensorIndex + 1]?.line || colors.line}
              strokeWidth={1}
            />
          )),
        )}

      {/* Overview chart x-axis */}
      <g
        transform={`translate(0,${chartDimensions.overviewInnerHeight})`}
        className="overview-x-axis"
      >
        <line
          x1={0}
          x2={chartDimensions.innerWidth}
          y1={0}
          y2={0}
          stroke="var(--gray-400)"
        />
        {scales.overviewXScale.ticks(5).map((tick) => (
          <g
            key={tick}
            transform={`translate(${scales.overviewXScale(tick)},0)`}
          >
            <line y1={0} y2={6} stroke="var(--gray-300)" />
            <text
              y={20}
              textAnchor="middle"
              fill="var(--gray-600)"
              className="text-xs"
            >
              {xFormatterOverview(tick)}
            </text>
          </g>
        ))}
        <text
          x={chartDimensions.innerWidth / 2}
          y={40}
          textAnchor="middle"
          fill="var(--gray-600)"
          className="text-xs"
        >
          Overview
        </text>
      </g>
      {/* Brush container */}
      <g
        ref={overviewRef}
        className="brush"
        style={
          {
            '--brush-selection-fill': 'var(--gray-200)',
            '--brush-selection-stroke': 'var(--gray-400)',
            '--brush-handle-fill': 'var(--gray-50)',
            '--brush-handle-stroke': 'var(--gray-500)',
          } as React.CSSProperties
        }
      />
    </g>
  );
};

export default OverviewChart;
