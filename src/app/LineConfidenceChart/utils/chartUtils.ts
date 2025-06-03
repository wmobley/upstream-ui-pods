import { AggregatedMeasurement } from '@upstream/upstream-api';
import { formatNumber } from '../../common/NumberFormatter/NumberFortatterUtils';

/**
 * Gets segments of data with gaps for proper rendering
 */
export const getDataSegments = (
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
