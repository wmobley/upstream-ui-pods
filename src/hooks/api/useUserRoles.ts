import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Configuration } from '@upstream/upstream-api';
import useConfiguration from './useConfiguration';

export type UserRoleValue = 'READ' | 'USER' | 'ADMIN' | 'APPROVEDADMIN';

export interface UserRoleRecord {
  username: string;
  role: UserRoleValue;
}

interface UseUserRolesOptions {
  enabled?: boolean;
}

const ROLE_ENDPOINT = '/api/v1/user-roles';

const buildHeaders = async (config: Configuration): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (config.headers) {
    Object.entries(config.headers as Record<string, string>).forEach(([key, value]) => {
      if (value) {
        headers[key] = value;
      }
    });
  }

  if (config.accessToken && !headers.Authorization && !headers.authorization) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = await (config.accessToken as any)();
    if (token) {
      headers.Authorization = token;
    }
  }

  return headers;
};

const handleError = async (response: Response) => {
  const text = await response.text();
  const message = text || `Request failed with status ${response.status}`;
  throw new Error(message);
};

export const useUserRoles = (options?: UseUserRolesOptions) => {
  const config = useConfiguration();
  return useQuery<UserRoleRecord[], Error>({
    queryKey: ['user-roles'],
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const headers = await buildHeaders(config);
      const response = await fetch(`${config.basePath}${ROLE_ENDPOINT}`, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        await handleError(response);
      }
      return response.json() as Promise<UserRoleRecord[]>;
    },
  });
};

export const useSaveUserRole = () => {
  const config = useConfiguration();
  const queryClient = useQueryClient();
  return useMutation<UserRoleRecord, Error, { username: string; role: UserRoleValue }>({
    mutationFn: async ({ username, role }) => {
      const headers = await buildHeaders(config);
      const response = await fetch(
        `${config.basePath}${ROLE_ENDPOINT}/${encodeURIComponent(username)}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({ role }),
        },
      );
      if (!response.ok) {
        await handleError(response);
      }
      return response.json() as Promise<UserRoleRecord>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
    },
  });
};
