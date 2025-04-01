import { useMemo } from 'react';
import { useList } from './useList';
import {
  DataPoint,
  ProcessedDataPoint,
  TimeAggregation,
  lttb,
  aggregateByTime,
  calculateThreshold,
  getAppropriateResolution,
} from '../../utils/dataProcessing';

export interface ProcessedMeasurementsResult {
  downsampledData: ProcessedDataPoint[];
  aggregatedData: TimeAggregation[];
  data: DataPoint[];
  isLoading: boolean;
  error: Error | null;
}

export function useProcessedMeasurements(
  campaignId: string,
  stationId: string,
  sensorId: string,
  containerWidth: number,
  startTime?: Date,
  endTime?: Date,
): ProcessedMeasurementsResult {
  const { data, isLoading, error } = useList(campaignId, stationId, sensorId);

  const processedData = useMemo(() => {
    if (!data?.items || data.items.length === 0) {
      return {
        downsampledData: [],
        aggregatedData: [],
      };
    }

    // Convert API data to DataPoint format
    const timeSeriesData: DataPoint[] = data.items
      .filter((item) => item.value != null) // Filter out null values
      .map((item) => ({
        timestamp: new Date(item.collectiontime),
        value: item.value as number, // We know it's not null from the filter
        geometry: item.geometry as GeoJSON.Point,
      }));

    // Filter by time range if provided
    const filteredData = timeSeriesData.filter((point) => {
      if (startTime && point.timestamp < startTime) return false;
      if (endTime && point.timestamp > endTime) return false;
      return true;
    });

    // Calculate appropriate threshold based on container width
    const threshold = calculateThreshold(containerWidth);

    // Determine appropriate time interval for aggregation
    const interval = getAppropriateResolution(
      startTime || filteredData[0].timestamp,
      endTime || filteredData[filteredData.length - 1].timestamp,
      containerWidth,
    );

    // Process data using both methods
    const downsampledData = lttb(filteredData, threshold);
    const aggregatedData = aggregateByTime(filteredData, interval);

    return {
      downsampledData,
      aggregatedData,
    };
  }, [data, containerWidth, startTime, endTime]);

  return {
    ...processedData,
    data:
      data?.items.map((item) => ({
        timestamp: new Date(item.collectiontime),
        value: item.value as number,
        geometry: item.geometry as GeoJSON.Point,
      })) || [],
    isLoading,
    error,
  };
}
