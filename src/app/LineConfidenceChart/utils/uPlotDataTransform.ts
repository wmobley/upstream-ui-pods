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

/**
 * Converts gap threshold from minutes to milliseconds based on aggregation interval
 */
function getGapThresholdMs(
  _gapThresholdMinutes: number,
  aggregationInterval: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month',
  aggregationValue: number
): number {
  // Use the same logic as chartUtils.ts getDataSegments
  const intervals: Record<string, number> = {
    second: 0.5 * 60 * 1000, // 30 seconds base
    minute: 5 * 60 * 1000,   // 5 minutes base
    hour: 120 * 60 * 1000,   // 2 hours base
    day: 2880 * 60 * 1000,   // 2 days base
    week: 20160 * 60 * 1000, // 2 weeks base
    month: 86400 * 60 * 1000, // 2 months base
  };

  const baseMs = intervals[aggregationInterval] ?? intervals.minute;
  // Scale by aggregation value (e.g., 5-second buckets = 5x base)
  return baseMs * aggregationValue;
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

      // Check for gap from previous point
      if (lastTs !== null && ts - lastTs > gapThresholdMs) {
        // Insert null separator for gap
        xs.push(null);
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
}

export function buildSeriesConfig(
  data: UPlotSeriesData,
  options: UPlotSeriesOptions
): SeriesConfig {
  const { colorPalette, primaryColors, showLine, pointRadius, renderDataPoints } = options;

  const series: uPlot.Series[] = [];

  // Series 0: X-axis (time)
  series.push({
    label: 'Time',
    value: (u: uPlot, i: number) => u.data[0][i],
  });

  // Series 1: Primary value (line)
  series.push({
    label: 'Primary',
    stroke: primaryColors.line || colorPalette[0]?.line || '#9a6fb0',
    width: showLine ? 2 : 0,
    spanGaps: true,
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
    label: 'Primary Upper',
    show: false,
    spanGaps: true,
    stroke: 'transparent',
  });

  // Series 3: Primary lower bound (hidden, used for band)
  series.push({
    label: 'Primary Lower',
    show: false,
    spanGaps: true,
    stroke: 'transparent',
  });

  // Additional sensors: 3 series each (value, upper, lower)
  data.additional.forEach((_sensor, sensorIndex) => {
    const palette = colorPalette[sensorIndex + 1] || colorPalette[0];
    const color = palette?.line || '#9a6fb0';

    // Value series
    series.push({
      label: `Sensor ${sensorIndex + 2}`,
      stroke: color,
      width: showLine ? 2 : 0,
      spanGaps: true,
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
      label: `Sensor ${sensorIndex + 2} Upper`,
      show: false,
      spanGaps: true,
      stroke: 'transparent',
    });

    // Lower bound (hidden)
    series.push({
      label: `Sensor ${sensorIndex + 2} Lower`,
      show: false,
      spanGaps: true,
      stroke: 'transparent',
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