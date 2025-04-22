import * as React from 'react';
import { format } from 'd3-format';
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
  campaignId: string;
  stationId: string;
  sensorId: string;
  // For future implementation of data downsampling
  downsampledData?: DataPoint[];
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
  // downsampledData is currently unused but will be used for performance optimization in the future
  // downsampledData,
  campaignId,
  stationId,
  sensorId,
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
  xFormatterOverview = defaultProps.xFormatterOverview ||
    defaultProps.xFormatter!,
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

    return {
      mainHeight,
      overviewHeight,
      spacing,
    };
  }, [dimensions.height]);

  // Handle brush updates
  const handleBrush = (domain: [number, number]) => {
    setViewDomain(domain);
    onBrush?.(domain);
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center relative w-full h-full"
    >
      <svg width={dimensions.width} height={dimensions.height}>
        {/* Main chart */}
        <MainChart
          campaignId={campaignId}
          stationId={stationId}
          sensorId={sensorId}
          width={dimensions.width}
          height={chartDimensions.mainHeight}
          margin={margin}
          showArea={showArea}
          showLine={showLine}
          showPoints={showPoints}
          pointRadius={pointRadius}
          colors={colors}
          xAxisTitle={xAxisTitle}
          yAxisTitle={yAxisTitle}
          xFormatter={xFormatter}
          yFormatter={yFormatter}
          viewDomain={viewDomain}
          setTooltip={setTooltip}
        />

        {/* Overview chart */}
        <g
          transform={`translate(0,${chartDimensions.mainHeight + chartDimensions.spacing})`}
        >
          <OverviewChart
            data={data}
            width={dimensions.width}
            height={chartDimensions.overviewHeight}
            margin={margin}
            showAreaOverview={showAreaOverview}
            showLineOverview={showLineOverview}
            colors={colors}
            xFormatterOverview={xFormatterOverview}
            onBrush={handleBrush}
          />
        </g>
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
