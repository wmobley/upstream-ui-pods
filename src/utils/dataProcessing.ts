/**
 * Data processing utilities for time series visualization
 * Implements Largest-Triangle-Three-Buckets (LTTB) algorithm for downsampling
 * and time-based aggregation functions.
 */

export interface DataPoint {
  timestamp: Date;
  value: number;
  geometry: GeoJSON.Point;
}

export interface ProcessedDataPoint extends DataPoint {
  originalIndex?: number;
}

/**
 * Calculates the area of a triangle formed by three points
 */
function calculateTriangleArea(
  pointA: ProcessedDataPoint,
  pointB: ProcessedDataPoint,
  pointC: ProcessedDataPoint,
): number {
  return (
    Math.abs(
      (pointA.timestamp.getTime() - pointC.timestamp.getTime()) *
        (pointB.value - pointA.value) -
        (pointA.timestamp.getTime() - pointB.timestamp.getTime()) *
          (pointC.value - pointA.value),
    ) / 2
  );
}

/**
 * Implements the Largest-Triangle-Three-Buckets (LTTB) algorithm for downsampling time series data
 * while preserving the visual characteristics of the data.
 *
 * @param data - Array of data points to be downsampled
 * @param threshold - Target number of points in the output
 * @returns Downsampled array of data points
 */
export function lttb(
  data: DataPoint[],
  threshold: number,
): ProcessedDataPoint[] {
  if (threshold >= data.length || threshold <= 2) {
    return data.map((point, index) => ({ ...point, originalIndex: index }));
  }

  const sampled: ProcessedDataPoint[] = [];
  const bucketSize = (data.length - 2) / (threshold - 2);

  // Always add the first point
  sampled.push({ ...data[0], originalIndex: 0 });

  for (let i = 0; i < threshold - 2; i++) {
    const bucketStart = Math.floor((i + 0) * bucketSize) + 1;
    const bucketEnd = Math.floor((i + 1) * bucketSize) + 1;
    const avgX =
      data
        .slice(bucketStart, bucketEnd)
        .reduce((sum, p) => sum + p.timestamp.getTime(), 0) /
      (bucketEnd - bucketStart);
    const avgY =
      data.slice(bucketStart, bucketEnd).reduce((sum, p) => sum + p.value, 0) /
      (bucketEnd - bucketStart);

    const rangeOfBucket = data.slice(bucketStart, bucketEnd);
    let maxArea = -1;
    let maxAreaPoint = rangeOfBucket[0];
    let maxAreaIndex = bucketStart;

    for (let j = bucketStart; j < bucketEnd; j++) {
      const area = calculateTriangleArea(
        sampled[sampled.length - 1],
        { ...data[j], originalIndex: j },
        {
          timestamp: new Date(avgX),
          value: avgY,
          originalIndex: -1,
          geometry: data[j].geometry,
        },
      );

      if (area > maxArea) {
        maxArea = area;
        maxAreaPoint = data[j];
        maxAreaIndex = j;
      }
    }

    sampled.push({ ...maxAreaPoint, originalIndex: maxAreaIndex });
  }

  // Always add the last point
  sampled.push({ ...data[data.length - 1], originalIndex: data.length - 1 });

  return sampled;
}

/**
 * Aggregates data points by time interval
 */
export interface TimeAggregation {
  timestamp: Date;
  min: number;
  max: number;
  avg: number;
  count: number;
}

export type TimeInterval = 'minute' | 'hour' | 'day';

function getIntervalMilliseconds(interval: TimeInterval): number {
  const intervals = {
    minute: 60 * 1000,
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
  };
  return intervals[interval];
}

/**
 * Aggregates time series data by specified time interval
 */
export function aggregateByTime(
  data: DataPoint[],
  interval: TimeInterval,
): TimeAggregation[] {
  if (data.length === 0) return [];

  const intervalMs = getIntervalMilliseconds(interval);
  const aggregations = new Map<number, TimeAggregation>();

  data.forEach((point) => {
    const intervalStart =
      Math.floor(point.timestamp.getTime() / intervalMs) * intervalMs;
    const existing = aggregations.get(intervalStart);

    if (existing) {
      existing.min = Math.min(existing.min, point.value);
      existing.max = Math.max(existing.max, point.value);
      existing.avg =
        (existing.avg * existing.count + point.value) / (existing.count + 1);
      existing.count += 1;
    } else {
      aggregations.set(intervalStart, {
        timestamp: new Date(intervalStart),
        min: point.value,
        max: point.value,
        avg: point.value,
        count: 1,
      });
    }
  });

  return Array.from(aggregations.values()).sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );
}

/**
 * Calculates appropriate threshold based on container width
 */
export function calculateThreshold(containerWidth: number): number {
  // Use approximately 2-3 points per pixel for smooth rendering
  // but cap at reasonable limits for performance
  const baseThreshold = Math.ceil(containerWidth * 2.5);
  return Math.min(Math.max(baseThreshold, 500), 5000);
}

/**
 * Determines appropriate resolution based on time range and container width
 */
export function getAppropriateResolution(
  startTime: Date,
  endTime: Date,
  containerWidth: number,
): TimeInterval {
  const timeRange = endTime.getTime() - startTime.getTime();
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  if (timeRange > millisecondsPerDay * 30) {
    return 'day';
  } else if (timeRange > millisecondsPerDay) {
    return 'hour';
  } else {
    return 'minute';
  }
}
