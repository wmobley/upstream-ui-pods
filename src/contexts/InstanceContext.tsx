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
import { useHistory, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContextState';

export type Permission = 'ADMIN' | 'USER' | 'READ' | 'UNKNOWN';

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

const SESSION_KEY = 'upstream_selected_instance';
const ROLE_LOOKUP_CONCURRENCY = 6;

// Base Upstream API URL — configurable via VITE_BASE_UPSTREAM_API_URL,
// defaults to production upstreamapi pod.
function getBaseUpstreamApiUrl(): string {
  return (
    window.__UPSTREAM_CONFIG__?.VITE_BASE_UPSTREAM_API_URL?.trim() ||
    import.meta.env.VITE_BASE_UPSTREAM_API_URL?.trim() ||
    'https://upstreamapi.pods.portals.tapis.io'
  );
}

/** Check if the user has PT2050-DataX allocation by calling the base
 *  upstreamapi's /user-roles/me endpoint. Returns true if role !== NONE. */
async function checkBaseAllocation(tapisToken: string): Promise<boolean> {
  const baseUrl = getBaseUpstreamApiUrl();
  try {
    const resp = await fetch(`${baseUrl}/api/v1/user-roles/me`, {
      headers: {
        Authorization: `Bearer ${tapisToken}`,
        Accept: 'application/json',
      },
    });
    if (!resp.ok) return false;
    const data = await resp.json();
    return (data?.role || '').toUpperCase() !== 'NONE';
  } catch {
    return false;
  }
}

// Selected project is mirrored into this query param so URLs (shared links,
// reloads, back/forward) always identify which project's data is shown,
// rather than relying solely on sessionStorage (which is per-tab and not
// carried by a shared/reloaded URL).
const PROJECT_QUERY_KEY = 'project';

function getProjectIdFromSearch(search: string): string | null {
  return new URLSearchParams(search).get(PROJECT_QUERY_KEY);
}

function withProjectId(search: string, stackId: string | null): string {
  const params = new URLSearchParams(search);
  if (stackId) {
    params.set(PROJECT_QUERY_KEY, stackId);
  } else {
    params.delete(PROJECT_QUERY_KEY);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

/** Runs `fn` over `items` with at most `limit` in flight; never throws — each
 *  outcome is captured like Promise.allSettled, so one failure can't affect
 *  the others or abort the batch. */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const current = nextIndex++;
      try {
        const value = await fn(items[current]);
        results[current] = { status: 'fulfilled', value };
      } catch (reason) {
        results[current] = { status: 'rejected', reason };
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

/** Maps the app's own per-project DB role (from GET /user-roles/me) to a
 *  Permission. Returns null for NONE — the caller has no real access and
 *  the instance should be dropped, not just relabeled. */
function mapBackendRole(role: unknown): Permission | null {
  switch (role) {
    case 'ADMIN':
    case 'APPROVEDADMIN':
      return 'ADMIN';
    case 'USER':
      return 'USER';
    case 'READ':
      return 'READ';
    default:
      return null;
  }
}

/** Resolves the caller's own DB role for one project instance.
 *  Returns null when the caller genuinely has no access (NONE role, or
 *  401/403). Throws for anything else (network error, timeout, 5xx) so the
 *  caller can distinguish "no access" from "couldn't check" instead of
 *  conflating a down/restarting pod with a real permission denial. */
async function fetchRoleForInstance(apiUrl: string, tapisToken: string): Promise<Permission | null> {
  const resp = await fetch(`${apiUrl}/api/v1/user-roles/me`, {
    headers: {
      Authorization: `Bearer ${tapisToken}`,
      Accept: 'application/json',
    },
  });

  if (resp.status === 401 || resp.status === 403) {
    return null;
  }
  if (!resp.ok) {
    throw new Error(`GET /user-roles/me ${resp.status}`);
  }

  const data = await resp.json();
  return mapBackendRole(data?.role);
}

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
  // No list_type param needed — GET /pods already returns every pod the
  // caller has READ+ access to by default (confirmed against the Tapis
  // Pods service source; there is no list_type query param on this endpoint).
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

  // Filter to upstream API pods — only pods whose description starts with
  // '[upstream]' (set via tag_upstream_stacks.py or build_bundle).
  const apiPods = pods.filter(
    (p) => p.pod_id.endsWith('api') && (p.description ?? '').startsWith('[upstream]')
  );

  const candidates = apiPods.map((p) => {
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

    return { stackId, displayName, apiUrl };
  });

  // Resolve each project's real per-user DB role (GET /user-roles/me) in
  // parallel, capped, so one slow/erroring project can't block the others.
  // NONE/401/403 -> real no-access, drop the instance. Any other failure
  // (network error, timeout, 5xx — e.g. a pod mid-restart) -> keep the
  // instance but mark it 'UNKNOWN' rather than silently hiding a project
  // the user may actually have access to.
  const roleResults = await mapWithConcurrency(candidates, ROLE_LOOKUP_CONCURRENCY, (c) =>
    fetchRoleForInstance(c.apiUrl, tapisToken)
  );

  const instances: ProjectInstance[] = [];
  candidates.forEach((c, i) => {
    const result = roleResults[i];
    if (result.status === 'fulfilled') {
      if (result.value === null) return; // no access — drop
      instances.push({ ...c, permission: result.value });
    } else {
      console.warn(`[InstanceContext] Could not verify role for ${c.stackId}:`, result.reason);
      instances.push({ ...c, permission: 'UNKNOWN' });
    }
  });

  return instances;
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
  const history = useHistory();
  const location = useLocation();
  const discoveryEnabled = isDiscoveryEnabled();

  const [instances, setInstances] = useState<ProjectInstance[]>([]);
  const [selectedInstance, setSelectedInstanceState] = useState<ProjectInstance | null>(
    loadPersistedInstance
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);
  const prevStackIdRef = useRef<string | null>(null);

  // Writes the URL synchronously with the state change, rather than leaving
  // it to the reconciliation effect below — that effect treats a URL/state
  // mismatch as "the URL changed externally, catch state up to it", which
  // would otherwise see the still-stale URL right after a user-driven
  // selection change and incorrectly snap the selection back to it.
  const setSelectedInstance = useCallback((instance: ProjectInstance) => {
    setSelectedInstanceState(instance);
    persistInstance(instance);
    if (discoveryEnabled) {
      // When switching projects, navigate to the campaign list (home) instead of
      // keeping the current path — the previous path (e.g. /campaign/10) may not
      // exist in the new project and would show a confusing "API server not running"
      // error. The home page shows available campaigns for the selected project.
      history.replace({
        pathname: '/',
        search: withProjectId(location.search, instance.stackId),
      });
    }
  }, [discoveryEnabled, history, location.search]);

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

  // Keep the `project` URL query param and selectedInstance reconciled:
  // - if in-app navigation (history.push) dropped the param, or it's simply
  //   absent, re-add it so the current URL always identifies the project;
  // - if the param names a different, known project (pasted link, back/forward
  // navigation to a different project's URL), switch to that project instead.
  useEffect(() => {
    if (!discoveryEnabled || !selectedInstance || instances.length === 0) return;

    const urlStackId = getProjectIdFromSearch(location.search);
    if (urlStackId === selectedInstance.stackId) return;

    const matched = urlStackId ? instances.find((i) => i.stackId === urlStackId) : undefined;
    if (matched) {
      setSelectedInstanceState(matched);
      persistInstance(matched);
    } else {
      history.replace({
        pathname: location.pathname,
        search: withProjectId(location.search, selectedInstance.stackId),
      });
    }
  }, [discoveryEnabled, selectedInstance, instances, location.pathname, location.search, history]);

  const load = useCallback(async () => {
    if (!discoveryEnabled || !isAuthenticated) return;

    const tapisToken = sessionStorage.getItem('Tapis-Access-Token');
    if (!tapisToken) return;

    setIsLoading(true);
    setError(null);
    try {
      const list = await fetchInstances(tapisToken);

      // Check PT2050-DataX allocation on base upstreamapi.
      // If user has allocation, ensure "UpStream Base" is in the list.
      const hasBaseAllocation = await checkBaseAllocation(tapisToken);
      if (hasBaseAllocation) {
        const baseInstance: ProjectInstance = {
          stackId: 'upstream',
          displayName: 'UpStream Base',
          apiUrl: getBaseUpstreamApiUrl(),
          permission: 'USER', // placeholder; will be resolved by RoleSync/useConfiguration
        };
        // Avoid duplicate if Tapis already returned upstreamapi
        if (!list.some((i) => i.stackId === 'upstream')) {
          list.unshift(baseInstance);
        }
      }

      setInstances(list);

      // Auto-select: prefer the project named in the URL (so a shared link or
      // reload lands on the right project), then the persisted selection if
      // still in list, otherwise the 'upstream' base system, then first in list.
      setSelectedInstanceState((prev) => {
        const urlStackId = getProjectIdFromSearch(window.location.search);
        const fromUrl = urlStackId ? list.find((i) => i.stackId === urlStackId) : undefined;
        if (fromUrl) {
          persistInstance(fromUrl);
          return fromUrl;
        }
        const stillValid = prev && list.some((i) => i.stackId === prev.stackId);
        if (stillValid) return prev;
        const auto = list.find((i) => i.stackId === 'upstream') ?? list[0] ?? null;
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
