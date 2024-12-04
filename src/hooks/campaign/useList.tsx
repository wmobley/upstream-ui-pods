import { useState, useEffect } from 'react';
import { Campaign } from '../../app/common/types';

interface UseListReturn {
  data: Campaign[];
  isLoading: boolean;
  error: Error | null;
}

export const useList = (): UseListReturn => {
  const [data, setData] = useState<Campaign[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/campaigns.json');
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }
        const data = await response.json();
        setData(data);
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
