import { useState, useEffect } from 'react';
import {
  CampaignsApi,
  ListCampaignsApiV1CampaignsGetRequest,
  ListCampaignsResponseItem,
} from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

interface UseListReturn {
  data: ListCampaignsResponseItem[];
  isLoading: boolean;
  error: Error | null;
}

interface UseListProps {
  filters: ListCampaignsApiV1CampaignsGetRequest;
}

export const useList = ({ filters }: UseListProps): UseListReturn => {
  const config = useConfiguration();
  const campaignsApi = new CampaignsApi(config);
  const [data, setData] = useState<ListCampaignsResponseItem[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response =
          await campaignsApi.listCampaignsApiV1CampaignsGet(filters);
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
  }, [filters]);

  return { data, isLoading, error };
};
