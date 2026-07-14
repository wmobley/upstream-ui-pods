import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from './AuthContextState';

export type Permission = 'ADMIN' | 'USER' | 'READ';

export interface ProjectInstance {
  stackId: string;
  displayName: string;
  apiUrl: string;
  permission: Permission;
}

interface InstanceContextType {
  instances: ProjectInstance[];
  selectedInstance: ProjectInstance | null;
  setSelectedInstance: (instance: ProjectInstance) => void;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
  discoveryEnabled: boolean;
}

const InstanceContext = createContext<InstanceContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Tapis Pods API types
// ---------------------------------------------------------------------------
interface TapisPodNetworking {
  url?: string;
  protocol?: string;
  port?: number;
}

interface TapisPod {
  pod_id: string;
  image?: string;
  description?: string;
  status?: string;
  tags?: string[];
  networking?: Record<string, TapisPodNetworking>;
}

const UPSTREAM_API_IMAGE = 'upstream-docker-pods';
const SESSION_KEY = 'upstream_selected_instance';

class TapisAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TapisAuthError';
  }
}

function getPodsBaseUrl(): string {
  return (
    window.__UPSTREAM_CONFIG__?.VITE_TAPIS_PODS_BASE_URL?.trim() ||
    import.meta.env.VITE_TAPIS_PODS_BASE_URL?.trim() ||
    'https://portals.tapis.io'
  );
}

/** Derives the pod hostname suffix from the Tapis base URL.
 *  https://portals.tapis.io → pods.portals.tapis.io
 *  https://portals.develop.tapis.io → pods.portals.develop.tapis.io
 */
function getPodsDomain(baseUrl: string): string {
  const hostname = baseUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  return `pods.${hostname}`;
}

async function fetchInstances(tapisToken: string): Promise<ProjectInstance[]> {
  const baseUrl = getPodsBaseUrl();

  // Use the same-origin nginx proxy (/tapis-proxy/) to avoid CORS when calling
  // Tapis from a pod subdomain. Falls back to the direct URL in local dev.
  const isDeployedPod = typeof window !== 'undefined' &&
    window.location.hostname.endsWith('.tapis.io');
  const podsUrl = isDeployedPod
    ? `/tapis-proxy/v3/pods`
    : `${baseUrl}/v3/pods`;

  const resp = await fetch(podsUrl, {
    headers: {
      'X-Tapis-Token': tapisToken,
      Accept: 'application/json',
    },
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    if (resp.status === 400 || resp.status === 401) {
      throw new TapisAuthError(`Tapis Pods API ${resp.status}: ${body}`);
    }
    throw new Error(`Tapis Pods API ${resp.status}: ${body}`);
  }

  const data = await resp.json();
  const pods: TapisPod[] = Array.isArray(data.result) ? data.result : [];

  console.debug('[InstanceContext] GET /v3/pods result:', pods.map((p) => ({
    pod_id: p.pod_id,
    image: p.image,
    status: p.status,
    networking: p.networking,
  })));

  // Find upstream API pods: description starts with '[upstream]' (set via
  // tag_upstream_stacks.py). Falls back to image + postgres-pair matching
  // for pods that predate the description convention.
  const podIds = new Set(pods.map((p) => p.pod_id));
  const apiPods = pods.filter((p) => {
    if (!p.pod_id.endsWith('api')) return false;
    if ((p.description ?? '').startsWith('[upstream]')) return true;
    // Fallback: image matches and has a matching postgres pod
    return (
      podIds.has(p.pod_id.replace(/api$/, '') + 'postgres') &&
      (p.image === undefined || p.image === null || p.image.includes(UPSTREAM_API_IMAGE))
    );
  });

  return apiPods.map((p) => {
    // Derive API URL from the pod's networking entry, or fall back to convention
    const netEntry = p.networking
      ? Object.values(p.networking)[0]
      : undefined;
    const apiUrl = netEntry?.url
      ? `https://${netEntry.url}`
      : `https://${p.pod_id}.${getPodsDomain(baseUrl)}`;

    // Stack name = pod_id with trailing 'api' stripped
    const stackId = p.pod_id.replace(/api$/, '');

    const desc = (p.description ?? '').trim();
    const displayName = desc.startsWith('[upstream]')
      ? desc.replace('[upstream]', '').trim() || stackId
      : stackId;

    return {
      stackId,
      displayName,
      apiUrl,
      permission: 'ADMIN' as Permission,
    };
  });
}

function loadPersistedInstance(): ProjectInstance | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as ProjectInstance) : null;
  } catch {
    return null;
  }
}

function persistInstance(instance: ProjectInstance | null): void {
  try {
    if (instance) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(instance));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // sessionStorage unavailable — ignore
  }
}

function getFixedApiUrl(): string | null {
  const fixed =
    window.__UPSTREAM_CONFIG__?.VITE_UPSTREAM_API_URL?.trim() ||
    import.meta.env.VITE_UPSTREAM_API_URL?.trim();
  return fixed || null;
}

/** When a fixed API URL is configured, synthesize a single instance from it. */
function getFixedInstance(): ProjectInstance | null {
  const url = getFixedApiUrl();
  if (!url) return null;
  const cleanUrl = url.replace(/\/+$/, '');
  const hostname = cleanUrl.replace(/^https?:\/\//, '').split('.')[0];
  const stackId = hostname.replace(/api$/, '');
  return { stackId, displayName: stackId, apiUrl: cleanUrl, permission: 'ADMIN' };
}

/** True when no fixed API URL is configured, meaning instance discovery should run. */
function isDiscoveryEnabled(): boolean {
  return !getFixedApiUrl();
}

export const InstanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const queryClient = useQueryClient();
  const discoveryEnabled = isDiscoveryEnabled();

  const [instances, setInstances] = useState<ProjectInstance[]>([]);
  const [selectedInstance, setSelectedInstanceState] = useState<ProjectInstance | null>(
    loadPersistedInstance
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);
  const prevStackIdRef = useRef<string | null>(null);

  const setSelectedInstance = useCallback((instance: ProjectInstance) => {
    setSelectedInstanceState(instance);
    persistInstance(instance);
  }, []);

  // Invalidate all cached data after the render in which selectedInstance
  // changes — this way useConfiguration() already returns the new basePath
  // before any query refetches, so they hit the correct API immediately.
  useEffect(() => {
    const stackId = selectedInstance?.stackId ?? null;
    if (stackId !== prevStackIdRef.current) {
      prevStackIdRef.current = stackId;
      if (stackId !== null) {
        queryClient.invalidateQueries();
      }
    }
  }, [selectedInstance, queryClient]);

  const load = useCallback(async () => {
    if (!discoveryEnabled || !isAuthenticated) return;

    const tapisToken = sessionStorage.getItem('Tapis-Access-Token');
    if (!tapisToken) return;

    setIsLoading(true);
    setError(null);
    try {
      const list = await fetchInstances(tapisToken);
      setInstances(list);

      // Auto-select: restore persisted selection if still in list, otherwise
      // pick the first instance (single-project users land immediately).
      setSelectedInstanceState((prev) => {
        const stillValid = prev && list.some((i) => i.stackId === prev.stackId);
        if (stillValid) return prev;
        const auto = list[0] ?? null;
        persistInstance(auto);
        return auto;
      });
    } catch (err) {
      if (err instanceof TapisAuthError) {
        logout();
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, [discoveryEnabled, isAuthenticated, logout]);

  useEffect(() => {
    if (!isAuthenticated) {
      setInstances([]);
      setSelectedInstanceState(null);
      persistInstance(null);
      fetchedRef.current = false;
      return;
    }

    // Fixed URL mode: skip Tapis discovery and synthesize a single instance.
    const fixedInstance = getFixedInstance();
    if (fixedInstance) {
      setInstances([fixedInstance]);
      setSelectedInstanceState(fixedInstance);
      persistInstance(fixedInstance);
      return;
    }

    // Discovery mode: fetch available API pods from Tapis.
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      load();
    }
  }, [isAuthenticated, load]);

  return (
    <InstanceContext.Provider
      value={{
        instances,
        selectedInstance,
        setSelectedInstance,
        isLoading,
        error,
        reload: load,
        discoveryEnabled,
      }}
    >
      {children}
    </InstanceContext.Provider>
  );
};

export const useInstance = (): InstanceContextType => {
  const ctx = useContext(InstanceContext);
  if (!ctx) throw new Error('useInstance must be used within an InstanceProvider');
  return ctx;
};
