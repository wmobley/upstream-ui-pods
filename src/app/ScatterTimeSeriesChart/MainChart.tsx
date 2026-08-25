import * as React from 'react';
import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { line, curveCatmullRom, area } from 'd3-shape';
import { brushY } from 'd3-brush';
import { select } from 'd3-selection';
import { DataPoint } from '../../utils/dataProcessing';
import { useList } from '../../hooks/measurements/useList';

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
  viewDomain: [number, number];
  minMeasurementValue?: number;
  maxMeasurementValue?: number;
  yViewDomain?: [number, number] | null;
  onYBrush?: (domain: [number, number]) => void;
  yMinValue?: number;
  yMaxValue?: number;
  setTooltip: (tooltip: TooltipData | null) => void;
  noteTimestamps?: number[];
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
  minMeasurementValue,
  maxMeasurementValue,
  yViewDomain,
  onYBrush,
  yMinValue,
  yMaxValue,
  setTooltip,
  noteTimestamps = [],
}) => {
  const {
    data: response,
    isLoading,
    error,
  } = useList(
    campaignId,
    stationId,
    sensorId,
    5000,
    100,
    minMeasurementValue,
    maxMeasurementValue,
    new Date(viewDomain[0]),
    new Date(viewDomain[1]),
  );
  const data = response?.items.map((item) => ({
    timestamp: item.collectiontime,
    value: item.value,
    geometry: item.geometry,
  })) as DataPoint[] | undefined;

  // Add ref for y-axis brush
  const yBrushRef = React.useRef<SVGGElement>(null);

  // Calculate chart dimensions
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Dynamic tick counts based on chart dimensions
  const xTickCount = Math.max(3, Math.min(8, Math.floor(innerWidth / 80)));
  const yTickCount = Math.max(3, Math.min(6, Math.floor(innerHeight / 50)));

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

    // Add 5% padding to y-axis extent
    const yPadding = (yExtent[1] - yExtent[0]) * 0.05;
    let yDomainMin = yExtent[0] - yPadding;
    let yDomainMax = yExtent[1] + yPadding;

    // Apply yMinValue/yMaxValue as domain constraints if provided
    if (yMinValue !== undefined && yMinValue < yDomainMin) {
      yDomainMin = yMinValue;
    }
    if (yMaxValue !== undefined && yMaxValue > yDomainMax) {
      yDomainMax = yMaxValue;
    }

    // Use yViewDomain if provided, otherwise use padded extent with constraints
    const yScale = scaleLinear()
      .domain(yViewDomain || [yDomainMin, yDomainMax])
      .range([innerHeight, 0]);

    return { xScale, yScale, yExtent };
  }, [data, innerWidth, innerHeight, viewDomain, yViewDomain, yMinValue, yMaxValue]);

  // Memoize path generators
  const paths = React.useMemo(() => {
    if (!scales) return null;

    const lineGenerator = line<DataPoint>()
      .x((d) => scales.xScale(d.timestamp.getTime()))
      .y((d) => scales.yScale(d.value))
      .curve(curveCatmullRom.alpha(0.5));

    const areaGenerator = area<DataPoint>()
      .x((d) => scales.xScale(d.timestamp.getTime()))
      .y0(() => scales.yScale(scales.yExtent[0]))
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

    const xTicks = scales.xScale.ticks(xTickCount).map((tick) => ({
      value: tick,
      label: xFormatter(tick),
      x: scales.xScale(tick),
    }));

    const yTicks = scales.yScale.ticks(yTickCount).map((tick) => ({
      value: tick,
      label: yFormatter(tick),
      y: scales.yScale(tick),
    }));

    return { xTicks, yTicks };
  }, [scales, xFormatter, yFormatter, xTickCount, yTickCount]);

  // Initialize y-axis brush for vertical drag-zoom
  React.useLayoutEffect(() => {
    if (!scales || !yBrushRef.current || !onYBrush) return;

    const brush = brushY<unknown>()
      .extent([
        [0, 0],
        [0, innerHeight],
      ])
      .on('brush end', (event) => {
        if (!event.selection) return;
        const selection = event.selection as [number, number];

        // Convert pixel coordinates to domain values
        const domain: [number, number] = [
          scales.yScale.invert(selection[1]),
          scales.yScale.invert(selection[0]),
        ];

        onYBrush(domain);
      });

    const brushGroup = select(yBrushRef.current);

    // Remove any existing brush before adding a new one
    brushGroup.selectAll('.brush').remove();

    // Apply the brush
    brushGroup.call(brush);

    // Style the brush selection
    brushGroup
      .selectAll('.selection')
      .attr('fill', '#3b82f6')
      .attr('fill-opacity', 0.15)
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 1);

    brushGroup
      .selectAll('.handle')
      .attr('fill', '#ffffff')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 1.5);

    // Cleanup
    return () => {
      brushGroup.on('.brush', null);
    };
  }, [scales, innerHeight, onYBrush]);

  if (isLoading || error) {
    return <p>Loading...</p>;
  }

  if (!scales || !paths || !axisTicks) {
    return <p>Loading...</p>;
  }

  return (
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
        {showPoints && data && (
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
        {/* Note markers - vertical dotted lines at timestamps with notes */}
        {noteTimestamps.length > 0 && scales && (
          <g className="note-markers">
            {noteTimestamps.map((ts) => {
              // Only render if within the viewDomain
              if (ts >= viewDomain[0] && ts <= viewDomain[1]) {
                const x = scales.xScale(ts);
                if (x >= 0 && x <= innerWidth) {
                  return (
                    <line
                      key={ts}
                      x1={x}
                      x2={x}
                      y1={0}
                      y2={innerHeight}
                      stroke="#ea580c"
                      strokeWidth={1}
                      strokeDasharray="4,4"
                      strokeOpacity={0.7}
                    />
                  );
                }
              }
              return null;
            })}
          </g>
        )}
        {/* Interactive overlay for tooltip */}
        <g>
          {data &&
            data.map((d) => (
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
          <line x1={0} x2={innerWidth} y1={0} y2={0} stroke="var(--gray-400)" />
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
          {/* Y-axis brush for vertical drag-zoom */}
          <g ref={yBrushRef} className="y-brush" />
        </g>
      </g>
    </g>
  );
};

export default React.memo(MainChart);
