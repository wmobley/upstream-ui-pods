import React, { useState, useEffect, ReactNode } from 'react';
import { useDetail } from '../../../../../hooks/sensor/useDetail';
import { useList } from '../../../../../hooks/measurements/useList';
import { useListConfidenceValues } from '../../../../../hooks/measurements/useListConfidenceValues';
import {
  AggregationInterval,
  LineConfidenceContext,
  SensorData,
  SensorInfo,
  useLineConfidence,
} from './LineConfidenceContextState';

// Custom hook to fetch sensor data
const useSensorData = (
  sensorInfo: SensorInfo,
  effectiveInterval: string,
  aggregationValue: number,
  sampleSize: number,
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
    100000,
    sampleSize,
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
  onDataReady: (sensorData: SensorData) => void;
}> = ({ sensorInfo, effectiveInterval, aggregationValue, onDataReady }) => {
  const { sampleSize } = useLineConfidence();
  const sensorData = useSensorData(
    sensorInfo,
    effectiveInterval,
    aggregationValue,
    sampleSize,
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
    useState<AggregationInterval | null>(null);
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

  useEffect(() => {
    if (data) {
      if (aggregationInterval === null) {
        setAggregationInterval('minute');
      }
    }
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
  }, [data, aggregationInterval]);

  const handleAggregationIntervalChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setAggregationInterval(event.target.value as AggregationInterval);
  };

  const aggregationValue = 1;

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
  const { data: allPoints, isLoading: allPointsLoading } = useList(
    campaignId,
    stationId,
    sensorId,
    100000,
    sampleSize,
  );

  // Update sampleSizeLoading when allPointsLoading changes
  useEffect(() => {
    setSampleSizeLoading(allPointsLoading);
  }, [allPointsLoading]);

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

    // Set loading state to true when starting to add a new sensor
    setAddingSensor(true);

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
        additionalSensorInfos.some((info) => info.id === sensorData.info.id),
      ),
    );
  }, [additionalSensorInfos]);

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
