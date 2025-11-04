import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StationsApi, Configuration } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

export const useDelete = (campaignId: string) => {
  const config = useConfiguration();

  // Forward Tapis token from sessionStorage when present so mass-delete
  // requests can include X-TAPIS-TOKEN for CKAN operations on the backend.
  const tapisToken = typeof window !== 'undefined' ? sessionStorage.getItem('Tapis-Access-Token') : null;
  let apiConfig = config;
  if (tapisToken) {
    const headers: Record<string, string> = {
      ...(config.headers as Record<string, string> | undefined),
      'X-TAPIS-TOKEN': tapisToken,
    };
    delete headers['Authorization'];
    delete headers['authorization'];
    apiConfig = new Configuration({ basePath: config.basePath, headers, accessToken: config.accessToken });
  }

  const stationsApi = new StationsApi(apiConfig);
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await stationsApi.deleteSensorApiV1CampaignsCampaignIdStationsDelete({
        campaignId: parseInt(campaignId),
      });
    },
    onSuccess: () => {
      // Invalidate campaign data to refresh stations list
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};