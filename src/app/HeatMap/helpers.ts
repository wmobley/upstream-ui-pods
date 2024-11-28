import { Interval, MeasurementPoint } from '../../hooks/campaign/useDetail';
import { heatMapColorRanges } from '../constants/colors';

export const getIntervalByValue = (value: number, intervals: Interval[]) => {
  return intervals.find(
    (interval) => value >= interval.minValue && value <= interval.maxValue,
  );
};

export const getIntervalIndexByPercentile = (
  percentile: number,
  intervals: Interval[],
): number => {
  return intervals.findIndex(
    (interval) =>
      percentile >= interval.minPercentile &&
      percentile <= interval.maxPercentile,
  );
};

export const getColorByValue = (value: number, intervals: Interval[]) => {
  const interval = getIntervalByValue(value, intervals);
  return interval
    ? getColorByPercentile(interval.minPercentile, intervals)
    : 'blue';
};

export const getColorByPercentile = (
  percentile: number,
  intervals: Interval[],
) => {
  const index = getIntervalIndexByPercentile(percentile, intervals);
  return heatMapColorRanges[index].color;
};

export const getFilteredMeasurements = (
  measurements: MeasurementPoint[],
  selectedInterval: Interval | null,
) => {
  // Filter measurements based on selected interval
  const filteredMeasurements = selectedInterval
    ? measurements.filter(
        (m) =>
          m.measurementvalue >= selectedInterval.minValue &&
          m.measurementvalue <= selectedInterval.maxValue,
      )
    : measurements;
  return filteredMeasurements;
};
