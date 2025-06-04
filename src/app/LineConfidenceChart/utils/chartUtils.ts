import { AggregatedMeasurement } from '@upstream/upstream-api';
import { formatNumber } from '../../common/NumberFormatter/NumberFortatterUtils';

/**
 * Gets segments of data with gaps for proper rendering
 * @param data - Array of aggregated measurements
 * @param gapThresholdMinutes - Default gap threshold in minutes (default: 120)
 * @param aggregationInterval - The interval at which data is aggregated (e.g., 'minute', 'hour', 'day', 'week', 'month')
 * @returns Array of data segments, where each segment is an array of continuous measurements
 */
export const getDataSegments = (
  data: AggregatedMeasurement[],
  gapThresholdMinutes: number = 120, // 2 hours default
  aggregationInterval?: 'minute' | 'hour' | 'day' | 'week' | 'month',
): AggregatedMeasurement[][] => {
  if (data.length === 0) return [];
  // Calculate dynamic gap threshold based on aggregation interval
  let dynamicGapThreshold = gapThresholdMinutes;
  if (aggregationInterval) {
    const intervals = {
      minute: 5, // 5 minutes
      hour: 120, // 2 hours
      day: 2880, // 2 days
      week: 20160, // 2 weeks
      month: 86400, // 2 months
    };
    dynamicGapThreshold = intervals[aggregationInterval];
  }

  const segments: AggregatedMeasurement[][] = [];
  let currentSegment: AggregatedMeasurement[] = [data[0]];

  for (let i = 1; i < data.length; i++) {
    const timeDiff =
      (data[i].measurementTime.getTime() -
        data[i - 1].measurementTime.getTime()) /
      (1000 * 60); // Convert to minutes

    if (timeDiff > dynamicGapThreshold) {
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

/**
 * Default formatters for axes
 */
export const defaultFormatters = {
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

/**
 * Default chart styling options
 */
export const defaultChartStyles = {
  margin: { top: 20, right: 0, bottom: 30, left: 0 },
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
};

/**
 * Calculate chart dimensions based on container size
 */
export const calculateChartDimensions = (
  width: number,
  height: number,
  margin: { top: number; right: number; bottom: number; left: number },
) => {
  const mainHeight = height;

  const innerWidth = width - margin.left - margin.right;
  const mainInnerHeight = mainHeight - margin.top - margin.bottom;

  return {
    innerWidth,
    mainHeight,
    mainInnerHeight,
  };
};
