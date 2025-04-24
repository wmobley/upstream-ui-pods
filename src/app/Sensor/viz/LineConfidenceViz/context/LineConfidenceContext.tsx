import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useDetail } from '../../../../../hooks/sensor/useDetail';
import { selectAggregationInterval } from '../../../../../utils/aggregationProcessing';
import { GetSensorResponse } from '@upstream/upstream-api';

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

  const value = {
    data,
    isLoading,
    error,
    selectedTimeRange,
    setSelectedTimeRange,
    aggregationInterval,
    setAggregationInterval,
    handleAggregationIntervalChange,
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
