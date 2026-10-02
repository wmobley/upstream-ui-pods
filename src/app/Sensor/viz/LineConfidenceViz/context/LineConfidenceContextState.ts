import { createContext, useContext } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type {
  AggregatedMeasurement,
  GetSensorResponse,
  ListMeasurementsResponsePagination,
} from '@upstream/upstream-api';

export type AggregationInterval =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month';

export const AGGREGATION_INTERVALS: AggregationInterval[] = [
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
];

export interface AggregationOption {
  /** Interval sent to the API (e.g., 'second'). */
  interval: AggregationInterval;
  /** Window size for the interval (e.g., 5 for 5-second buckets; 1 for whole units). */
  value: number;
  /** Label shown in the Aggregation Interval dropdown. */
  label: string;
}

/** Options for the Aggregation Interval dropdown, including sub-minute windows. */
export const AGGREGATION_OPTIONS: AggregationOption[] = [
  { interval: 'second', value: 1, label: '1s' },
  { interval: 'second', value: 2, label: '2s' },
  { interval: 'second', value: 5, label: '5s' },
  { interval: 'second', value: 10, label: '10s' },
  { interval: 'minute', value: 1, label: '1m' },
  { interval: 'hour', value: 1, label: '1h' },
  { interval: 'day', value: 1, label: '1d' },
  { interval: 'week', value: 1, label: '1w' },
  { interval: 'month', value: 1, label: '1mo' },
];

/** Encodes an interval + window size as the select option value. */
export const aggregationOptionValue = (option: AggregationOption): string =>
  `${option.interval}:${option.value}`;

/** Encodes the current selection as the select option value. */
export const aggregationSelectionValue = (
  interval: AggregationInterval,
  value: number,
): string => `${interval}:${value}`;

/** Parses a select option value back into an AggregationOption, if known. */
export const parseAggregationOptionValue = (
  value: string,
): AggregationOption | undefined => {
  const [interval, valuePart] = value.split(':');
  return AGGREGATION_OPTIONS.find(
    (option) =>
      option.interval === interval && String(option.value) === valuePart,
  );
};

export type TimeRangePreset = 'all' | 'day' | 'week' | 'month' | 'year' | 'custom';

export interface TimeRangePresetOption {
  value: TimeRangePreset;
  label: string;
}

export const TIME_RANGE_OPTIONS: TimeRangePresetOption[] = [
  { value: 'all', label: 'All time' },
  { value: 'day', label: 'Past day' },
  { value: 'week', label: 'Past week' },
  { value: 'month', label: 'Past month' },
  { value: 'year', label: 'Past year' },
  { value: 'custom', label: 'Custom range' },
];

const TIME_RANGE_DURATIONS_MS: Record<Exclude<TimeRangePreset, 'all' | 'custom'>, number> = {
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  year: 365 * 24 * 60 * 60 * 1000,
};

/** Resolve a relative preset against the sensor's latest recorded measurement. */
export const getTimeRangeForPreset = (
  preset: Exclude<TimeRangePreset, 'all' | 'custom'>,
  endDate: Date | null | undefined,
): [number, number] | null => {
  const endTime = endDate?.getTime();
  if (endTime === undefined || !Number.isFinite(endTime)) return null;

  return [endTime - TIME_RANGE_DURATIONS_MS[preset], endTime];
};

/** Parse a browser-local datetime-local value into an absolute Date. */
export const parseDateTimeLocal = (value: string): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
};

/** Format an absolute Date for a browser-local datetime-local input. */
export const formatDateTimeLocal = (date: Date): string => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    + `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const validateCustomTimeRange = (
  startInput: string,
  endInput: string,
): { range: [number, number] | null; error: string | null } => {
  if (!startInput || !endInput) {
    return { range: null, error: 'Enter both a start and end time.' };
  }

  const startDate = parseDateTimeLocal(startInput);
  const endDate = parseDateTimeLocal(endInput);
  if (!startDate || !endDate) {
    return { range: null, error: 'Enter valid start and end times.' };
  }

  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  if (startTime >= endTime) {
    return { range: null, error: 'Start time must be before end time.' };
  }

  return { range: [startTime, endTime], error: null };
};

export interface SensorInfo {
  key: string;
  id: string;
  campaignId: string;
  stationId: string;
  label?: string;
  stationName?: string;
  /** Sensor's unit of measurement, used to decide whether it needs its own y-axis when compared. */
  units?: string;
}

export interface SensorData {
  info: SensorInfo;
  aggregatedData: AggregatedMeasurement[] | null;
  aggregatedLoading: boolean;
  aggregatedError: Error | null;
  allPoints: ListMeasurementsResponsePagination | null;
}

export interface LineConfidenceContextProps {
  data: GetSensorResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  /** IANA timezone of the primary station; chart times are displayed in it. */
  stationTimezone: string;
  /** Display name of the primary station, used in comparison chart labels. */
  stationName: string;
  selectedTimeRange: [number, number] | null;
  setSelectedTimeRange: Dispatch<SetStateAction<[number, number] | null>>;
  timeRangePreset: TimeRangePreset;
  customStartDateInput: string;
  customEndDateInput: string;
  timeRangeError: string | null;
  handleTimeRangePresetChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCustomStartDateChange: (value: string) => void;
  handleCustomEndDateChange: (value: string) => void;
  handleCustomTimeRangeApply: () => void;
  handleChartBrush: (domain: [number, number]) => void;
  aggregationInterval: AggregationInterval;
  setAggregationInterval: Dispatch<SetStateAction<AggregationInterval>>;
  /** Window size paired with aggregationInterval (e.g., 5 for 5-second buckets). */
  aggregationValue: number;
  setAggregationValue: Dispatch<SetStateAction<number>>;
  handleAggregationIntervalChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  aggregatedData: AggregatedMeasurement[] | null;
  aggregatedLoading: boolean;
  aggregatedError: Error | null;
  allPoints: ListMeasurementsResponsePagination | null;
  additionalSensors: SensorData[];
  addSensor: (sensorInfo: Omit<SensorInfo, 'key'>) => void;
  removeSensor: (sensorKey: string) => void;
  renderDataPoints: boolean;
  setRenderDataPoints: Dispatch<SetStateAction<boolean>>;
  addingSensor: boolean;
  campaignId: string;
  stationId: string;
  sensorId: string;
  addSensorModalOpen: boolean;
  setAddSensorModalOpen: Dispatch<SetStateAction<boolean>>;
  maxValueChart: number | undefined;
  setMaxValueChart: Dispatch<SetStateAction<number | undefined>>;
  minValueChart: number | undefined;
  setMinValueChart: Dispatch<SetStateAction<number | undefined>>;
  sampleSize: number;
  setSampleSize: Dispatch<SetStateAction<number>>;
  sampleSizeLoading: boolean;
  minFilterValueInput: string;
  setMinFilterValueInput: Dispatch<SetStateAction<string>>;
  maxFilterValueInput: string;
  setMaxFilterValueInput: Dispatch<SetStateAction<string>>;
}

export const LineConfidenceContext = createContext<LineConfidenceContextProps | undefined>(undefined);

export const useLineConfidence = (): LineConfidenceContextProps => {
  const context = useContext(LineConfidenceContext);
  if (context === undefined) {
    throw new Error('useLineConfidence must be used within a LineConfidenceProvider');
  }
  return context;
};
