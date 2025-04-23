import * as React from 'react';
import { extent, min, max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { line, curveCatmullRom, area } from 'd3-shape';
import { brushX } from 'd3-brush';
import { select } from 'd3-selection';
import { AggregatedMeasurement, MeasurementItem } from '@upstream/upstream-api';
import NumberFormatter from '../common/NumberFormatter/NumberFormatter';
import { formatNumber } from '../common/NumberFormatter/NumberFortatterUtils';
import MainChart from './components/MainChart';
import OverviewChart from './components/OverviewChart';

// Types
interface TooltipData {
  x: number;
  y: number;
  data: AggregatedMeasurement;
}

interface PointTooltipData extends Partial<MeasurementItem> {
  x: number;
  y: number;
}

export interface LineConfidenceChartProps {
  data: AggregatedMeasurement[];
  allPoints: MeasurementItem[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  showAreaOverview?: boolean;
  showLineOverview?: boolean;
  pointRadius?: number;
  colors?: {
    line?: string;
    area?: string;
    point?: string;
  };
  xAxisTitle?: string;
  yAxisTitle?: string;
  xFormatter?: (date: Date | number) => string;
  xFormatterOverview?: (date: Date | number) => string;
  yFormatter?: (value: number) => string;
  onBrush?: (domain: [number, number]) => void;
  gapThresholdMinutes?: number;
}

// Default props
const defaultProps: Partial<LineConfidenceChartProps> = {
  margin: { top: 20, right: 30, bottom: 30, left: 40 },
  showAreaOverview: true,
  showLineOverview: true,
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
  yFormatter: (value: number) => {
    return formatNumber(value);
  },
};

const getDataSegments = (
  data: AggregatedMeasurement[],
  gapThresholdMinutes: number = 120, // 2 hours default
): AggregatedMeasurement[][] => {
  if (data.length === 0) return [];
  const segments: AggregatedMeasurement[][] = [];
  let currentSegment: AggregatedMeasurement[] = [data[0]];

  for (let i = 1; i < data.length; i++) {
    const timeDiff =
      (data[i].measurementTime.getTime() -
        data[i - 1].measurementTime.getTime()) /
      (1000 * 60); // Convert to minutes

    if (timeDiff > gapThresholdMinutes) {
      segments.push(currentSegment);
      currentSegment = [];
    }
    currentSegment.push(data[i]);
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
};

const LineConfidenceChart: React.FC<LineConfidenceChartProps> = ({
  data,
  allPoints,
  width,
  height,
  margin = defaultProps.margin!,
  showAreaOverview = defaultProps.showAreaOverview!,
  showLineOverview = defaultProps.showLineOverview!,
  pointRadius = defaultProps.pointRadius!,
  colors = defaultProps.colors!,
  xAxisTitle = defaultProps.xAxisTitle!,
  yAxisTitle = defaultProps.yAxisTitle!,
  xFormatter = defaultProps.xFormatter!,
  xFormatterOverview = defaultProps.xFormatterOverview!,
  yFormatter = defaultProps.yFormatter!,
  onBrush,
  gapThresholdMinutes = 120,
}) => {
  // Add refs for brush and container
  const overviewRef = React.useRef<SVGGElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Add state for dimensions
  const [dimensions, setDimensions] = React.useState({
    width: width || 1000,
    height: height || 800,
  });

  // Track if initial selection has been set
  const initialSelectionRef = React.useRef(false);

  // Add state for view domain
  const [viewDomain, setViewDomain] = React.useState<[number, number] | null>(
    null,
  );

  // Add tooltip state
  const [tooltip, setTooltipAggregation] = React.useState<TooltipData | null>(
    null,
  );

  const [tooltipPoint, setTooltipPoint] =
    React.useState<PointTooltipData | null>(null);

  // Use resize observer to update dimensions when container size changes
  React.useEffect(() => {
    if (!containerRef.current || width || height) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [width, height]);

  // Calculate dimensions for main and overview charts
  const chartDimensions = React.useMemo(() => {
    const mainHeight = dimensions.height * 0.6; // Main chart takes 70% of total height
    const overviewHeight = dimensions.height * 0.2; // Overview takes 20% of total height
    const spacing = dimensions.height * 0.1; // 10% spacing between charts

    const innerWidth = dimensions.width - margin.left - margin.right;
    const mainInnerHeight = mainHeight - margin.top - margin.bottom;
    const overviewInnerHeight = overviewHeight - margin.top - margin.bottom;

    return {
      innerWidth,
      mainHeight,
      mainInnerHeight,
      overviewHeight,
      overviewInnerHeight,
      spacing,
    };
  }, [dimensions, margin]);

  // Memoize scales for both charts
  const scales = React.useMemo(() => {
    const xExtent = extent(data, (d) => d.measurementTime.getTime());
    const yExtent = [
      min(data, (d) => d.parametricLowerBound) as number,
      max(data, (d) => d.parametricUpperBound) as number,
    ];

    if (!xExtent[0] || !xExtent[1] || !yExtent[0] || !yExtent[1]) {
      return null;
    }

    // Add padding to the x-axis range to ensure points at the edges are fully visible
    const xPadding = chartDimensions.innerWidth * 0.01; // 5% padding on each side

    // Main chart scales - use viewDomain if available
    const xScale = scaleLinear()
      .domain(viewDomain || [xExtent[0], xExtent[1]])
      .range([xPadding, chartDimensions.innerWidth - xPadding]);

    const yScale = scaleLinear()
      .domain(yExtent)
      .range([chartDimensions.mainInnerHeight, 0]);

    // Overview chart scales
    const overviewXScale = scaleLinear()
      .domain([xExtent[0], xExtent[1]])
      .range([xPadding, chartDimensions.innerWidth - xPadding]);

    const overviewYScale = scaleLinear()
      .domain(yExtent)
      .range([chartDimensions.overviewInnerHeight, 0]);

    return { xScale, yScale, overviewXScale, overviewYScale };
  }, [data, chartDimensions, viewDomain]);

  // Memoize path generators for both charts
  const paths = React.useMemo(() => {
    if (!scales) return null;

    // Get data segments
    const segments = getDataSegments(data, gapThresholdMinutes);

    // Main chart paths
    const mainLineGenerator = line<AggregatedMeasurement>()
      .x((d) => scales.xScale(d.measurementTime.getTime()))
      .y((d) => scales.yScale(d.value))
      .curve(curveCatmullRom.alpha(0.5));

    const mainAreaGenerator = area<AggregatedMeasurement>()
      .x((d) => scales.xScale(d.measurementTime.getTime()))
      .y0((d) => scales.yScale(d.parametricLowerBound))
      .y1((d) => scales.yScale(d.parametricUpperBound))
      .curve(curveCatmullRom.alpha(0.5));

    // Overview chart paths
    const overviewLineGenerator = line<AggregatedMeasurement>()
      .x((d) => scales.overviewXScale(d.measurementTime.getTime()))
      .y((d) => scales.overviewYScale(d.value))
      .curve(curveCatmullRom.alpha(0.5));

    const overviewAreaGenerator = area<AggregatedMeasurement>()
      .x((d) => scales.overviewXScale(d.measurementTime.getTime()))
      .y0((d) => scales.overviewYScale(d.parametricLowerBound))
      .y1((d) => scales.overviewYScale(d.parametricUpperBound))
      .curve(curveCatmullRom.alpha(0.5));

    // Generate paths for each segment
    const mainLinePaths = segments.map((segment) => mainLineGenerator(segment));
    const mainAreaPaths = segments.map((segment) => mainAreaGenerator(segment));
    const overviewLinePaths = segments.map((segment) =>
      overviewLineGenerator(segment),
    );
    const overviewAreaPaths = segments.map((segment) =>
      overviewAreaGenerator(segment),
    );

    return {
      mainLinePaths,
      mainAreaPaths,
      overviewLinePaths,
      overviewAreaPaths,
    };
  }, [data, scales, gapThresholdMinutes]);

  // Memoize axis ticks for main chart
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

  // Initialize brush
  React.useEffect(() => {
    console.log('initializing brush');
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
        setViewDomain(domain);
        onBrush?.(domain);
      });

    // Apply brush to overview chart
    const brushGroup = select(overviewRef.current);
    brushGroup.call(brush);

    // Set initial selection if not already set
    if (!initialSelectionRef.current) {
      // Calculate 10% width selection centered in the middle
      const selectionWidth = chartDimensions.innerWidth * 0.5;
      const selectionStart = (chartDimensions.innerWidth - selectionWidth) / 2;
      const selectionEnd = selectionStart + selectionWidth;

      brushGroup.call(brush.move, [selectionStart, selectionEnd]);

      // Trigger initial brush event with 10% domain
      if (scales.overviewXScale) {
        const domain: [number, number] = [
          scales.overviewXScale.invert(selectionStart),
          scales.overviewXScale.invert(selectionEnd),
        ];
        onBrush?.(domain);
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
    onBrush,
    setViewDomain,
  ]);

  if (data.length === 0) {
    return <div>Data is empty</div>;
  }

  if (!scales) {
    return <div>Invalid data - no scales</div>;
  }

  if (!paths || !axisTicks) {
    return <div>Invalid data - no paths or axis ticks</div>;
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center relative w-full h-full"
    >
      <svg width={dimensions.width} height={dimensions.height}>
        {/* Main chart */}
        <MainChart
          data={data}
          allPoints={allPoints}
          scales={scales}
          chartDimensions={chartDimensions}
          paths={paths}
          axisTicks={axisTicks}
          margin={margin}
          dimensions={dimensions}
          colors={colors}
          pointRadius={pointRadius}
          xAxisTitle={xAxisTitle}
          yAxisTitle={yAxisTitle}
          setTooltipAggregation={setTooltipAggregation}
          setTooltipPoint={setTooltipPoint}
        />

        {/* Overview chart */}
        <OverviewChart
          showAreaOverview={showAreaOverview}
          showLineOverview={showLineOverview}
          paths={paths}
          chartDimensions={chartDimensions}
          scales={scales}
          margin={margin}
          colors={colors}
          xFormatterOverview={xFormatterOverview}
          overviewRef={overviewRef}
        />

        {/* Right margin background */}
        <rect
          x={dimensions.width - margin.right}
          y={0}
          width={margin.right}
          height={dimensions.height}
          fill="white"
        />
      </svg>
      {tooltip && (
        <div
          className="absolute bg-white border border-gray-300 rounded shadow-lg p-2 text-sm"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            pointerEvents: 'auto',
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium">Data Point Details</div>
            <button
              onClick={() => setTooltipAggregation(null)}
              className="ml-2 text-gray-500 hover:text-gray-700"
              aria-label="Close tooltip"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div>Time: {tooltip.data.measurementTime.toLocaleString()}</div>
          <div>
            Value: <NumberFormatter value={tooltip.data.value} />
          </div>
          <div>
            Median: <NumberFormatter value={tooltip.data.medianValue} />
          </div>
          <div>
            Confidence Interval: [
            <NumberFormatter value={tooltip.data.parametricLowerBound} />,
            <NumberFormatter value={tooltip.data.parametricUpperBound} /> ]
          </div>
          <div>Point Count: {tooltip.data.pointCount}</div>
        </div>
      )}
      {tooltipPoint && (
        <div
          className="absolute bg-white border border-gray-300 rounded shadow-lg p-2 text-sm"
          style={{
            left: tooltipPoint.x + 10,
            top: tooltipPoint.y - 10,
            pointerEvents: 'auto',
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium">Individual Point Details</div>
            <button
              onClick={() => setTooltipPoint(null)}
              className="ml-2 text-gray-500 hover:text-gray-700"
              aria-label="Close tooltip"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div>Time: {tooltipPoint.collectiontime?.toLocaleString()}</div>
          <div>
            Value: <NumberFormatter value={tooltipPoint.value ?? 0} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LineConfidenceChart;
