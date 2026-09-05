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

// Site brand teal (tailwind.config.ts `primary.DEFAULT`) — used for the
// single-sensor default line/point. Too low-chroma to serve as a categorical
// slot once multiple sensors are compared (see defaultColorPalette below).
const defaultColors = {
  line: '#008080',
  area: '#008080',
  point: '#008080',
};

// Colorblind-safe categorical sequence for comparing 2+ sensors, validated
// with the dataviz skill's palette checker (CVD/contrast/lightness all pass
// in this order; do not reorder without re-validating adjacent pairs). Slot 1
// is the teal/aqua family closest to the site's brand color.
const defaultColorPalette = [
  { line: '#1baf7a', area: '#1baf7a', point: '#1baf7a' },
  { line: '#eda100', area: '#eda100', point: '#eda100' },
  { line: '#e87ba4', area: '#e87ba4', point: '#e87ba4' },
  { line: '#008300', area: '#008300', point: '#008300' },
  { line: '#4a3aa7', area: '#4a3aa7', point: '#4a3aa7' },
  { line: '#e34948', area: '#e34948', point: '#e34948' },
];

// Neutral grid/axis chrome, matching tailwind.config.ts `secondary` (gray)
// scale. uPlot draws on <canvas>, which cannot resolve CSS custom properties
// (unlike SVG) — `var(--gray-300)` silently no-ops there, so these must stay
// literal hex.
const axisGridColor = '#D1D5DB'; // secondary.300
const axisTextColor = '#4B5563'; // secondary.600

const defaultMargin = { top: 20, right: 50, bottom: 50, left: 50 };

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

  const containerRef = React.useRef<HTMLDivElement>(null);
  const uplotRef = React.useRef<uPlot | null>(null);
  const [dimensions, setDimensions] = React.useState({ width: width || 800, height: height || 500 });
  const [isInitialized, setIsInitialized] = React.useState(false);
  // Guards the setScale hook against firing onViewDomainChange/onBrush for
  // scale changes we trigger ourselves (mount/data-sync effects). Without
  // this, our own u.setScale calls feed back into viewDomain/selectedTimeRange
  // state, which re-triggers the same effect and loops forever.
  const isProgrammaticScaleUpdate = React.useRef(false);

  // Resize observer. Only tracks width — the container's own CSS height used
  // to be pinned to this observed value, but uPlot renders a legend table
  // below the canvas inside the same container, so a height that grows with
  // more comparison-sensor legend rows would (a) get read back as an even
  // taller "observed" height and (b) require the container to also be
  // unconstrained (see the plain <div> below) so the legend isn't clipped or
  // spilling past a box sized for the canvas alone.
  React.useEffect(() => {
    if (!containerRef.current || (width && height)) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width: w } = entries[0].contentRect;
        setDimensions((prev) => ({ width: w, height: prev.height }));
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

  // Build data array
  const dataArray = React.useMemo(() => buildUPlotDataArray(uplotData), [uplotData]);

  // Compact time formatter for x-axis tick labels. Axis ticks need a short,
  // date-only label to avoid overlapping at typical tick densities; the full
  // date+time (xFormatter) is reserved for the crosshair/tooltip readout,
  // where there's room and precision matters more than density.
  const timeFormatter = React.useCallback(
    (ms: number) => {
      if (xFormatterOverview) return xFormatterOverview(ms);
      if (xFormatter) return xFormatter(ms);
      return new Date(ms).toLocaleDateString();
    },
    [xFormatter, xFormatterOverview]
  );

  // Full date+time formatter for the legend/crosshair "Time" readout, where
  // precision matters more than density (unlike the axis ticks above).
  const legendTimeFormatter = React.useCallback(
    (ms: number) => {
      if (xFormatter) return xFormatter(ms);
      return new Date(ms).toLocaleString();
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

  // A comparison sensor whose units differ from the primary's gets its own
  // (right-side) y-axis instead of being squashed flat against a scale built
  // for a different unit. At most one secondary unit is supported — further
  // distinct units fall back onto that same secondary axis rather than
  // growing an unbounded number of axes.
  const additionalSensorUnits = React.useMemo(
    () => additionalSensors.map((s) => s.info.units),
    [additionalSensors]
  );
  const secondaryUnitLabel = React.useMemo(
    () => additionalSensorUnits.find((u) => u != null && u !== yAxisTitle),
    [additionalSensorUnits, yAxisTitle]
  );

  // Build series config
  const { series } = React.useMemo(() => {
    return buildSeriesConfig(uplotData, {
      colorPalette,
      primaryColors: colors,
      showLine: showLineOverview,
      pointRadius,
      renderDataPoints,
      timeFormatter: legendTimeFormatter,
      primaryUnits: yAxisTitle,
      additionalSensorUnits,
    });
  }, [
    uplotData,
    colorPalette,
    colors,
    showLineOverview,
    pointRadius,
    renderDataPoints,
    legendTimeFormatter,
    yAxisTitle,
    additionalSensorUnits,
  ]);

  // Initialize uPlot. Re-runs (destroying and recreating the instance) when
  // the number of series changes — e.g. a comparison sensor is added or
  // removed via the "Compare" modal. uPlot's series list is fixed at
  // construction time; series.length is not in this effect's deps, calling
  // u.setData() with more/fewer data columns than the currently-constructed
  // series count silently does not add the new series (no new line, no new
  // legend row), which is why comparison sensors previously appeared in the
  // "Comparison Sensors" list but never showed up on the chart.
  React.useEffect(() => {
    if (!containerRef.current) return;

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
        // Only used when a comparison sensor's units differ from the
        // primary's (see secondaryUnitLabel) — auto-ranged independently so
        // it isn't constrained by the primary's min/max.
        y2: {
          auto: true,
        },
      },
      series,
      axes: [
        {
          scale: 'x',
          side: 2, // bottom
          // Vertical gridlines are dropped — with the y-axis's horizontal
          // ones already present, both together just produce a checkerboard
          // with no added readability.
          grid: { show: false },
          ticks: { size: 6, stroke: axisGridColor },
          // Minimum pixel gap between ticks — our date labels are wider than
          // uPlot's own default time-axis labels, so its default spacing
          // packs ticks close enough to overlap.
          space: 90,
          // Format uPlot's own computed tick positions (splits) — do not
          // generate a separate set of tick positions here, or the labels
          // won't line up with (or even match the count of) the gridlines
          // uPlot actually draws.
          values: (_u: uPlot, splits: number[]) => splits.map((v) => timeFormatter(v)),
          label: xAxisTitle,
          labelGap: 30,
          labelSize: 11,
          font: '12px system-ui, sans-serif',
          stroke: axisTextColor,
        },
        {
          scale: 'y',
          side: 3, // left
          grid: { stroke: axisGridColor, width: 1 },
          ticks: { size: 6, stroke: axisGridColor },
          values: (_u: uPlot, splits: number[]) => splits.map((v) => valueFormatter(v)),
          label: yAxisTitle,
          labelGap: 30,
          labelSize: 11,
          font: '12px system-ui, sans-serif',
          stroke: axisTextColor,
        },
        // Right-side axis for a comparison sensor with different units. Only
        // added when actually needed, since an unused scale still renders an
        // empty auto-ranged (0–1) axis otherwise.
        ...(secondaryUnitLabel
          ? [
              {
                scale: 'y2',
                side: 1 as const, // right
                grid: { show: false },
                ticks: { size: 6, stroke: axisGridColor },
                values: (_u: uPlot, splits: number[]) => splits.map((v) => valueFormatter(v)),
                label: secondaryUnitLabel,
                labelGap: 30,
                labelSize: 11,
                font: '12px system-ui, sans-serif',
                stroke: axisTextColor,
              },
            ]
          : []),
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
            if (isProgrammaticScaleUpdate.current) return;
            // uPlot also fires this hook for its own internal auto-ranging
            // (e.g. establishing the initial scale from data on construction,
            // or after setData), not just real user drag/zoom. cursor.event
            // is only ever set by a genuine mouse event, so use it to ignore
            // non-interactive scale changes — otherwise a fresh mount's own
            // initial auto-range gets treated as a user brush, narrows
            // selectedTimeRange, triggers a refetch, and (if that refetch
            // remounts this component) repeats forever.
            if (u.cursor.event == null) return;
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

    // Apply initial view domain if provided. u.batch() commits synchronously
    // (uPlot's plain setScale defers the setScale hook to a microtask via
    // commit(), which would run after isProgrammaticScaleUpdate is already
    // reset back to false below).
    if (viewDomain) {
      isProgrammaticScaleUpdate.current = true;
      u.batch(() => {
        u.setScale('x', { min: viewDomain[0], max: viewDomain[1] });
      });
      isProgrammaticScaleUpdate.current = false;
    }

    return () => {
      u.destroy();
      uplotRef.current = null;
      setIsInitialized(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliberately
    // narrow: only series.length should force a full destroy/recreate. Other
    // props (colors, formatters, callbacks, etc.) are read once per mount and
    // kept in sync afterward by the lighter-weight effects below (data/scale
    // updates, cursor point config) rather than tearing down the whole chart.
  }, [series.length, secondaryUnitLabel]);

  // Update data when props change
  React.useEffect(() => {
    if (!uplotRef.current || !isInitialized) return;

    const u = uplotRef.current;

    // Batched so setData + both setScale calls commit synchronously in one
    // pass; otherwise commit() defers to a microtask and the setScale hook
    // fires after isProgrammaticScaleUpdate has already been reset below.
    isProgrammaticScaleUpdate.current = true;
    u.batch(() => {
      u.setData(dataArray as uPlot.AlignedData);
      if (viewDomain) {
        u.setScale('x', { min: viewDomain[0], max: viewDomain[1] });
      }
      u.setScale('y', { min: minValue, max: maxValue });
    });
    isProgrammaticScaleUpdate.current = false;
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

  // No fixed height here: uPlot renders its legend table below the canvas,
  // inside this same container, and the legend grows taller with each
  // comparison sensor added. A height matching only the canvas would let
  // that legend spill out past the box into whatever follows on the page.
  return <div ref={containerRef} className="w-full" style={{ width: dimensions.width }} />;
};

export default React.memo(UPlotChart);