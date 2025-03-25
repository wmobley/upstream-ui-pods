import { useState, useEffect } from 'react';
import {
  CampaignsApi,
  Configuration,
  GetCampaignResponse,
} from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

// Add this helper function to parse geometry string
const parseGeometry = (geometry: string): [number, number] | null => {
  try {
    // Assuming format is "POINT(longitude latitude)"
    const coords = geometry
      .replace('POINT (', '')
      .replace(')', '')
      .split(' ')
      .map(Number);
    // Leaflet expects [latitude, longitude]
    return [coords[1], coords[0]];
  } catch (err) {
    console.error('Error parsing geometry:', err);
    return null;
  }
};

export const useDetail = (campaignId: string) => {
  const [campaign, setCampaign] = useState<GetCampaignResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const config = useConfiguration();
  const campaignsApi = new CampaignsApi(config);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response =
          await campaignsApi.getCampaignApiV1CampaignsCampaignIdGet({
            campaignId: parseInt(campaignId),
          });
        setCampaign(response);
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
    campaign,
    isLoading,
    error,
  };
};
