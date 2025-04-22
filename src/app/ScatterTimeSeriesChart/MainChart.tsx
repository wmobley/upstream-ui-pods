import * as React from 'react';
import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { line, curveCatmullRom, area } from 'd3-shape';
import { DataPoint } from '../../utils/dataProcessing';
import { useList } from '../../hooks/measurements/useList';
import QueryWrapper from '../common/QueryWrapper';
interface TooltipData {
  x: number;
  y: number;
  data: DataPoint;
}

export interface MainChartProps {
  campaignId: string;
  stationId: string;
  sensorId: string;
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  showArea?: boolean;
  showLine?: boolean;
  showPoints?: boolean;
  pointRadius?: number;
  colors: {
    line?: string;
    area?: string;
    point?: string;
  };
  xAxisTitle: string;
  yAxisTitle: string;
  xFormatter: (date: Date | number) => string;
  yFormatter: (value: number) => string;
  viewDomain: [number, number] | null;
  setTooltip: (tooltip: TooltipData | null) => void;
}

const MainChart: React.FC<MainChartProps> = ({
  campaignId,
  stationId,
  sensorId,
  width,
  height,
  margin,
  showArea = true,
  showLine = true,
  showPoints = false,
  pointRadius = 3,
  colors,
  xAxisTitle,
  yAxisTitle,
  xFormatter,
  yFormatter,
  viewDomain,
  setTooltip,
}) => {
  const {
    data: response,
    isLoading,
    error,
  } = useList(campaignId, stationId, sensorId);
  const data = response?.items.map((item) => ({
    timestamp: item.collectiontime,
    value: item.value,
    geometry: item.geometry,
  })) as DataPoint[] | undefined;

  // Calculate chart dimensions
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Calculate scales
  const scales = React.useMemo(() => {
    if (!data) return null;
    const xExtent = extent(data, (d) => d.timestamp.getTime());
    const yExtent = extent(data, (d) => d.value);

    if (!xExtent[0] || !xExtent[1] || !yExtent[0] || !yExtent[1]) {
      return null;
    }

    // Use viewDomain if available, otherwise use full extent
    const xScale = scaleLinear()
      .domain(viewDomain || [xExtent[0], xExtent[1]])
      .range([0, innerWidth]);

    const yScale = scaleLinear()
      .domain([0, yExtent[1]])
      .range([innerHeight, 0]);

    return { xScale, yScale };
  }, [data, innerWidth, innerHeight, viewDomain]);

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

    if (!data) return null;
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

  if (isLoading || error) {
    return <p>Loading...</p>;
  }

  if (!scales || !paths || !axisTicks) {
    return <p>Loading...</p>;
  }

  return (
    <QueryWrapper isLoading={isLoading} error={error}>
      <g
        transform={`translate(${margin.left},${margin.top})`}
        className="main-chart"
      >
        {/* Data visualization layer */}
        <g className="data-layer">
          {showArea && (
            <path
              d={paths.areaPath || ''}
              fill={colors.area}
              fillOpacity={0.2}
              stroke="none"
            />
          )}
          {showLine && (
            <path
              d={paths.linePath || ''}
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
          <g transform={`translate(0,${innerHeight})`} className="x-axis">
            <rect
              x={-margin.left}
              y={0}
              width={width}
              height={margin.bottom}
              fill="white"
            />
            <line
              x1={0}
              x2={innerWidth}
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
              x={innerWidth}
              y={innerHeight}
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
              height={innerHeight + margin.top + margin.bottom}
              fill="white"
            />
            <line
              x1={0}
              x2={0}
              y1={0}
              y2={innerHeight}
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
              x={-innerHeight}
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
    </QueryWrapper>
  );
};

export default MainChart;
