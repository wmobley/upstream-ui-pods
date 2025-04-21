import * as React from 'react';
import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { line, curveCatmullRom, area } from 'd3-shape';
import { brushX } from 'd3-brush';
import { select } from 'd3-selection';
import { DataPoint } from '../../utils/dataProcessing';

export interface OverviewChartProps {
  data: DataPoint[];
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  showAreaOverview?: boolean;
  showLineOverview?: boolean;
  colors: {
    line?: string;
    area?: string;
    point?: string;
  };
  xFormatterOverview: (date: Date | number) => string;
  onBrush: (domain: [number, number]) => void;
}

const OverviewChart: React.FC<OverviewChartProps> = ({
  data,
  width,
  height,
  margin,
  showAreaOverview = true,
  showLineOverview = true,
  colors,
  xFormatterOverview,
  onBrush,
}) => {
  // Add refs for brush
  const overviewRef = React.useRef<SVGGElement>(null);

  // Track if initial selection has been set
  const initialSelectionRef = React.useRef(false);

  // Calculate dimensions
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Calculate scales
  const scales = React.useMemo(() => {
    const xExtent = extent(data, (d) => d.timestamp.getTime());
    const yExtent = extent(data, (d) => d.value);

    if (!xExtent[0] || !xExtent[1] || !yExtent[0] || !yExtent[1]) {
      return null;
    }

    const xScale = scaleLinear()
      .domain([xExtent[0], xExtent[1]])
      .range([0, innerWidth]);

    const yScale = scaleLinear()
      .domain([0, yExtent[1]])
      .range([innerHeight, 0]);

    return { xScale, yScale };
  }, [data, innerWidth, innerHeight]);

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

  // Initialize brush - using useLayoutEffect to ensure it runs before render
  React.useLayoutEffect(() => {
    if (!scales || !overviewRef.current) return;

    // Create brush behavior with explicit styles
    const brush = brushX<unknown>()
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ])
      .on('start', () => {
        // Mark that user has started brushing
        initialSelectionRef.current = true;
      })
      .on('brush end', (event) => {
        if (!event.selection) return;
        const selection = event.selection as [number, number];

        // Convert pixel coordinates to domain values
        const domain: [number, number] = [
          scales.xScale.invert(selection[0]),
          scales.xScale.invert(selection[1]),
        ];

        // Update view domain
        onBrush(domain);
      });

    // Apply brush to overview chart
    const brushGroup = select(overviewRef.current);

    // Remove any existing brush before adding a new one
    brushGroup.selectAll('.brush').remove();

    // Apply the brush
    brushGroup.call(brush);

    // Add explicit styles to make the brush visible
    brushGroup
      .selectAll('.selection')
      .attr('fill', '#f0f0f0')
      .attr('fill-opacity', 0.3)
      .attr('stroke', '#888')
      .attr('stroke-width', 1);

    brushGroup
      .selectAll('.handle')
      .attr('fill', '#fff')
      .attr('stroke', '#666')
      .attr('stroke-width', 1);

    // Set initial selection if not already set
    if (!initialSelectionRef.current) {
      // Calculate 30% width selection centered in the middle for better visibility
      const selectionWidth = innerWidth * 0.3;
      const selectionStart = (innerWidth - selectionWidth) / 2;
      const selectionEnd = selectionStart + selectionWidth;

      // Force move the brush selection to be visible
      setTimeout(() => {
        brushGroup.call(brush.move, [selectionStart, selectionEnd]);
      }, 100);

      // Trigger initial brush event
      const domain: [number, number] = [
        scales.xScale.invert(selectionStart),
        scales.xScale.invert(selectionEnd),
      ];
      onBrush(domain);
      initialSelectionRef.current = true;
    }

    // Cleanup
    return () => {
      brushGroup.on('.brush', null);
    };
  }, [scales, innerWidth, innerHeight, onBrush, data]);

  if (!scales || !paths) {
    return null;
  }

  return (
    <g
      transform={`translate(${margin.left},${margin.top})`}
      className="overview-chart"
    >
      {showAreaOverview && (
        <path
          d={paths.areaPath || ''}
          fill={colors.area}
          fillOpacity={0.2}
          stroke="none"
        />
      )}
      {showLineOverview && (
        <path
          d={paths.linePath || ''}
          fill="none"
          stroke={colors.line}
          strokeWidth={1}
        />
      )}
      {/* Overview chart x-axis */}
      <g transform={`translate(0,${innerHeight})`} className="overview-x-axis">
        <line x1={0} x2={innerWidth} y1={0} y2={0} stroke="var(--gray-400)" />
        {scales.xScale.ticks(5).map((tick) => (
          <g key={tick} transform={`translate(${scales.xScale(tick)},0)`}>
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
          x={innerWidth / 2}
          y={40}
          textAnchor="middle"
          fill="var(--gray-600)"
          className="text-xs"
        >
          Overview
        </text>
      </g>

      {/* Brush container */}
      <g ref={overviewRef} className="brush" />
    </g>
  );
};

export default OverviewChart;
