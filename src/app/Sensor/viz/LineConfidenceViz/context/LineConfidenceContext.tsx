import React, { useState, useEffect, ReactNode } from 'react';
import { useDetail } from '../../../../../hooks/sensor/useDetail';
import { useList } from '../../../../../hooks/measurements/useList';
import { useListConfidenceValues } from '../../../../../hooks/measurements/useListConfidenceValues';
import {
  AggregationInterval,
  AGGREGATION_INTERVALS,
  LineConfidenceContext,
  SensorData,
  SensorInfo,
  useLineConfidence,
} from './LineConfidenceContextState';

const getSensorKey = (sensorInfo: Omit<SensorInfo, 'key'>) =>
  `${sensorInfo.campaignId}-${sensorInfo.stationId}-${sensorInfo.id}`;

// Custom hook to fetch sensor data
const useSensorData = (
  sensorInfo: SensorInfo,
  effectiveInterval: string,
  aggregationValue: number,
  sampleSize: number,
  minFilterValue?: number,
  maxFilterValue?: number,
  selectedTimeRange?: [number, number] | null,
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
    minFilterValue,
    maxFilterValue,
  );

  const { data: sensorAllPoints } = useList(
    sensorInfo.campaignId,
    sensorInfo.stationId,
    sensorInfo.id,
    100000,
    sampleSize,
    minFilterValue,
    maxFilterValue,
    selectedTimeRange ? new Date(selectedTimeRange[0]) : undefined,
    selectedTimeRange ? new Date(selectedTimeRange[1]) : undefined,
  );

  return {
    info: sensorInfo,
    aggregatedData: sensorAggregatedData,
    aggregatedLoading: sensorAggregatedLoading,
    aggregatedError: sensorAggregatedError,
    allPoints: sensorAllPoints,
  };
};

interface LineConfidenceProviderProps {
  children: ReactNode;
  campaignId: string;
  stationId: string;
  sensorId: string;
}

// Helper component to manage additional sensor data
const AdditionalSensor: React.FC<{
  sensorInfo: SensorInfo;
  effectiveInterval: string;
  aggregationValue: number;
  minFilterValue?: number;
  maxFilterValue?: number;
  selectedTimeRange?: [number, number] | null;
  onDataReady: (sensorData: SensorData) => void;
}> = ({
  sensorInfo,
  effectiveInterval,
  aggregationValue,
  minFilterValue,
  maxFilterValue,
  selectedTimeRange,
  onDataReady,
}) => {
  const { sampleSize } = useLineConfidence();
  const sensorData = useSensorData(
    sensorInfo,
    effectiveInterval,
    aggregationValue,
    sampleSize,
    minFilterValue,
    maxFilterValue,
    selectedTimeRange,
  );

  useEffect(() => {
    onDataReady(sensorData);
  }, [sensorData, onDataReady]);

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
    useState<AggregationInterval>('minute');
  const [hasUserSelectedAggregation, setHasUserSelectedAggregation] =
    useState(false);
  const [additionalSensorInfos, setAdditionalSensorInfos] = useState<
    SensorInfo[]
  >([]);
  const [additionalSensorsData, setAdditionalSensorsData] = useState<
    SensorData[]
  >([]);
  const [maxValueChart, setMaxValueChart] = useState<number | undefined>(
    undefined,
  );
  const [minValueChart, setMinValueChart] = useState<number | undefined>(
    undefined,
  );
  const [renderDataPoints, setRenderDataPoints] = useState<boolean>(false);
  const [addingSensor, setAddingSensor] = useState<boolean>(false);
  const [addSensorModalOpen, setAddSensorModalOpen] = useState<boolean>(false);
  const [sampleSize, setSampleSize] = useState<number>(2000);
  const [sampleSizeLoading, setSampleSizeLoading] = useState<boolean>(false);
  const [minFilterValueInput, setMinFilterValueInput] = useState<string>('');
  const [maxFilterValueInput, setMaxFilterValueInput] = useState<string>('');
  const parsedMinFilterValue =
    minFilterValueInput.trim() === '' ? undefined : Number(minFilterValueInput);
  const parsedMaxFilterValue =
    maxFilterValueInput.trim() === '' ? undefined : Number(maxFilterValueInput);
  const minFilterValue = Number.isFinite(parsedMinFilterValue)
    ? parsedMinFilterValue
    : undefined;
  const maxFilterValue = Number.isFinite(parsedMaxFilterValue)
    ? parsedMaxFilterValue
    : undefined;

  useEffect(() => {
    if (data) {
      if (data.statistics?.percentile99) {
        setMaxValueChart(data.statistics?.maxValue ?? undefined);
      } else {
        setMaxValueChart(undefined);
      }
    }
    if (data) {
      if (data.statistics?.minValue) {
        setMinValueChart(data.statistics?.minValue ?? undefined);
      } else {
        setMinValueChart(undefined);
      }
    }
  }, [data]);

  useEffect(() => {
    setAggregationInterval('minute');
    setHasUserSelectedAggregation(false);
  }, [campaignId, stationId, sensorId]);

  const handleAggregationIntervalChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setHasUserSelectedAggregation(true);
    setAggregationInterval(event.target.value as AggregationInterval);
  };

  const aggregationValue = 1;
  const effectiveInterval = aggregationInterval;

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
    minFilterValue,
    maxFilterValue,
  );
  const { data: allPoints, isLoading: allPointsLoading } = useList(
    campaignId,
    stationId,
    sensorId,
    100000,
    sampleSize,
    minFilterValue,
    maxFilterValue,
    selectedTimeRange ? new Date(selectedTimeRange[0]) : undefined,
    selectedTimeRange ? new Date(selectedTimeRange[1]) : undefined,
  );

  // Update sampleSizeLoading when allPointsLoading changes
  useEffect(() => {
    setSampleSizeLoading(allPointsLoading);
  }, [allPointsLoading]);

  useEffect(() => {
    if (
      hasUserSelectedAggregation ||
      aggregatedLoading ||
      aggregatedError ||
      aggregatedData === null ||
      aggregatedData.length > 0
    ) {
      return;
    }

    const currentIndex = AGGREGATION_INTERVALS.indexOf(aggregationInterval);
    const nextInterval = AGGREGATION_INTERVALS[currentIndex + 1];

    if (nextInterval) {
      setAggregationInterval(nextInterval);
    }
  }, [
    aggregationInterval,
    aggregatedData,
    aggregatedError,
    aggregatedLoading,
    hasUserSelectedAggregation,
  ]);

  // Function to add a new sensor
  const addSensor = (newSensorInfo: Omit<SensorInfo, 'key'>) => {
    const newSensorKey = getSensorKey(newSensorInfo);

    // Check if the sensor is already added
    if (
      (newSensorInfo.id === sensorId &&
        newSensorInfo.campaignId === campaignId &&
        newSensorInfo.stationId === stationId) ||
      additionalSensorInfos.some(
        (sensor) => sensor.key === newSensorKey,
      )
    ) {
      return; // Sensor already exists
    }

    // Set loading state to true when starting to add a new sensor
    setAddingSensor(true);

    // Add the new sensor info to the list
    setAdditionalSensorInfos((prev) => [
      ...prev,
      {
        ...newSensorInfo,
        key: newSensorKey,
      },
    ]);
  };

  // Handle additional sensor data updates
  const handleSensorDataUpdate = (updatedSensorData: SensorData) => {
    setAdditionalSensorsData((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.info.key === updatedSensorData.info.key,
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
        // Turn off loading state after the data is loaded
        setAddingSensor(false);
        return [...prev, updatedSensorData];
      }
    });
  };

  // Clean up removed sensors from the data array
  useEffect(() => {
    setAdditionalSensorsData((prev) =>
      prev.filter((sensorData) =>
        additionalSensorInfos.some((info) => info.key === sensorData.info.key),
      ),
    );
  }, [additionalSensorInfos]);

  // Function to remove a sensor
  const removeSensor = (sensorKeyToRemove: string) => {
    setAdditionalSensorInfos((prev) =>
      prev.filter((sensor) => sensor.key !== sensorKeyToRemove),
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
    addingSensor,
    campaignId,
    stationId,
    sensorId,
    addSensorModalOpen,
    setAddSensorModalOpen,
    maxValueChart,
    setMaxValueChart,
    minValueChart,
    setMinValueChart,
    sampleSize,
    setSampleSize,
    sampleSizeLoading,
    minFilterValueInput,
    setMinFilterValueInput,
    maxFilterValueInput,
    setMaxFilterValueInput,
  };

  return (
    <LineConfidenceContext.Provider value={value}>
      {/* Render a component for each additional sensor to manage its data */}
      {additionalSensorInfos.map((sensorInfo) => (
        <AdditionalSensor
          key={sensorInfo.key}
          sensorInfo={sensorInfo}
          effectiveInterval={effectiveInterval}
          aggregationValue={aggregationValue}
          minFilterValue={minFilterValue}
          maxFilterValue={maxFilterValue}
          selectedTimeRange={selectedTimeRange}
          onDataReady={handleSensorDataUpdate}
        />
      ))}
      {children}
    </LineConfidenceContext.Provider>
  );
};
