import { useEffect, useMemo, useRef, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Pods } from '@tapis/tapis-typescript';
import usePodsList from '../../hooks/pods/usePodsList';
import usePodsConfig from '../../hooks/pods/usePodsConfig';
import usePodPermissions from '../../hooks/pods/usePodPermissions';
import useAddPodPermission from '../../hooks/pods/useAddPodPermission';
import useRemovePodPermission from '../../hooks/pods/useRemovePodPermission';
import useDeletePod from '../../hooks/pods/useDeletePod';
import useDeleteVolume from '../../hooks/pods/useDeleteVolume';
import useVolumesList from '../../hooks/pods/useVolumesList';
import useRestartPod from '../../hooks/pods/useRestartPod';
import { useAuth } from '../../contexts/AuthContextState';
import { buildPodsHeaders, clearTapisAuth, decodeJwtExp } from '../../utils/pods';
import { useUserRoles, useSaveUserRole, UserRoleValue } from '../../hooks/api/useUserRoles';
import useConfiguration from '../../hooks/api/useConfiguration';
import MetadataSchemaAdmin from './_components/MetadataSchemaAdmin';

const formatDate = (value?: Date | string | null) => {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleString();
};

const buildUserIdentifierVariants = (value?: string | null) => {
  if (!value) return [];
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return [];
  const variants = new Set<string>([trimmed]);
  ['@', '/', '\\', '|'].forEach((delimiter) => {
    if (trimmed.includes(delimiter)) {
      trimmed
        .split(delimiter)
        .map((part) => part.trim())
        .filter(Boolean)
        .forEach((part) => variants.add(part));
    }
  });
  return Array.from(variants);
};

const parsePermissions = (permissions?: string[] | null) => {
  if (!permissions) return [];
  return permissions.map((perm) => {
    const [user, level] = perm.split(':');
    return {
      raw: perm,
      user: user || perm,
      level: (level || 'UNKNOWN').toUpperCase(),
    };
  });
};


const suffixes = ['postgres', 'postsgres', 'api'];
const deriveBaseName = (podId: string) => {
  for (const suffix of suffixes) {
    if (podId.toLowerCase().endsWith(suffix)) {
      return podId.slice(0, podId.length - suffix.length);
    }
  }
  return podId;
};

const UI_IMAGE = 'ghcr.io/wmobley/upstream-ui-pods:main';
const API_IMAGE = 'ghcr.io/wmobley/upstream-docker-pods:main';
const POSTGIS_IMAGE = 'postgis/postgis:17-3.5';
const normalizeImage = (image?: string | null) => (image || '').trim().toLowerCase();
const getPodImage = (pod: Pods.PodResponseModel): string | null => {
  const podAny = pod as Pods.PodResponseModel & {
    image?: string | null;
    container_image?: string | null;
    containerImage?: string | null;
  };
  return podAny.image || podAny.container_image || podAny.containerImage || null;
};
const isUiImage = (pod: Pods.PodResponseModel) => normalizeImage(getPodImage(pod)) === UI_IMAGE;
const isApiImage = (pod: Pods.PodResponseModel) => normalizeImage(getPodImage(pod)) === API_IMAGE;
const isPostgisImage = (pod: Pods.PodResponseModel) => normalizeImage(getPodImage(pod)) === POSTGIS_IMAGE;

const buildBaseUrlFromPod = (pod: Pods.PodResponseModel) => {
  const entries = pod.networking ? Object.values(pod.networking) : [];
  const first = entries[0];
  if (!first) return null;
  const host = first.url || '';
  const protocol = 'https';
  const shouldShowPort = first.port && ![80, 443].includes(first.port);
  const port = protocol === 'https' ? '' : shouldShowPort ? `:${first.port}` : '';
  if (!host) return null;
  return `${protocol}://${host}${port}`;
};

const buildLink = (pod: Pods.PodResponseModel) => {
  const baseUrl = buildBaseUrlFromPod(pod);
  if (!baseUrl) return null;
  if (pod.pod_id.toLowerCase().endsWith('api')) {
    return `${baseUrl.replace(/\/$/, '')}/docs`;
  }
  return baseUrl;
};

const sanitizeId = (base: string, suffix: string, fallbackPrefix = 'v') => {
  const cleanedBase = base.toLowerCase().replace(/[^a-z0-9]/g, '');
  const safeBase = cleanedBase && /^[a-z]/.test(cleanedBase) ? cleanedBase : `${fallbackPrefix}${cleanedBase}`;
  return `${safeBase}${suffix}`;
};

const Admin = () => {
  const { username, role: currentUserRole } = useAuth();
  const apiConfig = useConfiguration();
  const { token: tapisTokenFromSession, basePath } = usePodsConfig();
  const fallbackToken = (() => {
    try {
      const stored = sessionStorage.getItem('Tapis-Access-Token');
      if (stored) return stored;
    } catch {
      // ignore
    }
    try {
      const cookieValue = localStorage.getItem('tapis-token');
      if (cookieValue) {
        const parsed = JSON.parse(cookieValue);
        if (parsed?.access_token) return parsed.access_token;
      }
    } catch {
      // ignore parse errors
    }
    return null;
  })();
  const token = tapisTokenFromSession || fallbackToken;

  useEffect(() => {
    console.debug('[Admin] init', {
      username,
      currentUserRole,
      basePath,
      hasSessionToken: Boolean(tapisTokenFromSession),
      hasFallbackToken: Boolean(fallbackToken),
    });
  }, [username, currentUserRole, basePath, tapisTokenFromSession, fallbackToken]);
  const podsQuery = usePodsList();
  const pods = useMemo(() => podsQuery.data?.result ?? [], [podsQuery.data?.result]);
  const volumesQuery = useVolumesList();
  const volumes = volumesQuery.data?.result ?? [];

  const [selectedPodId, setSelectedPodId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState('');
  const [newLevel, setNewLevel] = useState<UserRoleValue>('ADMIN');
  const [savingUserRole, setSavingUserRole] = useState(false);
  const [visibilityUser, setVisibilityUser] = useState('');
  const [visibilityLevel, setVisibilityLevel] = useState<'READ' | 'USER' | 'ADMIN'>('READ');
  const [savingVisibility, setSavingVisibility] = useState(false);
  const [revokingVisibilityUser, setRevokingVisibilityUser] = useState<string | null>(null);
  const [bundleBase, setBundleBase] = useState('');
  const [bundleDisplayName, setBundleDisplayName] = useState('');
  const [pgUser, setPgUser] = useState('fastapi_traefik');
  const [pgPassword, setPgPassword] = useState('fastapi_traefik');
  const [showPods] = useState(true);
  const [openActionsBase, setOpenActionsBase] = useState<string | null>(null);
  const actionMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    // placeholder, actual logic is after visibleGroupedPodEntries declaration
  }, []);

  useEffect(() => {
    if (!openActionsBase) return undefined;
    const handleClickOutside = (event: MouseEvent) => {
      const menuNode = actionMenuRefs.current[openActionsBase];
      if (menuNode && !menuNode.contains(event.target as Node)) {
        setOpenActionsBase(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openActionsBase]);

  const permissionsQuery = usePodPermissions(selectedPodId);
  const podPermissions = useMemo(
    () => parsePermissions(permissionsQuery.data?.result?.permissions),
    [permissionsQuery.data?.result?.permissions],
  );
  const usernameVariants = useMemo(() => buildUserIdentifierVariants(username), [username]);
  const hasPodAdminRole = useMemo(() => {
    if (!usernameVariants.length) return false;
    const variantSet = new Set(usernameVariants);
    return podPermissions.some(
      (perm) =>
        perm.level === 'ADMIN' &&
        buildUserIdentifierVariants(perm.user).some((variant) => variantSet.has(variant)),
    );
  }, [podPermissions, usernameVariants]);
  const roleUpper = (currentUserRole || '').toUpperCase();
  const isApplicationAdmin = roleUpper === 'ADMIN' || roleUpper === 'APPROVEDADMIN';
  const viewerRoles = new Set(['NONE', 'READ', 'USER', 'ADMIN', 'APPROVEDADMIN']);
  const hasApplicationAccess = viewerRoles.has(roleUpper);
  const isCurrentUserAdmin = isApplicationAdmin || hasPodAdminRole;
  const writableRoles = new Set(['USER', 'ADMIN', 'APPROVEDADMIN']);
  const canManagePods = writableRoles.has(roleUpper) || hasPodAdminRole;
  const canViewAdminPage = hasApplicationAccess || hasPodAdminRole;
  const canRestartPods = isCurrentUserAdmin;
  const normalizedUsername = (username || '').trim().toLowerCase();
  const deletePod = useDeletePod();
  const deleteVolume = useDeleteVolume();
  const restartPod = useRestartPod();
  const [deletingBase, setDeletingBase] = useState<string | null>(null);
  const [restartingBase, setRestartingBase] = useState<string | null>(null);
  const [restartProgress, setRestartProgress] = useState<
    Record<string, { podId: string | null; message: string }>
  >({});
  const [bundleCreating, setBundleCreating] = useState(false);
  const [bundleError, setBundleError] = useState<string | null>(null);
  const [bundleSuccess, setBundleSuccess] = useState(false);
  const bundleControlsDisabled = bundleCreating;
  const [globalRestarting, setGlobalRestarting] = useState<{ ui: boolean; api: boolean }>({
    ui: false,
    api: false,
  });
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const waitForPodAvailable = async (podId: string, attempts = 24, delayMs = 5000) => {
    if (!basePath) throw new Error('Pods base URL is not configured.');
    if (!token) throw new Error('Missing Tapis access token.');

    const successStatuses = new Set(['AVAILABLE', 'ON', 'COMPLETE']);
    const successPhases = new Set(['RUNNING', 'SUCCEEDED']);

    for (let i = 0; i < attempts; i += 1) {
      try {
        const res = await fetch(`${basePath}/v3/pods/${encodeURIComponent(podId)}`, {
          headers: buildPodsHeaders(token),
        });
        if (res.ok) {
          const data = await res.json();
          const pod: Pods.PodResponseModel | undefined = data?.result;
          const statusContainer = pod?.status_container as { phase?: string } | undefined;
          const phase = statusContainer?.phase?.toUpperCase();
          const status = pod?.status?.toUpperCase();
          if ((status && successStatuses.has(status)) || (phase && successPhases.has(phase))) {
            return;
          }
        }
      } catch {
        // ignore fetch errors and continue retrying
      }
      await sleep(delayMs);
    }
    throw new Error(`Pod ${podId} did not become available in time.`);
  };

  const waitExtra = async (ms: number) => sleep(ms);

  const waitForPodsDeleted = async (podIds: string[], attempts = 18, delayMs = 4000) => {
    if (!basePath) throw new Error('Pods base URL is not configured.');
    if (!token) throw new Error('Missing Tapis access token.');
    for (let i = 0; i < attempts; i += 1) {
      const remaining: string[] = [];
      await Promise.all(
        podIds.map(async (podId) => {
          try {
            const res = await fetch(`${basePath}/v3/pods/${encodeURIComponent(podId)}`, {
              headers: buildPodsHeaders(token),
            });
            if (res.status !== 404) {
              remaining.push(podId);
            }
          } catch {
            // If fetch fails, assume still present and retry
            remaining.push(podId);
          }
        }),
      );
      if (!remaining.length) return;
      await sleep(delayMs);
    }
    throw new Error('Pods deletion timed out; volume may still be attached.');
  };


  const waitForVolumeDeleted = async (volumeId: string, attempts = 12, delayMs = 5000) => {
    if (!basePath) throw new Error('Pods base URL is not configured.');
    if (!token) throw new Error('Missing Tapis access token.');
    for (let i = 0; i < attempts; i += 1) {
      try {
        const res = await fetch(`${basePath}/v3/pods/volumes/${encodeURIComponent(volumeId)}`, {
          headers: buildPodsHeaders(token),
        });
        if (res.status === 404) {
          return;
        }
      } catch {
        // ignore and retry
      }
      await sleep(delayMs);
    }
    throw new Error(`Volume ${volumeId} did not delete in time.`);
  };

  // Auto logout when token expires
  useEffect(() => {
    if (!token) return;
    const exp = decodeJwtExp(token);
    if (!exp) return;
    const msUntilExpiry = exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) {
      clearTapisAuth();
      window.location.reload();
      return;
    }
    const timer = setTimeout(() => {
      clearTapisAuth();
      window.location.reload();
    }, msUntilExpiry);
    return () => clearTimeout(timer);
  }, [token]);

  const groupedPods = useMemo<Record<string, Pods.PodResponseModel[]>>(() => {
    const grouped = pods.reduce<Record<string, Pods.PodResponseModel[]>>((acc, pod) => {
      const base = deriveBaseName(pod.pod_id);
      if (!acc[base]) acc[base] = [];
      acc[base].push(pod);
      return acc;
    }, {});
    return Object.entries(grouped).reduce<Record<string, Pods.PodResponseModel[]>>((acc, [base, podsForBase]) => {
      const hasUi = podsForBase.some(isUiImage);
      const hasApi = podsForBase.some(isApiImage);
      const allowPostgis = hasUi && hasApi;
      const filtered = podsForBase.filter(
        (pod) =>
          !getPodImage(pod) ||
          isUiImage(pod) ||
          isApiImage(pod) ||
          (allowPostgis && isPostgisImage(pod)),
      );
      if (podsForBase.length && filtered.length === 0) {
        console.debug('[Admin] filtered out pods for base', {
          base,
          pods: podsForBase.map((pod) => ({
            pod_id: pod.pod_id,
            image: getPodImage(pod),
          })),
        });
      }
      if (filtered.length) {
        acc[base] = filtered;
      }
      return acc;
    }, {});
  }, [pods]);
  const groupedPodEntries = useMemo<[string, Pods.PodResponseModel[]][]>(
    () => Object.entries(groupedPods) as [string, Pods.PodResponseModel[]][],
    [groupedPods],
  );
  const selectedBase = useMemo(() => (selectedPodId ? deriveBaseName(selectedPodId) : null), [selectedPodId]);

  const basePermissionQueries = useQueries({
    queries: groupedPodEntries.map(([base, podsForBase]) => ({
      queryKey: ['pods', 'permissions', 'base', base],
      enabled: Boolean(token && basePath && podsForBase.length),
      queryFn: async () => {
        if (!basePath) throw new Error('Pods base URL is not configured.');
        if (!token) throw new Error('Missing Tapis access token.');
        const configuration = new Pods.Configuration({
          basePath,
          headers: buildPodsHeaders(token),
        });
        const api = new Pods.PermissionsApi(configuration);
        return api.getPodPermissions({ podId: podsForBase[0].pod_id });
      },
    })),
  });

  const visibleGroupedPodEntries = useMemo<[string, Pods.PodResponseModel[]][]>(() => {
    if (isApplicationAdmin) {
      return groupedPodEntries;
    }
    if (!token || !basePath) {
      return groupedPodEntries;
    }
    return groupedPodEntries.filter((_, idx) => {
      const query = basePermissionQueries[idx];
      if (!query) {
        console.debug('[Admin] permission query missing for index', { idx });
      }
      if (!query || query.isLoading || query.isError) {
        if (query?.isError) {
          console.debug('[Admin] permission query error', {
            idx,
            error: (query.error as Error | undefined)?.message,
          });
        }
        return false;
      }
      const permissions = parsePermissions(query.data?.result?.permissions);
      const variantSet = new Set(usernameVariants);
      const allowed = permissions.some(
        (perm) =>
          perm.level === 'ADMIN' &&
          buildUserIdentifierVariants(perm.user).some((variant) => variantSet.has(variant)),
      );
      if (!allowed) {
        console.debug('[Admin] permission filter blocked base', {
          idx,
          permissions,
          usernameVariants,
        });
      }
      return allowed;
    });
  }, [groupedPodEntries, basePermissionQueries, token, basePath, usernameVariants, isApplicationAdmin]);

  useEffect(() => {
    console.debug('[Admin] pods summary', {
      podsCount: pods.length,
      groupedCount: groupedPodEntries.length,
      visibleGroups: visibleGroupedPodEntries.length,
      visiblePods: visibleGroupedPodEntries.reduce((count, [, podsForBase]) => count + podsForBase.length, 0),
      podsQueryStatus: {
        isLoading: podsQuery.isLoading,
        isFetching: podsQuery.isFetching,
        isError: podsQuery.isError,
        error: (podsQuery.error as Error | undefined)?.message,
      },
    });
  }, [
    pods.length,
    groupedPodEntries.length,
    visibleGroupedPodEntries,
    podsQuery.isLoading,
    podsQuery.isFetching,
    podsQuery.isError,
    podsQuery.error,
  ]);

  const selectedGroupEntry = useMemo(() => {
    if (!selectedBase) return null;
    return visibleGroupedPodEntries.find(([base]) => base === selectedBase) ?? null;
  }, [selectedBase, visibleGroupedPodEntries]);
  const selectedRolesBasePath = useMemo(() => {
    if (!selectedGroupEntry) return null;
    const [base, podsForBase] = selectedGroupEntry;
    const classified = classifyPodsForBase(base, podsForBase);
    return classified.api ? buildBaseUrlFromPod(classified.api) : null;
  }, [selectedGroupEntry]);
  const userRolesQuery = useUserRoles({
    enabled: isCurrentUserAdmin && Boolean(selectedRolesBasePath),
    basePath: selectedRolesBasePath,
  });
  const saveUserRole = useSaveUserRole({ basePath: selectedRolesBasePath });
  const userRoles = userRolesQuery.data ?? [];

  // Tapis pod-level permission on the *specific* {base}api pod — this, not the
  // application role above, is what controls whether the project even shows up
  // in another user's project selector (see InstanceContext.tsx / GET v3/pods).
  const selectedApiPodId = useMemo(() => {
    if (!selectedGroupEntry) return null;
    const [base, podsForBase] = selectedGroupEntry;
    return classifyPodsForBase(base, podsForBase).api?.pod_id ?? null;
  }, [selectedGroupEntry]);
  const apiPodPermissionsQuery = usePodPermissions(selectedApiPodId);
  const apiPodPermissions = useMemo(
    () => parsePermissions(apiPodPermissionsQuery.data?.result?.permissions),
    [apiPodPermissionsQuery.data?.result?.permissions],
  );
  const hasApiPodAdminRole = useMemo(() => {
    if (!usernameVariants.length) return false;
    const variantSet = new Set(usernameVariants);
    return apiPodPermissions.some(
      (perm) =>
        perm.level === 'ADMIN' &&
        buildUserIdentifierVariants(perm.user).some((variant) => variantSet.has(variant)),
    );
  }, [apiPodPermissions, usernameVariants]);
  const canManagePodVisibility = isApplicationAdmin || hasApiPodAdminRole;
  const addPodPermission = useAddPodPermission();
  const removePodPermission = useRemovePodPermission();

  const hasAnyUiPods = useMemo(
    () => visibleGroupedPodEntries.some(([base, podsForBase]) => Boolean(classifyPodsForBase(base, podsForBase).ui)),
    [visibleGroupedPodEntries],
  );

  const hasAnyApiPods = useMemo(
    () => visibleGroupedPodEntries.some(([base, podsForBase]) => Boolean(classifyPodsForBase(base, podsForBase).api)),
    [visibleGroupedPodEntries],
  );
  const visiblePodsCount = useMemo(
    () => visibleGroupedPodEntries.reduce((count, [, podsForBase]) => count + podsForBase.length, 0),
    [visibleGroupedPodEntries],
  );

  useEffect(() => {
    if (!visibleGroupedPodEntries.length) {
      if (selectedPodId) setSelectedPodId(null);
      return;
    }
    const currentBaseHasSelection = visibleGroupedPodEntries.some(([, podsForBase]) =>
      podsForBase.some((pod) => pod.pod_id === selectedPodId),
    );
    if (!currentBaseHasSelection) {
      const firstPod = visibleGroupedPodEntries[0]?.[1]?.[0];
      setSelectedPodId(firstPod ? firstPod.pod_id : null);
    }
  }, [visibleGroupedPodEntries, selectedPodId]);

  const findVolumeForPod = (pod: Pods.PodResponseModel) => {
    const mounts = pod.volume_mounts ? Object.keys(pod.volume_mounts) : [];
    if (!mounts.length) return null;
    const volumeId = mounts[0];
    const volume = volumes.find((v) => v.volume_id === volumeId);
    return { volumeId, volume };
  };

  const formatVolumeUsage = (volume?: Pods.VolumeResponseModel | Record<string, unknown> | null) => {
    if (!volume) return null;
    const toNumber = (v: unknown): number | null => {
      if (typeof v === 'number') return v;
      if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) {
        return Number(v);
      }
      return null;
    };

    // Pods API returns size_limit (capacity) and size (current) per docs.
    const used =
      toNumber((volume as { size?: unknown }).size) ??
      toNumber((volume as { used_bytes?: unknown }).used_bytes) ??
      toNumber((volume as { usage_bytes?: unknown }).usage_bytes) ??
      toNumber((volume as { used?: unknown }).used);
    const capacity =
      toNumber((volume as { size_limit?: unknown }).size_limit) ??
      toNumber((volume as { capacity_bytes?: unknown }).capacity_bytes) ??
      toNumber((volume as { requested_capacity_bytes?: unknown }).requested_capacity_bytes) ??
      toNumber((volume as { size_bytes?: unknown }).size_bytes);

    if (used !== null && capacity !== null && capacity > 0) {
      const pct = Math.min(100, Math.round((used / capacity) * 100));
      return `${pct}% of ${(capacity / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
    if (capacity !== null) {
      return `${(capacity / (1024 * 1024 * 1024)).toFixed(1)} GB (usage unavailable)`;
    }
    return 'Usage unavailable';
  };

  const updateRestartProgress = (base: string, podId: string | null, message: string) => {
    setRestartProgress((prev) => ({
      ...prev,
      [base]: { podId, message },
    }));
  };

  const restartSinglePodWithProgress = async (
    base: string,
    pod: Pods.PodResponseModel,
    label: string,
    extraDelay = 0
  ) => {
    updateRestartProgress(base, pod.pod_id, `Restarting ${label} pod…`);
    await restartPod.mutateAsync(pod.pod_id);
    updateRestartProgress(base, pod.pod_id, `Waiting for ${label} pod to become available…`);
    await waitForPodAvailable(pod.pod_id);
    if (extraDelay > 0) {
      updateRestartProgress(base, pod.pod_id, `Stabilizing ${label} pod…`);
      await waitExtra(extraDelay);
    }
    updateRestartProgress(base, pod.pod_id, `${label} pod ready.`);
  };

  const clearRestartProgress = (base: string) => {
    setRestartProgress((prev) => {
      const next = { ...prev };
      delete next[base];
      return next;
    });
  };

  function classifyPodsForBase(base: string, podsForBase: Pods.PodResponseModel[]) {
    const baseLower = base.toLowerCase();
    return podsForBase.reduce<{
      postgres?: Pods.PodResponseModel;
      api?: Pods.PodResponseModel;
      ui?: Pods.PodResponseModel;
    }>((acc, pod) => {
      const idLower = pod.pod_id.toLowerCase();
      if (idLower === baseLower) {
        acc.ui = pod;
      } else if (idLower === `${baseLower}api`) {
        acc.api = pod;
      } else if (
        idLower === `${baseLower}postgres` ||
        idLower === `${baseLower}postsgres`
      ) {
        acc.postgres = pod;
      }
      return acc;
    }, {});
  }

  const handleCreateBundle = async () => {
    console.debug('[Admin] handleCreateBundle invoked', {
      hasToken: Boolean(token),
      basePath,
      bundleBase,
      userRole: currentUserRole,
      username,
    });
    const base = bundleBase.trim();
    if (!base) {
      alert('Please enter a base name.');
      return;
    }
    setBundleError(null);
    setBundleSuccess(false);
    setBundleCreating(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      if (apiConfig.headers) {
        Object.entries(apiConfig.headers as Record<string, string>).forEach(([k, v]) => {
          if (v) headers[k] = v;
        });
      }
      if (apiConfig.accessToken && !headers.Authorization && !headers.authorization) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tokenVal = await (apiConfig.accessToken as any)();
        if (tokenVal) headers.Authorization = tokenVal;
      }
      // Forward Tapis token when available so the bundle is created under the user's Pods account.
      try {
        const tapisTokenFromSession =
          typeof window !== 'undefined' ? sessionStorage.getItem('Tapis-Access-Token') : null;
        if (tapisTokenFromSession) {
          headers['X-TAPIS-TOKEN'] = tapisTokenFromSession;
        }
      } catch {
        // ignore
      }

      const response = await fetch(`${apiConfig.basePath}/api/v1/pods/bundle`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          base,
          display_name: bundleDisplayName.trim(),
          pg_user: pgUser,
          pg_password: pgPassword,
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Failed to create bundle (${response.status})`);
      }
      setBundleSuccess(true);
      setSelectedPodId(`${sanitizeId(base, '')}api`);
      setBundleBase('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create bundle';
      console.error('[Admin] Failed to create bundle', error);
      setBundleError(message);
    }
    setBundleCreating(false);
  };

  const handleDeleteGroup = async (base: string, podsForBase: Pods.PodResponseModel[]) => {
    if (!canManagePods) {
      alert('Write permissions are required to delete pods.');
      return;
    }
    if (!podsForBase.length) return;
    setOpenActionsBase(null);
    const confirmed = window.confirm(
      `Delete all pods for "${base}"? This will request deletion of ${podsForBase.length} pod(s).`,
    );
    if (!confirmed) return;
    setDeletingBase(base);
    try {
      const podIds = podsForBase.map((p) => p.pod_id);
      for (const podId of podIds) {
        await deletePod.mutateAsync(podId);
      }

      await waitForPodsDeleted(podIds);

      const volumeId = sanitizeId(base.toLowerCase(), 'volume');
      await deleteVolume.mutateAsync(volumeId);
      await waitForVolumeDeleted(volumeId);

      if (selectedPodId && podsForBase.some((p) => p.pod_id === selectedPodId)) {
        setSelectedPodId(null);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete pods/volume';
      alert(message);
    } finally {
      setDeletingBase(null);
    }
  };

  const handleRestartGroup = async (base: string, podsForBase: Pods.PodResponseModel[]) => {
    if (!podsForBase.length) return;
    if (!canRestartPods) {
      alert('Admin permissions required to restart pods.');
      return;
    }
    setOpenActionsBase(null);
    const classified = classifyPodsForBase(base, podsForBase);
    if (!classified.api && !classified.ui) {
      alert(`No recognizable pods found to restart for "${base}".`);
      return;
    }
    setRestartingBase(base);
    updateRestartProgress(base, null, 'Preparing restart…');
    try {
      if (classified.api) {
        await restartSinglePodWithProgress(base, classified.api, 'API');
      }
      if (classified.ui) {
        await restartSinglePodWithProgress(base, classified.ui, 'UI');
      }
      updateRestartProgress(base, null, 'Restart complete.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to restart pods';
      alert(message);
    } finally {
      setRestartingBase(null);
      setTimeout(() => clearRestartProgress(base), 3_000);
    }
  };

  const handleRestartByType = async (type: 'ui' | 'api') => {
    const label = type === 'api' ? 'API' : 'UI';
    if (!canRestartPods) {
      alert('Admin permissions required to restart pods.');
      return;
    }
    setOpenActionsBase(null);
  const targets = visibleGroupedPodEntries
      .map(([base, podsForBase]) => {
        const classified = classifyPodsForBase(base, podsForBase);
        const pod = type === 'api' ? classified.api : classified.ui;
        return pod ? { base, pod } : null;
      })
      .filter((value): value is { base: string; pod: Pods.PodResponseModel } => Boolean(value));

    if (!targets.length) {
      alert(`No ${label} pods found to restart.`);
      return;
    }

    setGlobalRestarting((prev) => ({ ...prev, [type]: true }));
    try {
      for (const target of targets) {
        setRestartingBase(target.base);
        await restartSinglePodWithProgress(target.base, target.pod, label);
        updateRestartProgress(target.base, null, `${label} pod restart complete.`);
        setTimeout(() => clearRestartProgress(target.base), 3_000);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : `Failed to restart ${label} pods`;
      alert(message);
    } finally {
      setRestartingBase(null);
      setGlobalRestarting((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSaveUserRole = async () => {
    if (!isCurrentUserAdmin) {
      alert('Admin permissions required to manage application roles.');
      return;
    }
    if (!selectedRolesBasePath) {
      alert('Select a pod group with an API pod to manage application roles.');
      return;
    }
    const trimmedUser = newUser.trim().toLowerCase();
    if (!trimmedUser) {
      alert('Enter a username to update.');
      return;
    }
    setSavingUserRole(true);
    try {
      await saveUserRole.mutateAsync({ username: trimmedUser, role: newLevel });
      setNewUser('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update application role';
      alert(message);
    } finally {
      setSavingUserRole(false);
    }
  };

  const handleGrantPodVisibility = async () => {
    if (!canManagePodVisibility) {
      alert('Admin permissions on this pod group are required to manage project visibility.');
      return;
    }
    if (!selectedApiPodId) {
      alert('Select a pod group with an API pod to manage project visibility.');
      return;
    }
    const trimmedUser = visibilityUser.trim().toLowerCase();
    if (!trimmedUser) {
      alert('Enter a username to grant access to.');
      return;
    }
    if (
      visibilityLevel === 'ADMIN' &&
      !window.confirm(
        `Grant ${trimmedUser} ADMIN-level Tapis access to ${selectedApiPodId}? This lets them manage pods and permissions for this project.`,
      )
    ) {
      return;
    }
    setSavingVisibility(true);
    try {
      await addPodPermission.mutateAsync({ podId: selectedApiPodId, user: trimmedUser, level: visibilityLevel });
      console.info('[Admin] Granted Tapis pod permission', {
        podId: selectedApiPodId,
        user: trimmedUser,
        level: visibilityLevel,
        grantedBy: username,
      });
      setVisibilityUser('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to grant project visibility';
      alert(message);
    } finally {
      setSavingVisibility(false);
    }
  };

  const handleRevokePodVisibility = async (user: string) => {
    if (!canManagePodVisibility || !selectedApiPodId) return;
    if (!window.confirm(`Remove ${user}'s Tapis access to ${selectedApiPodId}? They will lose access to this project.`)) {
      return;
    }
    setRevokingVisibilityUser(user);
    try {
      await removePodPermission.mutateAsync({ podId: selectedApiPodId, user });
      console.info('[Admin] Revoked Tapis pod permission', {
        podId: selectedApiPodId,
        user,
        revokedBy: username,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to revoke project visibility';
      alert(message);
    } finally {
      setRevokingVisibilityUser(null);
    }
  };

  if (!canViewAdminPage) {
    return (
      <div className="mx-auto max-w-4xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">Admin</h1>
        <div className="rounded border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
          Your account does not have an Upstream API role. Contact an administrator to be granted access.
        </div>
      </div>
    );
  }

  return (
    <div id="admin-page" className="mx-auto max-w-6xl p-6 sm:p-10 space-y-6">
      <div id="admin-header" className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">Admin</h1>
        <p className="text-sm text-gray-700">Pods you can access, plus application-level roles for the Upstream API.</p>
      </div>

      {!token && (
        <div
          id="admin-token-warning"
          className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900"
        >
          Login via Tapis (or provide a Tapis token) to load your pods.
        </div>
      )}

      {!podsQuery.isError && (
        <>
        <section
          id="admin-bundle-section"
          className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 space-y-3"
        >
          <h3 className="text-lg font-semibold text-gray-900">Create an Upstream System for Your Lab</h3>
          <p className="text-sm text-gray-600">
            Manage your sensors, workflows, and data products in a unified, reproducible ecosystem.
          </p>
          <p className="text-sm text-gray-600">
            Upstream lets any research group, field team, or instrument developer stand up a fully-functioning data
            infrastructure without building everything from scratch. Whether you’re running a mobile lab like SNIFFER,
            deploying long-term environmental monitors, integrating UAV or fixed-wing payloads, or experimenting with novel
            high-resolution sensors, Upstream gives you the tools to capture, store, analyze, and publish your data with confidence.
          </p>
          <p className="text-sm text-gray-600">
            Enter your upstream system name (e.g., <code className="mx-1 rounded bg-gray-100 px-1">sniffer</code>) to create
            snifferpostgres, snifferapi, sniffer, and a <code className="mx-1 rounded bg-gray-100 px-1">sniffervolume</code>.
          </p>
          <p className="text-xs text-gray-600">
            The Postgres username and password become the database user, the database name, and the credentials the API uses to connect.
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              placeholder="Base name (e.g., sniffer)"
              value={bundleBase}
              onChange={(e) => setBundleBase(e.target.value)}
              className="flex-1 min-w-[200px] rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
              disabled={bundleControlsDisabled}
            />
            <input
              type="text"
              placeholder="Display name (e.g., SNIFFER Mobile Lab)"
              value={bundleDisplayName}
              onChange={(e) => setBundleDisplayName(e.target.value)}
              className="flex-1 min-w-[240px] rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
              disabled={bundleControlsDisabled}
            />
            <input
              type="text"
              placeholder="Postgres username"
              value={pgUser}
              onChange={(e) => setPgUser(e.target.value)}
              className="min-w-[180px] rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
              disabled={bundleControlsDisabled}
            />
            <input
              type="password"
              placeholder="Postgres password"
              value={pgPassword}
              onChange={(e) => setPgPassword(e.target.value)}
              className="min-w-[180px] rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
              disabled={bundleControlsDisabled}
            />
            <button
              type="button"
              onClick={handleCreateBundle}
              className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              disabled={bundleControlsDisabled || !bundleBase.trim()}
            >
              {bundleCreating ? 'Creating…' : 'Create bundle'}
            </button>
          </div>
          {bundleError && (
            <div className="text-xs text-red-600">
              {bundleError}
            </div>
          )}
          {bundleSuccess && (
            <div className="text-xs text-green-700">Bundle creation requested.</div>
          )}
        </section>
        </>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <section
          id="admin-pods-section"
          className="lg:col-span-2 rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          <div
            id="admin-pods-header"
            className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3"
          >
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">Pods</h3>
              {canRestartPods && (
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleRestartByType('ui')}
                    disabled={
                      !hasAnyUiPods ||
                      globalRestarting.ui ||
                      globalRestarting.api ||
                      Boolean(restartingBase) ||
                      Boolean(deletingBase) ||
                      restartPod.isPending ||
                      deletePod.isPending
                    }
                    className="rounded bg-blue-50 px-3 py-1 font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {globalRestarting.ui ? 'Restarting UI…' : 'Restart UI'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRestartByType('api')}
                    disabled={
                      !hasAnyApiPods ||
                      globalRestarting.api ||
                      globalRestarting.ui ||
                      Boolean(restartingBase) ||
                      Boolean(deletingBase) ||
                      restartPod.isPending ||
                      deletePod.isPending
                    }
                    className="rounded bg-blue-50 px-3 py-1 font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {globalRestarting.api ? 'Restarting API…' : 'Restart API'}
                  </button>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {podsQuery.isFetching
                ? 'Refreshing…'
                : podsQuery.isSuccess
                  ? `${visiblePodsCount} pod${visiblePodsCount === 1 ? '' : 's'}`
                  : ''}
            </div>
          </div>

          <div id="admin-pods-body" className="p-4">
            {podsQuery.isLoading && (
              <div className="p-4 text-sm text-gray-700">Loading pods…</div>
            )}
            {podsQuery.isError && (
              <div className="p-4 space-y-3">
                <div className="text-sm text-red-600">
                  {(podsQuery.error as Error)?.message || 'Unable to load pods'}
                </div>
                <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm text-gray-800 font-semibold">Pods not loading?</p>
                  <p className="text-sm text-gray-700">
                    You can manage and troubleshoot your pods directly in the Pods admin interface.
                  </p>
                  <div className="mt-3">
                    <a
                      href="https://upstream.pods.portals.tapis.io/admin"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Open Pods Admin
                    </a>
                  </div>
                </div>
              </div>
            )}
            {!podsQuery.isLoading && !podsQuery.isError && visiblePodsCount === 0 && (
              <div className="p-4 text-sm text-gray-700">No pods where you have admin access.</div>
            )}

            {showPods && (
              <div id="admin-pods-list" className="space-y-2">
                {visibleGroupedPodEntries.map(([base, podsForBase]) => {
                  const uiPod = podsForBase.find((p) => p.pod_id.toLowerCase() === base.toLowerCase());
                  const uiLink = uiPod ? buildLink(uiPod) : null;
                  const classified = classifyPodsForBase(base, podsForBase);
                  const hasRestartTargets = Boolean(classified.postgres || classified.api || classified.ui);
                  const isDeleting = deletingBase === base;
                  const isRestarting = restartingBase === base;
                  const isSelectedGroup = selectedBase === base;
                  const isActionsOpen = openActionsBase === base;
                  const progress = restartProgress[base];
                  const disableRestart =
                    !hasRestartTargets ||
                    isRestarting ||
                    isDeleting ||
                    restartPod.isPending ||
                    deletePod.isPending ||
                    globalRestarting.ui ||
                    globalRestarting.api ||
                    !canManagePods;
                  const disableDelete =
                    isRestarting ||
                    isDeleting ||
                    deletePod.isPending ||
                    globalRestarting.ui ||
                    globalRestarting.api ||
                    !canManagePods;
                  return (
                    <details
                      key={base}
                      id={`admin-pod-group-${sanitizeId(base, '')}`}
                      className={`rounded border ${isSelectedGroup ? 'border-blue-300 bg-blue-50' : 'border-gray-100 bg-gray-50'}`}
                      open
                    >
                      <summary
                        className={`cursor-pointer px-3 py-2 text-xs font-semibold uppercase ${
                          isSelectedGroup ? 'text-blue-700' : 'text-gray-600'
                        }`}
                      >
                        {base || '(no base)'}
                      </summary>
                      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2">
                        <div className="text-xs text-gray-600">
                          {progress?.message ||
                            (isRestarting && 'Restarting pods…') ||
                            (!isRestarting && isDeleting && 'Deleting pods…') ||
                            (!isRestarting && !isDeleting && !uiLink && 'No UI pod detected')}
                        </div>
                        <div
                          className="relative"
                          ref={(el) => {
                            actionMenuRefs.current[base] = el;
                          }}
                          id={`admin-pod-group-actions-${sanitizeId(base, '')}`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (!canManagePods) {
                                alert('Write permissions are required to manage pods.');
                                return;
                              }
                              setOpenActionsBase((prev) => (prev === base ? null : base));
                            }}
                            disabled={!canManagePods}
                            className={`inline-flex items-center rounded px-3 py-1 text-xs font-semibold text-white focus:outline-none ${
                              canManagePods ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed opacity-70'
                            }`}
                            aria-haspopup="menu"
                            aria-expanded={isActionsOpen}
                          >
                            Actions
                            <svg
                              className={`ml-2 size-3 transition-transform ${isActionsOpen ? 'rotate-180' : ''}`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          {isActionsOpen && (
                            <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5">
                              <button
                                type="button"
                                onClick={() => {
                                  if (uiLink && typeof window !== 'undefined') {
                                    window.open(uiLink, '_blank', 'noopener,noreferrer');
                                  }
                                  setOpenActionsBase(null);
                                }}
                                disabled={!uiLink}
                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                              >
                                {uiLink ? 'Open UI' : 'Open UI (unavailable)'}
                              </button>
                              {canRestartPods && (
                                <button
                                  type="button"
                                  onClick={() => handleRestartGroup(base, podsForBase)}
                                  disabled={disableRestart}
                                  className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300"
                                >
                                  {isRestarting ? 'Restarting…' : 'Restart group'}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteGroup(base, podsForBase)}
                                disabled={disableDelete}
                                className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-red-300"
                              >
                                {isDeleting ? 'Deleting…' : 'Delete group'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="divide-y divide-gray-100" id={`admin-pod-group-entries-${sanitizeId(base, '')}`}>
                        {podsForBase.map((pod) => {
                          const isSelected = isSelectedGroup || pod.pod_id === selectedPodId;
                          const link = buildLink(pod);
                          const volumeInfo = pod.pod_id.toLowerCase().includes('postgres')
                            ? findVolumeForPod(pod)
                            : null;
                          const isRestartTarget = progress?.podId === pod.pod_id;
                          const restartMessage = isRestartTarget ? progress?.message : null;
                          const volumeUsageText =
                            volumeInfo && volumesQuery.isSuccess
                              ? formatVolumeUsage(volumeInfo.volume as Pods.VolumeResponseModel)
                              : null;
                          return (
                            <button
                              key={pod.pod_id}
                              id={`admin-pod-${sanitizeId(pod.pod_id, '')}`}
                              type="button"
                              onClick={() => setSelectedPodId(pod.pod_id)}
                              className={`w-full text-left transition ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                            >
                              <div className="px-4 py-3 space-y-2">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-base font-semibold text-gray-900">{pod.pod_id}</p>
                                    <p className="text-xs text-gray-600">{pod.description || 'Upstream UI frontend'}</p>
                                    {restartMessage && (
                                      <p className="text-xs font-semibold text-blue-600">{restartMessage}</p>
                                    )}
                                  </div>
                                  <div className="text-right text-xs text-gray-600 space-y-1">
                                    <div>
                                      <span className="font-medium text-gray-800">Status:</span>{' '}
                                      {pod.status || pod.status_requested || '—'}
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-800">Created:</span> {formatDate(pod.creation_ts)}
                                    </div>
                                    {volumeInfo && (
                                      <div className="text-left">
                                        <span className="font-medium text-gray-800">Volume:</span>{' '}
                                        {volumeInfo.volumeId}
                                        {volumesQuery.isLoading && ' — loading usage…'}
                                        {volumeUsageText ? ` — ${volumeUsageText}` : !volumesQuery.isLoading ? ' — usage unavailable' : ''}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                                  {link && (
                                    <a
                                      href={link}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 underline"
                                    >
                                      Open
                                    </a>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </details>
                  );
                })}
              </div>
            )}

            {!showPods && pods.length > 0 && (
              <div className="p-4 text-sm text-gray-700">Pods are hidden. Click "Show pods" to view them.</div>
            )}
          </div>
        </section>

        <section id="admin-roles-section" className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div id="admin-roles-header" className="border-b border-gray-200 px-4 py-3">
            <h3 className="text-lg font-semibold text-gray-900">Application roles</h3>
            <p className="text-sm text-gray-600">
              Assign Upstream API roles for the selected pod group. These roles replace the legacy Pods permission list.
            </p>
            {selectedBase && (
              <p className="text-xs text-gray-500">Scope: {selectedBase}</p>
            )}
          </div>

          {!isCurrentUserAdmin && (
            <div className="p-4 text-sm text-yellow-800 bg-yellow-50 border-b border-yellow-100">
              Admin role required to view or edit application roles. (Admin access is granted via Pods permissions or the Upstream role table.)
            </div>
          )}

          {isCurrentUserAdmin && !selectedRolesBasePath && (
            <div className="p-4 text-sm text-yellow-800 bg-yellow-50 border-b border-yellow-100">
              Select a pod group with an API pod to view or edit application roles.
            </div>
          )}

          {isCurrentUserAdmin && selectedRolesBasePath && userRolesQuery.isLoading && (
            <div className="p-4 text-sm text-gray-700">Loading roles…</div>
          )}

          {isCurrentUserAdmin && selectedRolesBasePath && userRolesQuery.isError && (
            <div className="p-4 text-sm text-red-600">
              {(userRolesQuery.error as Error)?.message || 'Unable to load user roles'}
            </div>
          )}

          {isCurrentUserAdmin && selectedRolesBasePath && !userRolesQuery.isLoading && !userRolesQuery.isError && (
            userRoles.length > 0 ? (
              <div id="admin-roles-list" className="divide-y divide-gray-100">
                {userRoles.map((entry) => (
                  <div key={entry.username} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{entry.username}</p>
                      {entry.username === normalizedUsername && (
                        <p className="text-xs text-gray-500">Signed in</p>
                      )}
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 uppercase tracking-wide">
                      {entry.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-sm text-gray-700">No application roles have been configured yet.</div>
            )
          )}

          {isCurrentUserAdmin && selectedRolesBasePath && (
            <div id="admin-roles-form" className="border-t border-gray-200 px-4 py-3 space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Assign or update a role</h4>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                  placeholder="Username"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                  disabled={savingUserRole || saveUserRole.isPending}
                />
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value as UserRoleValue)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                  disabled={savingUserRole || saveUserRole.isPending}
                >
                  <option value="READ">READ</option>
                  <option value="USER">USER</option>
                  <option value="APPROVEDADMIN">APPROVEDADMIN</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <button
                  type="button"
                  onClick={handleSaveUserRole}
                  className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  disabled={savingUserRole || saveUserRole.isPending || !newUser.trim()}
                >
                  {savingUserRole || saveUserRole.isPending ? 'Saving…' : 'Save role'}
                </button>
                {saveUserRole.isError && (
                  <div className="text-xs text-red-600">
                    {(saveUserRole.error as Error)?.message || 'Failed to update role'}
                  </div>
                )}
                {saveUserRole.isSuccess && (
                  <div className="text-xs text-green-700">Role updated.</div>
                )}
              </div>
            </div>
          )}
        </section>

        <section id="admin-pod-visibility-section" className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div id="admin-pod-visibility-header" className="border-b border-gray-200 px-4 py-3">
            <h3 className="text-lg font-semibold text-gray-900">Project visibility (Tapis pod access)</h3>
            <p className="text-sm text-gray-600">
              Controls whether this project appears at all in a user&apos;s project selector. This is separate
              from Application roles above — a user needs a Tapis pod permission here to see the project, and
              an Application role to do anything once inside it.
            </p>
            {selectedApiPodId && (
              <p className="text-xs text-gray-500">Scope: {selectedApiPodId}</p>
            )}
          </div>

          {!selectedApiPodId && (
            <div className="p-4 text-sm text-yellow-800 bg-yellow-50 border-b border-yellow-100">
              Select a pod group with an API pod to view or edit project visibility.
            </div>
          )}

          {selectedApiPodId && !canManagePodVisibility && (
            <div className="p-4 text-sm text-yellow-800 bg-yellow-50 border-b border-yellow-100">
              ADMIN-level Tapis access to {selectedApiPodId} is required to view or edit project visibility.
            </div>
          )}

          {selectedApiPodId && canManagePodVisibility && apiPodPermissionsQuery.isLoading && (
            <div className="p-4 text-sm text-gray-700">Loading pod permissions…</div>
          )}

          {selectedApiPodId && canManagePodVisibility && apiPodPermissionsQuery.isError && (
            <div className="p-4 text-sm text-red-600">
              {(apiPodPermissionsQuery.error as Error)?.message || 'Unable to load pod permissions'}
            </div>
          )}

          {selectedApiPodId && canManagePodVisibility && !apiPodPermissionsQuery.isLoading && !apiPodPermissionsQuery.isError && (
            apiPodPermissions.length > 0 ? (
              <div id="admin-pod-visibility-list" className="divide-y divide-gray-100">
                {apiPodPermissions.map((entry) => (
                  <div key={entry.raw} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{entry.user}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 uppercase tracking-wide">
                        {entry.level}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRevokePodVisibility(entry.user)}
                        disabled={revokingVisibilityUser === entry.user || removePodPermission.isPending}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-60"
                      >
                        {revokingVisibilityUser === entry.user ? 'Revoking…' : 'Revoke'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-sm text-gray-700">No users currently have Tapis access to this pod.</div>
            )
          )}

          {selectedApiPodId && canManagePodVisibility && (
            <div id="admin-pod-visibility-form" className="border-t border-gray-200 px-4 py-3 space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Grant project access</h4>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={visibilityUser}
                  onChange={(e) => setVisibilityUser(e.target.value)}
                  placeholder="Username"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                  disabled={savingVisibility || addPodPermission.isPending}
                />
                <select
                  value={visibilityLevel}
                  onChange={(e) => setVisibilityLevel(e.target.value as 'READ' | 'USER' | 'ADMIN')}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                  disabled={savingVisibility || addPodPermission.isPending}
                >
                  <option value="READ">READ</option>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <button
                  type="button"
                  onClick={handleGrantPodVisibility}
                  className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  disabled={savingVisibility || addPodPermission.isPending || !visibilityUser.trim()}
                >
                  {savingVisibility || addPodPermission.isPending ? 'Saving…' : 'Grant access'}
                </button>
                {addPodPermission.isError && (
                  <div className="text-xs text-red-600">
                    {(addPodPermission.error as Error)?.message || 'Failed to grant project visibility'}
                  </div>
                )}
                {addPodPermission.isSuccess && (
                  <div className="text-xs text-green-700">Access granted.</div>
                )}
              </div>
            </div>
          )}
        </section>

        <section
          id="admin-metadata-section"
          className="rounded-lg border border-gray-200 bg-white shadow-sm lg:col-span-3"
        >
          <MetadataSchemaAdmin canManage={isCurrentUserAdmin} />
        </section>
      </div>

    </div>
  );
};

export default Admin;
