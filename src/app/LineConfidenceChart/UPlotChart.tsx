import * as React from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { AggregatedMeasurement, MeasurementItem } from '@upstream/upstream-api';
import { AdditionalSensor } from './LineConfidenceChart';
import { transformToUPlotData, buildSeriesConfig, buildUPlotDataArray, UPlotSeriesData } from './utils/uPlotDataTransform';
import { yDragZoomPlugin } from './plugins/yDragZoom';
import { crosshairClickPlugin, confidenceBandPlugin, PointSelectionData } from './plugins/crosshairClick';

interface UPlotChartProps {
  data: AggregatedMeasurement[];
  allPoints: MeasurementItem[];
  loading: boolean;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  showAreaOverview?: boolean;
  showLineOverview?: boolean;
  pointRadius?: number;
  colors?: { line?: string; area?: string; point?: string };
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
  colorPalette?: Array<{ line: string; area: string; point: string }>;
  renderDataPoints: boolean;
  selectedSensorId: string;
  campaignId: string;
  stationId: string;
  aggregationInterval: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month';
  aggregationValue: number;
  noteTimestamps: number[];
  onYBrush?: (domain: [number, number]) => void;
  onPointSelect?: (payload: PointSelectionData) => void;
  viewDomain?: [number, number] | null;
  onViewDomainChange?: (domain: [number, number] | null) => void;
}

const defaultColors = {
  line: '#9a6fb0',
  area: '#9a6fb0',
  point: '#9a6fb0',
};

const defaultColorPalette = [
  { line: '#9a6fb0', area: '#9a6fb0', point: '#9a6fb0' },
  { line: '#4287f5', area: '#4287f5', point: '#4287f5' },
  { line: '#42c5f5', area: '#42c5f5', point: '#42c5f5' },
  { line: '#42f5a7', area: '#42f5a7', point: '#42f5a7' },
  { line: '#f5cd42', area: '#f5cd42', point: '#f5cd42' },
  { line: '#f54242', area: '#f54242', point: '#f54242' },
];

const defaultMargin = { top: 20, right: 50, bottom: 50, left: 50 };

// Generate axis tick values
function generateTicks(min: number, max: number, count: number): number[] {
  const incr = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, i) => min + i * incr);
}

export const UPlotChart: React.FC<UPlotChartProps> = ({
  data,
  allPoints,
  loading,
  width,
  height,
  margin = defaultMargin,
  showAreaOverview,
  showLineOverview = true,
  pointRadius = 3,
  colors = defaultColors,
  xAxisTitle = 'Time',
  yAxisTitle = 'Value',
  xFormatter,
  xFormatterOverview,
  yFormatter,
  onBrush,
  gapThresholdMinutes = 120,
  maxValue,
  minValue,
  additionalSensors = [],
  colorPalette = defaultColorPalette,
  renderDataPoints = true,
  selectedSensorId,
  campaignId,
  stationId,
  aggregationInterval,
  aggregationValue,
  noteTimestamps = [],
  onYBrush,
  onPointSelect,
  viewDomain,
  onViewDomainChange,
}) => {
  // Suppress unused variable warnings
  void showAreaOverview;
  void xFormatterOverview;

  const containerRef = React.useRef<HTMLDivElement>(null);
  const uplotRef = React.useRef<uPlot | null>(null);
  const [dimensions, setDimensions] = React.useState({ width: width || 800, height: height || 500 });
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Resize observer
  React.useEffect(() => {
    if (!containerRef.current || (width && height)) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width: w, height: h } = entries[0].contentRect;
        setDimensions({ width: w, height: h });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [containerRef, width, height]);

  // Transform data for uPlot
  const uplotData = React.useMemo((): UPlotSeriesData => {
    if (data.length === 0) {
      return {
        xs: [],
        primary: [],
        primaryUpper: [],
        primaryLower: [],
        additional: [],
        measurementIds: [],
        noteTimestamps,
      };
    }

    return transformToUPlotData({
      data,
      allPoints,
      additionalSensors,
      gapThresholdMinutes,
      aggregationInterval,
      aggregationValue,
      noteTimestamps,
    });
  }, [
    data,
    allPoints,
    additionalSensors,
    gapThresholdMinutes,
    aggregationInterval,
    aggregationValue,
    noteTimestamps,
  ]);

  // Build series config
  const { series } = React.useMemo(() => {
    return buildSeriesConfig(uplotData, {
      colorPalette,
      primaryColors: colors,
      showLine: showLineOverview,
      pointRadius,
      renderDataPoints,
    });
  }, [uplotData, colorPalette, colors, showLineOverview, pointRadius, renderDataPoints]);

  // Build data array
  const dataArray = React.useMemo(() => buildUPlotDataArray(uplotData), [uplotData]);

  // Time formatter for uPlot
  const timeFormatter = React.useCallback(
    (ms: number) => {
      if (!xFormatter) return new Date(ms).toLocaleTimeString();
      return xFormatter(ms);
    },
    [xFormatter]
  );

  // Value formatter for uPlot
  const valueFormatter = React.useCallback(
    (val: number) => {
      if (!yFormatter) return val.toString();
      return yFormatter(val);
    },
    [yFormatter]
  );

  // Initialize uPlot
  React.useEffect(() => {
    if (!containerRef.current || isInitialized) return;

    const opts: uPlot.Options = {
      title: '',
      width: dimensions.width,
      height: dimensions.height,
      padding: [margin.top, margin.right, margin.bottom, margin.left],
      scales: {
        x: {
          time: true,
          auto: true,
        },
        y: {
          auto: true,
          min: minValue,
          max: maxValue,
        },
      },
      series,
      axes: [
        {
          scale: 'x',
          side: 2, // bottom
          grid: { stroke: 'var(--gray-300)', width: 1 },
          ticks: { size: 6, stroke: 'var(--gray-300)' },
          values: (u: uPlot) => {
            const scale = u.scales.x;
            const xMin = scale.min ?? 0;
            const xMax = scale.max ?? 1;
            const ticks = generateTicks(xMin, xMax, 5);
            return ticks.map((v) => [v, timeFormatter(v)]) as unknown as (string | number | null)[];
          },
          label: xAxisTitle,
          labelGap: 30,
          labelSize: 11,
          stroke: 'var(--gray-600)',
        },
        {
          scale: 'y',
          side: 3, // left
          grid: { stroke: 'var(--gray-300)', width: 1 },
          ticks: { size: 6, stroke: 'var(--gray-300)' },
          values: (u: uPlot) => {
            const scale = u.scales.y;
            const yMin = scale.min ?? 0;
            const yMax = scale.max ?? 1;
            const ticks = generateTicks(yMin, yMax, 5);
            return ticks.map((v) => [v, valueFormatter(v)]) as unknown as (string | number | null)[];
          },
          label: yAxisTitle,
          labelGap: 30,
          labelSize: 11,
          stroke: 'var(--gray-600)',
        },
      ],
      cursor: {
        show: true,
        x: true,
        y: true,
        drag: {
          x: true,
          y: false,
          setScale: true,
        },
        focus: {
          prox: 16,
        },
        points: {
          show: renderDataPoints,
          size: pointRadius,
          stroke: 'white',
          width: 1,
        },
      },
      plugins: [
        confidenceBandPlugin(),
        yDragZoomPlugin({ onYZoom: onYBrush }),
        crosshairClickPlugin({
          allPoints,
          additionalPoints: additionalSensors.map((s) => s.allPoints ?? null),
          sensorId: selectedSensorId,
          campaignId,
          stationId,
          onPointSelect,
          onPointHover: () => {}, // Could add tooltip later
        }),
      ],
      hooks: {
        // Sync view domain changes to parent
        setScale: [
          (u: uPlot) => {
            if (onViewDomainChange) {
              const xScale = u.scales.x;
              const domain: [number, number] = [xScale.min ?? 0, xScale.max ?? 1];
              onViewDomainChange(domain);
            }
            if (onBrush) {
              const xScale = u.scales.x;
              const domain: [number, number] = [xScale.min ?? 0, xScale.max ?? 1];
              onBrush(domain);
            }
          },
        ],
        draw: [
          (u: uPlot) => {
            // Draw note markers (vertical dotted lines)
            if (noteTimestamps.length > 0 && u.ctx) {
              const ctx = u.ctx;
              const { left, top, width: w, height: h } = u.bbox;

              ctx.save();
              ctx.strokeStyle = '#ea580c';
              ctx.lineWidth = 1;
              ctx.setLineDash([4, 4]);
              ctx.globalAlpha = 0.7;

              noteTimestamps.forEach((ts) => {
                const x = u.valToPos(ts, 'x', true);
                if (x != null && x >= left && x <= left + w) {
                  ctx.beginPath();
                  ctx.moveTo(x, top);
                  ctx.lineTo(x, top + h);
                  ctx.stroke();
                }
              });

              ctx.restore();
            }
          },
        ],
      },
    };

    const u = new uPlot(opts, dataArray as uPlot.AlignedData, containerRef.current!);
    uplotRef.current = u;
    setIsInitialized(true);

    // Apply initial view domain if provided
    if (viewDomain) {
      u.setScale('x', { min: viewDomain[0], max: viewDomain[1] });
    }

    return () => {
      u.destroy();
      uplotRef.current = null;
      setIsInitialized(false);
    };
  }, []); // Only run once on mount

  // Update data when props change
  React.useEffect(() => {
    if (!uplotRef.current || !isInitialized) return;

    const u = uplotRef.current;
    u.setData(dataArray as uPlot.AlignedData);

    // Update scales if needed
    if (viewDomain) {
      u.setScale('x', { min: viewDomain[0], max: viewDomain[1] });
    }
    u.setScale('y', { min: minValue, max: maxValue });
  }, [dataArray, viewDomain, minValue, maxValue, isInitialized]);

  // Update cursor options when renderDataPoints changes
  React.useEffect(() => {
    if (!uplotRef.current || !isInitialized) return;
    const u = uplotRef.current;
    u.series.forEach((s, i) => {
      if (i === 0) return;
      // Update points configuration directly
      if (s.points) {
        // uPlot wraps points.show into a function (fnOrSelf) when the series is
        // created; it must stay callable here or drawSeries throws on redraw.
        const shouldShowPoints = renderDataPoints && s.show !== false;
        s.points.show = () => shouldShowPoints;
        s.points.size = pointRadius;
      }
    });
    u.redraw();
  }, [renderDataPoints, pointRadius, isInitialized]);

  // Loading overlay
  if (loading) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center w-full h-full"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        ref={containerRef}
        className="flex items-center justify-center w-full h-full"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <div className="text-gray-600 text-lg">No data available</div>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full" style={{ width: dimensions.width, height: dimensions.height }} />;
};

export default React.memo(UPlotChart);