import { useState, useEffect } from 'react';
import useConfiguration, { useApiReadiness } from '../api/useConfiguration';

interface PermissionCheckResult {
  canDelete: boolean;
  isLoading: boolean;
}

/**
 * Hook to check if the current user has permission to delete data in a campaign.
 * Uses the dedicated permissions API endpoint.
 */
export const useCanDeleteInCampaign = (campaignId: string): PermissionCheckResult => {
  const [canDelete, setCanDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const config = useConfiguration();
  const { apiReady } = useApiReadiness();

  useEffect(() => {
    let cancelled = false;

    const checkPermissions = async () => {
      try {
        if (!apiReady || !config.basePath) {
          setCanDelete(false);
          return;
        }

        // Use the dedicated permissions endpoint
        const token = config.accessToken ? await config.accessToken() : '';
        if (!token) {
          setCanDelete(false);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${config.basePath}/api/v1/campaigns/${campaignId}/permissions`, {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const permissionsData = await response.json();
          if (!cancelled) {
            setCanDelete(permissionsData.permissions?.can_delete || false);
          }
        } else {
          if (!cancelled) setCanDelete(false);
        }
      } catch (error) {
        console.error('Error checking campaign permissions:', error);
        if (!cancelled) setCanDelete(false);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    if (campaignId && apiReady) {
      setIsLoading(true);
      checkPermissions();
    } else {
      setCanDelete(false);
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [campaignId, config, apiReady]);

  return { canDelete, isLoading };
};

/**
 * In development mode, all users have permissions.
 * In production, permissions are based on project allocations.
 */
export const useIsOwner = (campaignId: string): PermissionCheckResult => {
  // For now, we'll use the same logic as campaign permissions
  // In the future, this could be enhanced to check specific ownership
  return useCanDeleteInCampaign(campaignId);
};
