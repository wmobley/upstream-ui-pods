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

interface SensorInfo {
  id: string;
  campaignId: string;
  stationId: string;
}

interface SensorData {
  info: SensorInfo;
  aggregatedData: AggregatedMeasurement[] | null;
  aggregatedLoading: boolean;
  aggregatedError: Error | null;
  allPoints: ListMeasurementsResponsePagination | null;
}

// Custom hook to fetch sensor data
const useSensorData = (
  sensorInfo: SensorInfo,
  effectiveInterval: string,
  aggregationValue: number,
): SensorData => {
  const {
    data: sensorAggregatedData,
    isLoading: sensorAggregatedLoading,
    error: sensorAggregatedError,
  } = useListConfidenceValues(
    sensorInfo.campaignId,
    sensorInfo.stationId,
    sensorInfo.id,
    effectiveInterval,
    aggregationValue,
  );

  const { data: sensorAllPoints } = useList(
    sensorInfo.campaignId,
    sensorInfo.stationId,
    sensorInfo.id,
  );

  return {
    info: sensorInfo,
    aggregatedData: sensorAggregatedData,
    aggregatedLoading: sensorAggregatedLoading,
    aggregatedError: sensorAggregatedError,
    allPoints: sensorAllPoints,
  };
};

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
  additionalSensors: SensorData[];
  addSensor: (campaignId: string, stationId: string, sensorId: string) => void;
  removeSensor: (sensorId: string) => void;
  renderDataPoints: boolean;
  setRenderDataPoints: React.Dispatch<React.SetStateAction<boolean>>;
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

// Helper component to manage additional sensor data
const AdditionalSensor = ({
  sensorInfo,
  effectiveInterval,
  aggregationValue,
  onDataReady,
}: {
  sensorInfo: SensorInfo;
  effectiveInterval: string;
  aggregationValue: number;
  onDataReady: (data: SensorData) => void;
}) => {
  const sensorData = useSensorData(
    sensorInfo,
    effectiveInterval,
    aggregationValue,
  );

  useEffect(() => {
    // Only call onDataReady when we have actual data updates
    if (sensorData.aggregatedData !== null || sensorData.allPoints !== null) {
      onDataReady(sensorData);
    }
  }, [
    sensorData.aggregatedData,
    sensorData.allPoints,
    sensorData.aggregatedLoading,
    sensorData.aggregatedError,
    sensorInfo.id,
    onDataReady,
  ]);

  return null;
};

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
  const [additionalSensorInfos, setAdditionalSensorInfos] = useState<
    SensorInfo[]
  >([]);
  const [additionalSensorsData, setAdditionalSensorsData] = useState<
    SensorData[]
  >([]);
  const [renderDataPoints, setRenderDataPoints] = useState<boolean>(false);

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

  // Handle additional sensor data updates
  const handleSensorDataUpdate = (updatedSensorData: SensorData) => {
    setAdditionalSensorsData((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.info.id === updatedSensorData.info.id,
      );

      // Don't update if the data hasn't actually changed
      if (existingIndex >= 0) {
        const existingData = prev[existingIndex];

        // Check if the data is actually different before updating
        if (
          existingData.aggregatedData === updatedSensorData.aggregatedData &&
          existingData.allPoints === updatedSensorData.allPoints &&
          existingData.aggregatedLoading ===
            updatedSensorData.aggregatedLoading &&
          existingData.aggregatedError === updatedSensorData.aggregatedError
        ) {
          return prev; // No change needed
        }

        // Update existing sensor data
        const newData = [...prev];
        newData[existingIndex] = updatedSensorData;
        return newData;
      } else {
        // Add new sensor data
        return [...prev, updatedSensorData];
      }
    });
  };

  // Clean up removed sensors from the data array
  useEffect(() => {
    if (additionalSensorsData.length > 0) {
      setAdditionalSensorsData((prev) =>
        prev.filter((sensorData) =>
          additionalSensorInfos.some((info) => info.id === sensorData.info.id),
        ),
      );
    }
  }, [additionalSensorInfos]);

  // Function to add a new sensor
  const addSensor = (
    newCampaignId: string,
    newStationId: string,
    newSensorId: string,
  ) => {
    // Check if the sensor is already added
    if (
      (newSensorId === sensorId &&
        newCampaignId === campaignId &&
        newStationId === stationId) ||
      additionalSensorInfos.some(
        (sensor) =>
          sensor.id === newSensorId &&
          sensor.campaignId === newCampaignId &&
          sensor.stationId === newStationId,
      )
    ) {
      return; // Sensor already exists
    }

    // Add the new sensor info to the list
    setAdditionalSensorInfos((prev) => [
      ...prev,
      {
        id: newSensorId,
        campaignId: newCampaignId,
        stationId: newStationId,
      },
    ]);
  };

  // Function to remove a sensor
  const removeSensor = (sensorIdToRemove: string) => {
    setAdditionalSensorInfos((prev) =>
      prev.filter((sensor) => sensor.id !== sensorIdToRemove),
    );
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
    aggregatedData,
    aggregatedLoading,
    aggregatedError,
    allPoints,
    additionalSensors: additionalSensorsData,
    addSensor,
    removeSensor,
    renderDataPoints,
    setRenderDataPoints,
  };

  return (
    <LineConfidenceContext.Provider value={value}>
      {/* Render a component for each additional sensor to manage its data */}
      {additionalSensorInfos.map((sensorInfo) => (
        <AdditionalSensor
          key={sensorInfo.id}
          sensorInfo={sensorInfo}
          effectiveInterval={effectiveInterval}
          aggregationValue={aggregationValue}
          onDataReady={handleSensorDataUpdate}
        />
      ))}
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
