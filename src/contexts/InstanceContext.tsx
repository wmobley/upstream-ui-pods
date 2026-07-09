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
// Tapis Stacks API types
// TODO: verify exact field names against portals.develop.tapis.io/v3/pods/stacks
// ---------------------------------------------------------------------------
interface TapisPod {
  pod_id: string;
  image?: string;
}

interface TapisStack {
  stack_id: string;
  description?: string;
  /** Permission level for the calling user. Field name TBD pending API verification. */
  permission?: Permission;
  pods?: TapisPod[];
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
  const podsDomain = getPodsDomain(baseUrl);

  // TODO: confirm /v3/pods/stacks endpoint path and response shape
  const resp = await fetch(`${baseUrl}/v3/pods/stacks`, {
    headers: {
      'X-Tapis-Token': tapisToken,
      Accept: 'application/json',
    },
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    throw new Error(`Tapis Stacks API ${resp.status}: ${body}`);
  }

  const data = await resp.json();
  // TODO: adjust `data.result` path once actual response shape is known
  const stacks: TapisStack[] = Array.isArray(data.result) ? data.result : [];

  return stacks
    .filter((s) => s.pods?.some((p) => p.image?.includes(UPSTREAM_API_IMAGE)))
    .map((s) => ({
      stackId: s.stack_id,
      displayName: s.description?.trim() || s.stack_id,
      // Convention: API pod is always {stackId}api
      apiUrl: `https://${s.stack_id}api.${podsDomain}`,
      permission: s.permission ?? 'READ',
    }));
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

/** True when no fixed API URL is configured, meaning instance discovery should run. */
function isDiscoveryEnabled(): boolean {
  const fixed =
    window.__UPSTREAM_CONFIG__?.VITE_UPSTREAM_API_URL?.trim() ||
    import.meta.env.VITE_UPSTREAM_API_URL?.trim();
  return !fixed;
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
      // Clear on logout
      setInstances([]);
      setSelectedInstanceState(null);
      persistInstance(null);
      fetchedRef.current = false;
      return;
    }
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
