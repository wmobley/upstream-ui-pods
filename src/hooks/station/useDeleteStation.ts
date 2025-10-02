import { useMutation, useQueryClient } from '@tanstack/react-query';
import useConfiguration from '../api/useConfiguration';

interface DeleteStationParams {
  campaignId: string;
  stationId: string;
}

export const useDeleteStation = () => {
  const config = useConfiguration();
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteStationParams>({
    mutationFn: async ({ campaignId, stationId }) => {
      // Direct HTTP call to delete individual station:
      // DELETE /api/v1/campaigns/{campaign_id}/stations/{station_id}
      const url = `${config.basePath}/api/v1/campaigns/${campaignId}/stations/${stationId}`;

      // Get the actual token by calling the accessToken function
      const token = config.accessToken ? await config.accessToken() : '';

      console.log('Delete station request:', { url, token: token ? 'TOKEN_PRESENT' : 'NO_TOKEN' });

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete station response:', { status: response.status, statusText: response.statusText });

      if (!response.ok) {
        // Get response body for more detailed error information
        let errorMessage = response.statusText;
        try {
          const errorBody = await response.text();
          console.log('Delete station error body:', errorBody);
          if (errorBody) {
            errorMessage = errorBody;
          }
        } catch (e) {
          console.log('Could not parse error response body');
        }

        if (response.status === 404) {
          throw new Error('API endpoint not found - the individual station delete endpoint may not be implemented yet');
        }
        if (response.status === 401) {
          throw new Error('Authentication failed - please check your login status');
        }
        if (response.status === 405) {
          throw new Error('Method not allowed - the individual station delete endpoint may not be implemented yet');
        }
        throw new Error(`Failed to delete station (${response.status}): ${errorMessage}`);
      }
    },
    onSuccess: (_, { campaignId }) => {
      // Invalidate related data - broader invalidation to catch all relevant queries
      queryClient.invalidateQueries({ queryKey: ['stations'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};