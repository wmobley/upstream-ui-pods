import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  DataPoint,
  ProcessedDataPoint,
  TimeAggregation,
  lttb,
  aggregateByTime,
  calculateThreshold,
  getAppropriateResolution,
} from '../../utils/dataProcessing';
import { MeasurementsApi } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

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
  const config = useConfiguration();
  const measurementsApi = new MeasurementsApi(config);

  const {
    data: rawData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      'measurements',
      campaignId,
      stationId,
      sensorId,
      startTime,
      endTime,
    ],
    queryFn: async () => {
      const response =
        await measurementsApi.getSensorMeasurementsApiV1CampaignsCampaignIdStationsStationIdSensorsSensorIdMeasurementsGet(
          {
            campaignId: parseInt(campaignId),
            stationId: parseInt(stationId),
            sensorId: parseInt(sensorId),
            minMeasurementValue: 0,
            limit: 500000,
            startDate: startTime,
            endDate: endTime,
          },
        );
      return response;
    },
  });

  const processedData = useMemo(() => {
    if (!rawData?.items || rawData.items.length === 0) {
      return {
        downsampledData: [],
        aggregatedData: [],
        data: [],
      };
    }

    // Convert API data to DataPoint format
    const timeSeriesData: DataPoint[] = rawData.items
      .filter((item) => item.value != null) // Filter out null values
      .map((item) => ({
        timestamp: new Date(item.collectiontime),
        value: item.value as number, // We know it's not null from the filter
        geometry: item.geometry as GeoJSON.Point,
      }));

    // Calculate appropriate threshold based on container width
    const threshold = calculateThreshold(containerWidth);

    // Determine appropriate time interval for aggregation
    const interval = getAppropriateResolution(
      startTime || timeSeriesData[0].timestamp,
      endTime || timeSeriesData[timeSeriesData.length - 1].timestamp,
    );

    // Process data using both methods
    const downsampledData = lttb(timeSeriesData, threshold);
    const aggregatedData = aggregateByTime(timeSeriesData, interval);

    return {
      downsampledData,
      aggregatedData,
      data: timeSeriesData,
    };
  }, [rawData, containerWidth, startTime, endTime]);

  return {
    ...processedData,
    isLoading,
    error: error as Error | null,
  };
}
