import * as React from 'react';
import { line, curveCatmullRom, area } from 'd3-shape';
import { brushX } from 'd3-brush';
import { select } from 'd3-selection';
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

interface OverviewChartProps {
  data: DataPoint[];
  scales: Scales;
  chartDimensions: ChartDimensions;
  margin: { top: number; right: number; bottom: number; left: number };
  showAreaOverview: boolean;
  showLineOverview: boolean;
  colors: {
    line?: string;
    area?: string;
    point?: string;
  };
  xFormatterOverview: (date: Date | number) => string;
  initialSelectionRef: React.MutableRefObject<boolean>;
  onBrush: (domain: [number, number]) => void;
  onInitialSelection: (wasInitialized: boolean) => void;
}

const OverviewChart: React.FC<OverviewChartProps> = ({
  data,
  scales,
  chartDimensions,
  margin,
  showAreaOverview,
  showLineOverview,
  colors,
  xFormatterOverview,
  initialSelectionRef,
  onBrush,
  onInitialSelection,
}) => {
  // Add ref for brush
  const overviewRef = React.useRef<SVGGElement>(null);

  // Memoize path generators for overview chart
  const paths = React.useMemo(() => {
    // Overview chart paths
    const overviewLineGenerator = line<DataPoint>()
      .x((d) => scales.overviewXScale(d.timestamp.getTime()))
      .y((d) => scales.overviewYScale(d.value))
      .curve(curveCatmullRom.alpha(0.5));

    const overviewAreaGenerator = area<DataPoint>()
      .x((d) => scales.overviewXScale(d.timestamp.getTime()))
      .y0(() => scales.overviewYScale(0))
      .y1((d) => scales.overviewYScale(d.value))
      .curve(curveCatmullRom.alpha(0.5));

    return {
      overviewLinePath: overviewLineGenerator(data),
      overviewAreaPath: overviewAreaGenerator(data),
    };
  }, [data, scales]);

  // Initialize brush
  React.useEffect(() => {
    if (!scales || !overviewRef.current) return;

    // Create brush behavior
    const brush = brushX<unknown>()
      .extent([
        [0, 0],
        [chartDimensions.innerWidth, chartDimensions.overviewInnerHeight],
      ])
      .on('start', () => {
        // Mark that user has started brushing
        initialSelectionRef.current = true;
        onInitialSelection(true);
      })
      .on('brush', (event) => {
        if (!event.selection) return;
        const selection = event.selection as [number, number];

        // Convert pixel coordinates to domain values
        const domain: [number, number] = [
          scales.overviewXScale.invert(selection[0]),
          scales.overviewXScale.invert(selection[1]),
        ];

        // Update view domain
        onBrush(domain);
      });

    // Apply brush to overview chart
    const brushGroup = select(overviewRef.current);
    brushGroup.call(brush);

    // Set initial selection if not already set
    if (!initialSelectionRef.current) {
      // Calculate 10% width selection centered in the middle
      const selectionWidth = chartDimensions.innerWidth * 0.1;
      const selectionStart = (chartDimensions.innerWidth - selectionWidth) / 2;
      const selectionEnd = selectionStart + selectionWidth;

      brushGroup.call(brush.move, [selectionStart, selectionEnd]);

      // Trigger initial brush event with 10% domain
      if (scales.overviewXScale) {
        const domain: [number, number] = [
          scales.overviewXScale.invert(selectionStart),
          scales.overviewXScale.invert(selectionEnd),
        ];
        onBrush(domain);
      }
    }

    // Cleanup
    return () => {
      brushGroup.on('.brush', null);
    };
  }, [
    scales,
    chartDimensions.innerWidth,
    chartDimensions.overviewInnerHeight,
    initialSelectionRef,
    onBrush,
    onInitialSelection,
  ]);

  return (
    <g
      transform={`translate(${margin.left},${
        chartDimensions.mainHeight + chartDimensions.spacing
      })`}
      className="overview-chart"
    >
      {showAreaOverview && (
        <path
          d={paths.overviewAreaPath || ''}
          fill={colors.area}
          fillOpacity={0.2}
          stroke="none"
        />
      )}
      {showLineOverview && (
        <path
          d={paths.overviewLinePath || ''}
          fill="none"
          stroke={colors.line}
          strokeWidth={1}
        />
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
