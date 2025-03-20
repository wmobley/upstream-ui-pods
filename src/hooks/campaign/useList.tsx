import { useState, useEffect } from 'react';
import {
  CampaignsApi,
  Configuration,
  ListCampaignsResponseItem,
} from '@upstream/upstream-api';

interface UseListReturn {
  data: ListCampaignsResponseItem[];
  isLoading: boolean;
  error: Error | null;
}

const basePath = 'http://localhost:8000';
const accessToken = 'Bearer ' + localStorage.getItem('access_token');
const config = new Configuration({ basePath, accessToken });
const campaignsApi = new CampaignsApi(config);
export const useList = (): UseListReturn => {
  const [data, setData] = useState<ListCampaignsResponseItem[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await campaignsApi.listCampaignsApiV1CampaignsGet();
        setData(response.items);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Unknown error occurred'),
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return { data, isLoading, error };
};
