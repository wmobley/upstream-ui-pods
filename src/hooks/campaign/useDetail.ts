import { useState, useEffect } from 'react';
import { CampaignsApi, GetCampaignResponse } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

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
