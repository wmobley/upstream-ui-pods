import * as React from 'react';
import { AggregatedMeasurement, MeasurementItem } from '@upstream/upstream-api';
import MainChart from './components/MainChart';
import OverviewChart from './components/OverviewChart';
import ChartTooltip, {
  TooltipData,
  PointTooltipData,
} from './components/ChartTooltip';
import { useChartDimensions } from './hooks/useChartDimensions';
import { useChartScales } from './hooks/useChartScales';
import { useChartBrush } from './hooks/useChartBrush';
import { defaultChartStyles, defaultFormatters } from './utils/chartUtils';

// Define the structure of additional sensors
export interface AdditionalSensor {
  info: {
    id: string;
    campaignId: string;
    stationId: string;
  };
  aggregatedData: AggregatedMeasurement[] | null;
  allPoints: MeasurementItem[] | null;
}

// Props
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
  maxValue: number;
  minValue: number;
  additionalSensors?: AdditionalSensor[];
  colorPalette?: Array<{
    line: string;
    area: string;
    point: string;
  }>;
  renderDataPoints: boolean;
}

const LineConfidenceChart: React.FC<LineConfidenceChartProps> = ({
  data,
  allPoints,
  width,
  height,
  margin = defaultChartStyles.margin,
  showAreaOverview = defaultChartStyles.showAreaOverview,
  showLineOverview = defaultChartStyles.showLineOverview,
  pointRadius = defaultChartStyles.pointRadius,
  colors = defaultChartStyles.colors,
  xAxisTitle = defaultChartStyles.xAxisTitle,
  yAxisTitle = defaultChartStyles.yAxisTitle,
  xFormatter = defaultFormatters.xFormatter,
  xFormatterOverview = defaultFormatters.xFormatter,
  yFormatter = defaultFormatters.yFormatter,
  onBrush,
  gapThresholdMinutes = 120,
  maxValue,
  minValue,
  additionalSensors = [],
  colorPalette = [
    { line: '#9a6fb0', area: '#9a6fb0', point: '#9a6fb0' }, // Primary sensor
    { line: '#4287f5', area: '#4287f5', point: '#4287f5' },
    { line: '#42c5f5', area: '#42c5f5', point: '#42c5f5' },
    { line: '#42f5a7', area: '#42f5a7', point: '#42f5a7' },
    { line: '#f5cd42', area: '#f5cd42', point: '#f5cd42' },
    { line: '#f54242', area: '#f54242', point: '#f54242' },
  ],
  renderDataPoints,
}) => {
  // Container ref for resizing
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Ref for the brush component
  const overviewRef = React.useRef<SVGGElement>(null);

  // View domain state
  const [viewDomain, setViewDomain] = React.useState<[number, number] | null>(
    null,
  );

  // Tooltip states
  const [tooltip, setTooltipAggregation] = React.useState<TooltipData | null>(
    null,
  );
  const [tooltipPoint, setTooltipPoint] =
    React.useState<PointTooltipData | null>(null);

  // Calculate chart dimensions
  const { dimensions, chartDimensions } = useChartDimensions({
    containerRef,
    width,
    height,
    margin,
  });

  // Generate scales and paths
  const { scales, paths, axisTicks } = useChartScales({
    data,
    chartDimensions,
    viewDomain,
    gapThresholdMinutes,
    minValue,
    maxValue,
    additionalSensors,
    xFormatter,
    yFormatter,
  });

  // Set up brush
  useChartBrush({
    overviewRef,
    innerWidth: chartDimensions.innerWidth,
    overviewInnerHeight: chartDimensions.overviewInnerHeight,
    overviewXScale: scales?.overviewXScale,
    setViewDomain,
    onBrush,
  });

  // Quick validation checks
  if (data.length === 0) {
    return <div>No data available</div>;
  }

  if (!scales || !paths || !axisTicks) {
    return <div>Cannot calculate chart scales</div>;
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
          colors={colors}
          pointRadius={pointRadius}
          xAxisTitle={xAxisTitle}
          yAxisTitle={yAxisTitle}
          setTooltipAggregation={setTooltipAggregation}
          setTooltipPoint={setTooltipPoint}
          additionalSensors={additionalSensors}
          colorPalette={colorPalette}
          renderDataPoints={renderDataPoints}
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
          colorPalette={colorPalette}
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

      {/* Tooltips */}
      <ChartTooltip
        tooltip={tooltip}
        tooltipPoint={tooltipPoint}
        setTooltipAggregation={setTooltipAggregation}
        setTooltipPoint={setTooltipPoint}
        renderDataPoints={renderDataPoints}
      />
    </div>
  );
};

export default LineConfidenceChart;
