import { createContext, useContext } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import type {
  AggregatedMeasurement,
  GetSensorResponse,
  ListMeasurementsResponsePagination,
} from '@upstream/upstream-api';

export type AggregationInterval = 'minute' | 'hour' | 'day' | 'week' | 'month';

export const AGGREGATION_INTERVALS: AggregationInterval[] = [
  'minute',
  'hour',
  'day',
  'week',
  'month',
];

export interface SensorInfo {
  key: string;
  id: string;
  campaignId: string;
  stationId: string;
  label?: string;
  stationName?: string;
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
  selectedTimeRange: [number, number] | null;
  setSelectedTimeRange: Dispatch<SetStateAction<[number, number] | null>>;
  aggregationInterval: AggregationInterval;
  setAggregationInterval: Dispatch<SetStateAction<AggregationInterval>>;
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
