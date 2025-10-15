import { useMutation, useQueryClient } from '@tanstack/react-query';
import useConfiguration from '../api/useConfiguration';

interface DeleteSensorParams {
  campaignId: string;
  stationId: string;
  sensorId: string;
}

export const useDeleteSensor = () => {
  const config = useConfiguration();
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteSensorParams>({
    mutationFn: async ({ campaignId, stationId, sensorId }) => {
      // Direct HTTP call to the new endpoint we implemented:
      // DELETE /api/v1/campaigns/{campaign_id}/stations/{station_id}/sensors/{sensor_id}
      const url = `${config.basePath}/api/v1/campaigns/${campaignId}/stations/${stationId}/sensors/${sensorId}`;

      // Build headers with Tapis headers if present
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        // Include Tapis headers if present
        ...(config.headers as Record<string, string> || {}),
      };

      // Get the actual token by calling the accessToken function if JWT auth
      if (config.accessToken) {
        const token = await config.accessToken();
        if (token) {
          headers['Authorization'] = String(token).startsWith('Bearer') ? String(token) : `Bearer ${String(token)}`;
        }
      }

      console.log('Delete sensor request:', { url, hasAuth: !!headers['Authorization'] || !!config.headers });

      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });

      console.log('Delete sensor response:', { status: response.status, statusText: response.statusText });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Sensor not found');
        }
        if (response.status === 401) {
          throw new Error('Authentication failed - please check your login status');
        }
        throw new Error(`Failed to delete sensor: ${response.statusText}`);
      }
    },
    onSuccess: (_, { campaignId, stationId }) => {
      // Invalidate related data - use broader invalidation to catch all sensor queries
      queryClient.invalidateQueries({ queryKey: ['sensors'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      queryClient.invalidateQueries({ queryKey: ['station', stationId] });
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};