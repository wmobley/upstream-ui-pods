import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
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
  networking?: Record<string, TapisPodNetworking>;
}

const UPSTREAM_API_IMAGE = 'upstream-docker-pods';
const SESSION_KEY = 'upstream_selected_instance';

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

  const resp = await fetch(`${baseUrl}/v3/pods`, {
    headers: {
      'X-Tapis-Token': tapisToken,
      Accept: 'application/json',
    },
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
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

  // Find API pods: image contains our marker and pod_id ends with 'api'.
  // Some Tapis tenants omit the image field for pods you don't own — fall back
  // to matching only on pod_id convention when image is absent.
  const apiPods = pods.filter(
    (p) => p.pod_id.endsWith('api') &&
      (p.image === undefined || p.image === null || p.image.includes(UPSTREAM_API_IMAGE))
  );

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

    return {
      stackId,
      displayName: p.description?.trim() || stackId,
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
  const { isAuthenticated } = useAuth();
  const discoveryEnabled = isDiscoveryEnabled();

  const [instances, setInstances] = useState<ProjectInstance[]>([]);
  const [selectedInstance, setSelectedInstanceState] = useState<ProjectInstance | null>(
    loadPersistedInstance
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const setSelectedInstance = useCallback((instance: ProjectInstance) => {
    setSelectedInstanceState(instance);
    persistInstance(instance);
  }, []);

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
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, [discoveryEnabled, isAuthenticated]);

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
