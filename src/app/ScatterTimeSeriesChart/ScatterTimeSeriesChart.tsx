import * as React from 'react';
import { extent } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { format } from 'd3-format';
import { line, curveCatmullRom, area } from 'd3-shape';
import { brushX } from 'd3-brush';
import { select } from 'd3-selection';
import Modal from '../common/Modal/Modal';
import { DataPoint } from '../../utils/dataProcessing';
import GeometryMap from '../common/GeometryMap/GeometryMap';
import SensorTooltip from '../common/SensorTooltip/SensorTooltip';
import MainChart from './MainChart';
import OverviewChart from './OverviewChart';

// Types
interface TooltipData {
  x: number;
  y: number;
  data: DataPoint;
}

export interface TimeSeriesChartProps {
  data: DataPoint[];
  downsampledData: DataPoint[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  showArea?: boolean;
  showLine?: boolean;
  showPoints?: boolean;
  showAreaOverview?: boolean;
  showLineOverview?: boolean;
  showPointsOverview?: boolean;
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
}

// Default props
const defaultProps: Partial<TimeSeriesChartProps> = {
  margin: { top: 20, right: 30, bottom: 30, left: 40 },
  showArea: true,
  showLine: true,
  showPoints: false,
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
  yFormatter: format('.1f'),
};

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  downsampledData,
  width,
  height,
  margin = defaultProps.margin!,
  showArea = defaultProps.showArea!,
  showLine = defaultProps.showLine!,
  showPoints = defaultProps.showPoints!,
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
}) => {
  // Add refs for container
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Add state for dimensions
  const [dimensions, setDimensions] = React.useState({
    width: width || 800,
    height: height || 400,
  });

  // Track if initial selection has been set
  const initialSelectionRef = React.useRef(false);

  // Add state for view domain
  const [viewDomain, setViewDomain] = React.useState<[number, number] | null>(
    null,
  );

  // Add tooltip state
  const [tooltip, setTooltip] = React.useState<TooltipData | null>(null);

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
    const mainHeight = dimensions.height * 0.7; // Main chart takes 70% of total height
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
    const xExtent = extent(data, (d) => d.timestamp.getTime());
    const yExtent = extent(data, (d) => d.value);

    if (!xExtent[0] || !xExtent[1] || !yExtent[0] || !yExtent[1]) {
      return null;
    }

    // Main chart scales - use viewDomain if available
    const xScale = scaleLinear()
      .domain(viewDomain || [xExtent[0], xExtent[1]])
      .range([0, chartDimensions.innerWidth]);

    const yScale = scaleLinear()
      .domain([0, yExtent[1]])
      .range([chartDimensions.mainInnerHeight, 0]);

    // Overview chart scales
    const overviewXScale = scaleLinear()
      .domain([xExtent[0], xExtent[1]])
      .range([0, chartDimensions.innerWidth]);

    const overviewYScale = scaleLinear()
      .domain([0, yExtent[1]])
      .range([chartDimensions.overviewInnerHeight, 0]);

    return { xScale, yScale, overviewXScale, overviewYScale };
  }, [data, chartDimensions, viewDomain]);

  // Handle brush updates
  const handleBrush = (domain: [number, number]) => {
    setViewDomain(domain);
    onBrush?.(domain);
  };

  // Set initial selection if needed
  const handleInitialSelection = (wasInitialized: boolean) => {
    initialSelectionRef.current = wasInitialized;
  };

  if (!scales) {
    return <div>Invalid data</div>;
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center relative w-full h-full"
    >
      <svg width={dimensions.width} height={dimensions.height}>
        <MainChart
          data={data}
          scales={scales}
          chartDimensions={chartDimensions}
          margin={margin}
          dimensions={dimensions}
          showArea={showArea}
          showLine={showLine}
          showPoints={showPoints}
          pointRadius={pointRadius}
          colors={colors}
          xAxisTitle={xAxisTitle}
          yAxisTitle={yAxisTitle}
          xFormatter={xFormatter}
          yFormatter={yFormatter}
          setTooltip={setTooltip}
        />

        <OverviewChart
          data={data}
          scales={scales}
          chartDimensions={chartDimensions}
          margin={margin}
          showAreaOverview={showAreaOverview}
          showLineOverview={showLineOverview}
          colors={colors}
          xFormatterOverview={xFormatterOverview || xFormatter}
          initialSelectionRef={initialSelectionRef}
          onBrush={handleBrush}
          onInitialSelection={handleInitialSelection}
        />
      </svg>

      <Modal
        isOpen={tooltip !== null}
        onClose={() => setTooltip(null)}
        title="Measurement Details"
      >
        <div className="p-4">
          {tooltip && (
            <div>
              <SensorTooltip
                value={tooltip.data.value}
                timestamp={tooltip.data.timestamp}
                className="min-w-[200px]"
              />
              {tooltip.data.geometry && (
                <div className="h-80 w-80">
                  <GeometryMap geoJSON={tooltip.data.geometry} />
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default TimeSeriesChart;
