import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useDetail } from '../../../../../hooks/sensor/useDetail';
import { useList } from '../../../../../hooks/measurements/useList';
import { useListConfidenceValues } from '../../../../../hooks/measurements/useListConfidenceValues';
import { selectAggregationInterval } from '../../../../../utils/aggregationProcessing';
import {
  GetSensorResponse,
  AggregatedMeasurement,
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

interface LineConfidenceContextProps {
  data: GetSensorResponse | null;
  isLoading: boolean;
  error: Error | null;
  selectedTimeRange: [number, number] | null;
  setSelectedTimeRange: React.Dispatch<
    React.SetStateAction<[number, number] | null>
  >;
  aggregationInterval: AggregationInterval | null;
  setAggregationInterval: React.Dispatch<
    React.SetStateAction<AggregationInterval | null>
  >;
  handleAggregationIntervalChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  aggregatedData: AggregatedMeasurement[] | null;
  aggregatedLoading: boolean;
  aggregatedError: Error | null;
  allPoints: ListMeasurementsResponsePagination | null;
}

const LineConfidenceContext = createContext<
  LineConfidenceContextProps | undefined
>(undefined);

interface LineConfidenceProviderProps {
  children: ReactNode;
  campaignId: string;
  stationId: string;
  sensorId: string;
}

export const LineConfidenceProvider: React.FC<LineConfidenceProviderProps> = ({
  children,
  campaignId,
  stationId,
  sensorId,
}) => {
  const { data, isLoading, error } = useDetail(campaignId, stationId, sensorId);
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    [number, number] | null
  >(null);
  const [aggregationInterval, setAggregationInterval] =
    useState<AggregationInterval | null>(null);

  useEffect(() => {
    if (data) {
      if (data.firstMeasurementTime && data.lastMeasurementTime) {
        setAggregationInterval(
          selectAggregationInterval(
            data.firstMeasurementTime,
            data.lastMeasurementTime,
          ),
        );
      } else {
        throw new Error('No measurement time range found');
      }
    }
  }, [data]);

  const handleAggregationIntervalChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setAggregationInterval(event.target.value as AggregationInterval);
  };

  const aggregationValue = aggregationInterval === 'second' ? 10 : 1;

  const effectiveInterval = aggregationInterval || 'minute';

  const {
    data: aggregatedData,
    isLoading: aggregatedLoading,
    error: aggregatedError,
  } = useListConfidenceValues(
    campaignId,
    stationId,
    sensorId,
    effectiveInterval,
    aggregationValue,
  );

  const { data: allPoints } = useList(campaignId, stationId, sensorId);

  const value = {
    data,
    isLoading,
    error,
    selectedTimeRange,
    setSelectedTimeRange,
    aggregationInterval,
    setAggregationInterval,
    handleAggregationIntervalChange,
    aggregatedData,
    aggregatedLoading,
    aggregatedError,
    allPoints,
  };

  return (
    <LineConfidenceContext.Provider value={value}>
      {children}
    </LineConfidenceContext.Provider>
  );
};

export const useLineConfidence = (): LineConfidenceContextProps => {
  const context = useContext(LineConfidenceContext);
  if (context === undefined) {
    throw new Error(
      'useLineConfidence must be used within a LineConfidenceProvider',
    );
  }
  return context;
};
