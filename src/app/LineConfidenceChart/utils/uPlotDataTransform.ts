import { AggregatedMeasurement, MeasurementItem } from '@upstream/upstream-api';
import { AdditionalSensor } from '../LineConfidenceChart';

export interface UPlotSeriesData {
  /** X-axis timestamps (ms since epoch) */
  xs: (number | null)[];
  /** Primary sensor value series */
  primary: (number | null)[];
  /** Primary sensor upper bound (confidence) */
  primaryUpper: (number | null)[];
  /** Primary sensor lower bound (confidence) */
  primaryLower: (number | null)[];
  /** Additional sensors: each has value, upper, lower */
  additional: Array<{
    value: (number | null)[];
    upper: (number | null)[];
    lower: (number | null)[];
  }>;
  /** Measurement IDs aligned with data indices for point selection */
  measurementIds: (number | null)[];
  /** Note timestamps for markers */
  noteTimestamps: number[];
}

export interface TransformOptions {
  data: AggregatedMeasurement[];
  allPoints: MeasurementItem[];
  additionalSensors: AdditionalSensor[];
  gapThresholdMinutes: number;
  aggregationInterval: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month';
  aggregationValue: number;
  noteTimestamps: number[];
}

const BUCKET_MS: Record<'second' | 'minute' | 'hour' | 'day' | 'week' | 'month', number> = {
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
};

/**
 * Gap threshold in ms: the larger of the caller-configured floor
 * (gapThresholdMinutes) and a multiple of the current aggregation bucket
 * size. The bucket-relative term is required because consecutive buckets at
 * coarse aggregation are naturally far apart in wall-clock time (e.g. 'day'
 * buckets are ~24h apart) — a fixed threshold that's fine for fine-grained
 * data would flag every single normal bucket-to-bucket step as a gap once
 * the aggregation interval is coarse enough to exceed it. This previously
 * ignored gapThresholdMinutes entirely and used a hardcoded per-interval
 * table copied from the pre-uPlot D3 implementation (5 min for 'minute'
 * aggregation, etc), which broke for any sensor whose real reporting cadence
 * was coarser than that hardcoded value (e.g. hourly telemetry aggregated at
 * the 'minute' level — cadence 3600s vs. a 300s threshold).
 */
function getGapThresholdMs(
  gapThresholdMinutes: number,
  aggregationInterval: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month',
  aggregationValue: number
): number {
  const bucketMs = (BUCKET_MS[aggregationInterval] ?? BUCKET_MS.minute) * aggregationValue;
  const bucketRelativeThresholdMs = bucketMs * 3;
  return Math.max(gapThresholdMinutes * 60 * 1000, bucketRelativeThresholdMs);
}

/**
 * Transforms aggregated measurement data into uPlot series format.
 * Inserts null at gap boundaries so uPlot's spanGaps breaks lines/areas.
 * Null parametric bounds become null in upper/lower series.
 */
export function transformToUPlotData(options: TransformOptions): UPlotSeriesData {
  const {
    data,
    allPoints,
    additionalSensors,
    gapThresholdMinutes,
    aggregationInterval,
    aggregationValue,
    noteTimestamps,
  } = options;

  const gapThresholdMs = getGapThresholdMs(gapThresholdMinutes, aggregationInterval, aggregationValue);

  // Build measurement ID lookup from allPoints (raw measurements)
  const measurementIdMap = new Map<number, number>();
  allPoints.forEach((point) => {
    measurementIdMap.set(point.collectiontime.getTime(), point.id);
  });

  // Helper to process a single sensor's data
  function processSensorData(
    sensorData: AggregatedMeasurement[],
    prevTimestamp: number | null
  ): {
    xs: (number | null)[];
    values: (number | null)[];
    uppers: (number | null)[];
    lowers: (number | null)[];
    measurementIds: (number | null)[];
    lastTimestamp: number | null;
  } {
    const xs: (number | null)[] = [];
    const values: (number | null)[] = [];
    const uppers: (number | null)[] = [];
    const lowers: (number | null)[] = [];
    const measurementIds: (number | null)[] = [];
    let lastTs = prevTimestamp;

    for (let i = 0; i < sensorData.length; i++) {
      const point = sensorData[i];
      const ts = point.measurementTime.getTime();

      // Check for gap from previous point. uPlot's AlignedData requires the
      // x-array to be all real numbers (only the y-series arrays may hold
      // null) — pushing null into xs here previously corrupted uPlot's
      // auto-range min/max (null coerces to 0 in numeric comparisons),
      // squeezing all real data into a sliver at the far right of a scale
      // that effectively spanned from epoch 1970. Use a real, monotonic
      // timestamp with a null y-value instead.
      if (lastTs !== null && ts - lastTs > gapThresholdMs) {
        xs.push(lastTs + 1);
        values.push(null);
        uppers.push(null);
        lowers.push(null);
        measurementIds.push(null);
      }

      xs.push(ts);
      values.push(point.value);
      uppers.push(point.parametricUpperBound ?? null);
      lowers.push(point.parametricLowerBound ?? null);

      // Find nearest measurement ID for this timestamp
      const measurementId = measurementIdMap.get(ts) ?? null;
      measurementIds.push(measurementId);

      lastTs = ts;
    }

    return { xs, values, uppers, lowers, measurementIds, lastTimestamp: lastTs };
  }

  // Process primary sensor
  const primary = processSensorData(data, null);

  // Process additional sensors - they share the same x-axis, so we align by timestamp
  // For simplicity, we process each independently and uPlot will handle alignment via nulls
  const additional = additionalSensors.map((sensor) => {
    if (!sensor.aggregatedData || sensor.aggregatedData.length === 0) {
      return { value: [], upper: [], lower: [] };
    }
    const processed = processSensorData(sensor.aggregatedData, null);
    return {
      value: processed.values,
      upper: processed.uppers,
      lower: processed.lowers,
    };
  });

  return {
    xs: primary.xs,
    primary: primary.values,
    primaryUpper: primary.uppers,
    primaryLower: primary.lowers,
    additional,
    measurementIds: primary.measurementIds,
    noteTimestamps,
  };
}

/**
 * Builds uPlot series configuration from transformed data and props
 */
export interface SeriesConfig {
  series: uPlot.Series[];
  seriesCount: number;
}

export interface UPlotSeriesOptions {
  colorPalette: Array<{ line: string; area: string; point: string }>;
  primaryColors: { line?: string; area?: string; point?: string };
  showLine: boolean;
  pointRadius: number;
  renderDataPoints: boolean;
  /** Formats the x-axis (time) value shown in the legend/crosshair readout. */
  timeFormatter: (ms: number) => string;
  /** Primary sensor's unit of measurement, e.g. "degC". */
  primaryUnits?: string;
  /** Each additional (comparison) sensor's unit, aligned by index with data.additional. */
  additionalSensorUnits?: (string | undefined)[];
}

export function buildSeriesConfig(
  data: UPlotSeriesData,
  options: UPlotSeriesOptions
): SeriesConfig {
  const {
    colorPalette,
    primaryColors,
    showLine,
    pointRadius,
    renderDataPoints,
    timeFormatter,
    primaryUnits,
    additionalSensorUnits,
  } = options;

  const series: uPlot.Series[] = [];

  // Series 0: X-axis (time). uPlot passes the already-resolved raw value as
  // the 2nd argument — the previous `(u, i) => u.data[0][i]` treated that
  // raw timestamp as an array index, indexing wildly out of bounds and
  // always returning undefined, which is why "Time" never displayed.
  series.push({
    label: 'Time',
    value: (_u: uPlot, rawValue: number, _seriesIdx: number, idx: number | null) =>
      idx == null || rawValue == null ? '--' : timeFormatter(rawValue),
  });

  // Series 1: Primary value (line)
  series.push({
    label: 'Value',
    scale: 'y',
    stroke: primaryColors.line || colorPalette[0]?.line || '#9a6fb0',
    width: showLine ? 2 : 0,
    spanGaps: false,
    points: {
      show: renderDataPoints && showLine,
      size: pointRadius,
      fill: primaryColors.point || colorPalette[0]?.point || '#9a6fb0',
      stroke: 'white',
      width: 1,
    },
  });

  // Series 2: Primary upper bound (hidden, used for band)
  series.push({
    label: 'Upper Bound',
    scale: 'y',
    show: false,
    spanGaps: false,
    stroke: 'transparent',
    points: { show: false },
  });

  // Series 3: Primary lower bound (hidden, used for band)
  series.push({
    label: 'Lower Bound',
    scale: 'y',
    show: false,
    spanGaps: false,
    stroke: 'transparent',
    points: { show: false },
  });

  // Additional sensors: 3 series each (value, upper, lower). A sensor whose
  // units differ from the primary's gets the secondary (right) y-axis
  // instead of being squashed flat against a scale built for a different
  // unit — see UPlotChart's secondaryUnitLabel.
  data.additional.forEach((_sensor, sensorIndex) => {
    const palette = colorPalette[sensorIndex + 1] || colorPalette[0];
    const color = palette?.line || '#9a6fb0';
    const units = additionalSensorUnits?.[sensorIndex];
    const scale = units != null && units !== primaryUnits ? 'y2' : 'y';

    // Value series
    series.push({
      label: `Sensor ${sensorIndex + 2} Value`,
      scale,
      stroke: color,
      width: showLine ? 2 : 0,
      spanGaps: false,
      points: {
        show: renderDataPoints && showLine,
        size: pointRadius,
        fill: color,
        stroke: 'white',
        width: 1,
      },
    });

    // Upper bound (hidden)
    series.push({
      label: `Sensor ${sensorIndex + 2} Upper Bound`,
      scale,
      show: false,
      spanGaps: false,
      stroke: 'transparent',
      points: { show: false },
    });

    // Lower bound (hidden)
    series.push({
      label: `Sensor ${sensorIndex + 2} Lower Bound`,
      scale,
      show: false,
      spanGaps: false,
      stroke: 'transparent',
      points: { show: false },
    });
  });

  return { series, seriesCount: series.length };
}

/**
 * Builds the full uPlot data array from transformed data
 */
export function buildUPlotDataArray(data: UPlotSeriesData): (number | null)[][] {
  const arrays: (number | null)[][] = [];

  // X-axis
  arrays.push(data.xs);

  // Primary sensor: value, upper, lower
  arrays.push(data.primary);
  arrays.push(data.primaryUpper);
  arrays.push(data.primaryLower);

  // Additional sensors
  data.additional.forEach((sensor) => {
    arrays.push(sensor.value);
    arrays.push(sensor.upper);
    arrays.push(sensor.lower);
  });

  return arrays;
}