import { useState, useEffect } from 'react';
import {
  Configuration,
  StationsApi,
  GetStationResponse,
} from '@upstream/upstream-api';

const basePath = 'http://localhost:8000';
const accessToken = 'Bearer ' + localStorage.getItem('access_token');
const config = new Configuration({ basePath, accessToken });
const stationsApi = new StationsApi(config);

export const useDetail = (campaignId: string, stationId: string) => {
  const [station, setStation] = useState<GetStationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
