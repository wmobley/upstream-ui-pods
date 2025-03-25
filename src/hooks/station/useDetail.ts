import { useState, useEffect } from 'react';
import { StationsApi, GetStationResponse } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

export const useDetail = (campaignId: string, stationId: string) => {
  const [station, setStation] = useState<GetStationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const config = useConfiguration();
  const stationsApi = new StationsApi(config);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response =
          await stationsApi.getStationApiV1CampaignsCampaignIdStationsStationIdGet(
            {
              campaignId: parseInt(campaignId),
              stationId: parseInt(stationId),
            },
          );
        setStation(response);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to load sensor data'),
        );
        console.error('Error loading sensor data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array means this effect runs once on mount

  return {
    station,
    isLoading,
    error,
  };
};
