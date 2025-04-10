type AggregationInterval =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month';

/**
 * Selects an appropriate time unit for aggregation based on the time span of the data
 *
 * Guidelines:
 * - For data spanning less than 1 hour: aggregate by seconds
 * - For data spanning 1-24 hours: aggregate by minutes
 * - For data spanning 1-7 days: aggregate by hours
 * - For data spanning 1 week to 3 months: aggregate by days
 * - For data spanning 3 months to 1 year: aggregate by weeks
 * - For data spanning more than 1 year: aggregate by months
 *
 * @param startTime - The start time of the data range
 * @param endTime - The end time of the data range
 * @returns The appropriate aggregation interval
 */
export function selectAggregationInterval(
  startTime: Date,
  endTime: Date,
): AggregationInterval {
  const timeRange = endTime.getTime() - startTime.getTime();

  // Constants for time ranges in milliseconds
  const millisecondsPerSecond = 1000;
  const millisecondsPerMinute = 60 * millisecondsPerSecond;
  const millisecondsPerHour = 60 * millisecondsPerMinute;
  const millisecondsPerDay = 24 * millisecondsPerHour;
  const millisecondsPerWeek = 7 * millisecondsPerDay;
  const millisecondsPerMonth = 30 * millisecondsPerDay;
  const millisecondsPerYear = 365 * millisecondsPerDay;

  // Apply the selection algorithm based on the guidelines
  if (timeRange > millisecondsPerYear) {
    return 'month';
  } else if (timeRange > 3 * millisecondsPerMonth) {
    return 'week';
  } else if (timeRange > millisecondsPerWeek) {
    return 'day';
  } else if (timeRange > millisecondsPerDay) {
    return 'hour';
  } else if (timeRange > millisecondsPerHour) {
    return 'minute';
  } else {
    return 'second';
  }
}

/**
 * Converts a TimeInterval to an AggregationInterval
 * @param timeInterval - The TimeInterval to convert
 * @returns The equivalent AggregationInterval
 */
export function timeIntervalToAggregationInterval(
  timeInterval: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month',
): AggregationInterval {
  return timeInterval as AggregationInterval;
}

/**
 * Converts an AggregationInterval to a TimeInterval
 * @param aggregationInterval - The AggregationInterval to convert
 * @returns The equivalent TimeInterval
 */
export function aggregationIntervalToTimeInterval(
  aggregationInterval: AggregationInterval,
): 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' {
  return aggregationInterval;
}
