import { useEffect, useMemo, useState } from 'react';
import { Pods } from '@tapis/tapis-typescript';
import usePodsList from '../../hooks/pods/usePodsList';
import usePodsConfig from '../../hooks/pods/usePodsConfig';
import usePodPermissions from '../../hooks/pods/usePodPermissions';
import useAddPodPermission from '../../hooks/pods/useAddPodPermission';
import useCreatePod from '../../hooks/pods/useCreatePod';
import useCreateVolume from '../../hooks/pods/useCreateVolume';
import useDeletePod from '../../hooks/pods/useDeletePod';
import useDeleteVolume from '../../hooks/pods/useDeleteVolume';
import useVolumesList from '../../hooks/pods/useVolumesList';
import { buildPodsHeaders, clearTapisAuth, decodeJwtExp } from '../../utils/pods';

const formatDate = (value?: Date | string | null) => {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleString();
};

const parsePermissions = (permissions?: string[] | null) => {
  if (!permissions) return [];
  return permissions.map((p) => {
    const [user, level] = p.split(':');
    return { user: user || p, level: level || 'UNKNOWN', raw: p };
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

const buildLink = (pod: Pods.PodResponseModel) => {
  const entries = pod.networking ? Object.values(pod.networking) : [];
  const first = entries[0];
  if (!first) return null;
  const host = first.url || '';
  const protocol = first.protocol || 'http';
  const shouldShowPort = first.port && ![80, 443].includes(first.port);
  const port = shouldShowPort ? `:${first.port}` : '';
  if (!host) return null;
  const baseUrl = `${protocol}://${host}${port}`;
  if (pod.pod_id.toLowerCase().endsWith('api')) {
    return `${baseUrl.replace(/\/$/, '')}/docs`;
  }
  return baseUrl;
};

const baseDomainFromHost = (host: string) => host.split('.').slice(1).join('.');
const replaceHostPrefix = (host: string, newPrefix: string) => {
  const domain = baseDomainFromHost(host);
  if (!domain) return host;
  return `${newPrefix}.${domain}`;
};

const replaceAll = (value: string, search: string, replace: string) =>
  value.split(search).join(replace);

const ensurePort = (value: string, port?: number) => {
  try {
    const url = new URL(value);
    // Remove accidental double slashes before modifying
    url.pathname = url.pathname.replace(/\/\/+$/, '/');
    if (!port || [80, 443].includes(port)) {
      return url.toString().replace(/\/$/, '');
    }
    if (!url.port) {
      url.port = String(port);
      return url.toString().replace(/\/$/, '');
    }
  } catch {
    // ignore bad URLs
  }
  return value.replace(/\/$/, '');
};

const rewriteHostInUrl = (value: string, base: string) => {
  try {
    const url = new URL(value);
    const isProdApi = url.hostname.includes('upstreamapi.pods.tacc.tapis.io');
    const isDevApi = url.hostname.includes('upstreamapi.pods.tacc.develop.tapis.io');
    const isProdUi = url.hostname.includes('upstream.pods.tacc.tapis.io');
    const isDevUi = url.hostname.includes('upstream.pods.tacc.develop.tapis.io');
    const isProdPg = url.hostname.includes('disasterpostgres.pods.tacc.tapis.io');
    const isDevPg = url.hostname.includes('disasterpostgres.pods.tacc.develop.tapis.io');

    if (isProdApi || isDevApi) {
      url.hostname = `${base}api.pods.tacc.develop.tapis.io`;
    } else if (isProdUi || isDevUi) {
      url.hostname = `${base}.pods.tacc.develop.tapis.io`;
    } else if (isProdPg || isDevPg) {
      url.hostname = `${base}postgres.pods.tacc.develop.tapis.io`;
    }
    return url.toString();
  } catch {
    return value;
  }
};

const sanitizeId = (base: string, suffix: string, fallbackPrefix = 'v') => {
  const cleanedBase = base.toLowerCase().replace(/[^a-z0-9]/g, '');
  const safeBase = cleanedBase && /^[a-z]/.test(cleanedBase) ? cleanedBase : `${fallbackPrefix}${cleanedBase}`;
  return `${safeBase}${suffix}`;
};

const rewriteCreds = (value: string, user: string, password: string) => {
  let val = value;
  val = replaceAll(val, 'fastapi_traefik:fastapi_traefik', `${user}:${password}`);
  val = replaceAll(val, 'fastapi_traefik', `${user}`); // fallback; may also hit db name, acceptable
  return val;
};

const postgresBlueprint = {
  pod_id: 'disasterpostgres',
  image: 'postgis/postgis:17-3.5',
  pod_template: 'postgres:17postgis3.5@2025-10-13-20:41:16',
  description: 'postgres for upstream-docker',
  command: ['docker-entrypoint.sh'],
  arguments: ['-c', 'ssl=on', '-c', 'ssl_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem', '-c', 'ssl_key_file=/etc/ssl/private/ssl-cert-snakeoil.key'],
  environment_variables: {
    POSTGRES_USER: 'fastapi_traefik',
    POSTGRES_PASSWORD: 'fastapi_traefik',
    POSTGRES_DB: 'fastapi_traefik',
  },
  status_requested: 'ON',
  volume_mounts: {
    disastervolume: {
      type: 'tapisvolume' as const,
      mount_path: '/var/lib/postgresql/data',
      sub_path: '',
    },
  },
  time_to_stop_default: -1,
  networking: {
    default: {
      protocol: 'postgres',
      port: 5432,
      url: 'disasterpostgres.pods.tacc.develop.tapis.io',
    },
  },
  resources: {
    cpu_request: 250,
    cpu_limit: 2000,
    mem_request: 256,
    mem_limit: 3072,
    gpus: 0,
  },
} as Pods.PodResponseModel & { image?: string };

const apiBlueprint = {
  pod_id: 'upstreamapi',
  image: 'ghcr.io/wmobley/upstream-docker-pods:main',
  pod_template: '',
  description: 'upstreamapi connected to postgres pod',
  command: ['/bin/bash', '-c', 'alembic upgrade heads && uvicorn app.main:app --reload --host 0.0.0.0'],
  environment_variables: {
    DATABASE_URL: 'postgresql+psycopg://fastapi_traefik:fastapi_traefik@disasterpostgres.pods.tacc.develop.tapis.io:443/fastapi_traefik',
    VITE_UPSTREAM_API_URL: 'https://upstream.pods.tacc.develop.tapis.io',
    POSTGRES_PASSWORD: 'fastapi_traefik',
    TAS_USER: 'tasclient_dsso',
    TAS_SECRET: '2TjvnY22spKet8cdZwxYZjunLmQCKFRkN9vEtWNnv2JV5vZnCUDxKCxsQyFJJxXG',
    JWT_SECRET: 'iHaveADogHerNameIsAcacia',
    ALG: 'HS256',
    TAS_URL: 'https://tas-dev.tacc.utexas.edu/api-test',
    ENVIRONMENT: 'production',
    ENV: 'production',
    CKAN_URL: 'https://ckan.tacc.utexas.edu',
    CKAN_TIMEOUT: '30',
    UI_BASE_URL: 'https://upstream.pods.tacc.develop.tapis.io',
    API_BASE_URL: 'https://upstreamapi.pods.tacc.develop.tapis.io',
  },
  status_requested: 'ON',
  volume_mounts: {},
  time_to_stop_default: -1,
  networking: {
    default: {
      protocol: 'http',
      port: 8000,
      url: 'upstreamapi.pods.tacc.develop.tapis.io',
    },
  },
  resources: {
    cpu_request: 250,
    cpu_limit: 2000,
    mem_request: 256,
    mem_limit: 3072,
    gpus: 0,
  },
} as Pods.PodResponseModel & { image?: string };

const uiBlueprint = {
  pod_id: 'upstream',
  image: 'ghcr.io/wmobley/upstream-ui-pods:main',
  pod_template: '',
  description: 'Upstream ui frontend',
  environment_variables: {
    VITE_UPSTREAM_API_URL: 'https://upstreamapi.pods.tacc.develop.tapis.io',
    VITE_CKAN_URL: 'https://ckan.tacc.utexas.edu',
  },
  status_requested: 'ON',
  volume_mounts: {},
  time_to_stop_default: -1,
  networking: {
    default: {
      protocol: 'http',
      port: 80,
      url: 'upstream.pods.tacc.develop.tapis.io',
    },
  },
  resources: {
    cpu_request: 250,
    cpu_limit: 2000,
    mem_request: 256,
    mem_limit: 3072,
    gpus: 0,
  },
} as Pods.PodResponseModel & { image?: string };
const Admin = () => {
  const { token, basePath } = usePodsConfig();
  const podsQuery = usePodsList();
  const pods = podsQuery.data?.result ?? [];
  const volumesQuery = useVolumesList();
  const volumes = volumesQuery.data?.result ?? [];

  const [selectedPodId, setSelectedPodId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState('');
  const [newLevel, setNewLevel] = useState('ADMIN');
  const [bundleBase, setBundleBase] = useState('');
  const [pgUser, setPgUser] = useState('fastapi_traefik');
  const [pgPassword, setPgPassword] = useState('fastapi_traefik');
  const [showPods] = useState(true);

  useEffect(() => {
    if (!selectedPodId && pods.length > 0) {
      setSelectedPodId(pods[0].pod_id);
    }
  }, [pods, selectedPodId]);

  const permissionsQuery = usePodPermissions(selectedPodId);
  const permissions = useMemo(
    () => parsePermissions(permissionsQuery.data?.result?.permissions),
    [permissionsQuery.data?.result?.permissions],
  );
  const addPermission = useAddPodPermission();
  const createPod = useCreatePod();
  const createVolume = useCreateVolume();
  const deletePod = useDeletePod();
  const deleteVolume = useDeleteVolume();
  const [deletingBase, setDeletingBase] = useState<string | null>(null);
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const waitForPodAvailable = async (podId: string, attempts = 24, delayMs = 5000) => {
    if (!basePath) throw new Error('Pods base URL is not configured.');
    if (!token) throw new Error('Missing Tapis access token.');

    for (let i = 0; i < attempts; i += 1) {
      try {
        const res = await fetch(`${basePath}/v3/pods/${encodeURIComponent(podId)}`, {
          headers: buildPodsHeaders(token),
        });
        if (res.ok) {
          const data = await res.json();
          const pod: Pods.PodResponseModel | undefined = data?.result;
          const statusContainer = pod?.status_container as { phase?: string } | undefined;
          const phase = statusContainer?.phase;
          const status = pod?.status;
          if (status === 'AVAILABLE' || phase === 'Running') {
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
      // eslint-disable-next-line no-await-in-loop
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
        const res = await fetch(`${basePath}/v3/volumes/${encodeURIComponent(volumeId)}`, {
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

  const groupedPods = useMemo(() => {
    return pods.reduce<Record<string, Pods.PodResponseModel[]>>((acc, pod) => {
      const base = deriveBaseName(pod.pod_id);
      if (!acc[base]) acc[base] = [];
      acc[base].push(pod);
      return acc;
    }, {});
  }, [pods]);

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

    const used =
      toNumber((volume as { used_bytes?: unknown }).used_bytes) ??
      toNumber((volume as { usage_bytes?: unknown }).usage_bytes) ??
      toNumber((volume as { used?: unknown }).used);
    const capacity =
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

  const upstreamBlueprints = useMemo(() => ({
    postgres: postgresBlueprint,
    api: apiBlueprint,
    app: uiBlueprint,
  }), []);

  const buildNewPodFromTemplate = (
    template: Pods.PodResponseModel & { image?: string },
    podId: string,
    base: string,
    volumeId: string,
    creds: { user: string; password: string }
  ): Pods.NewPod => {
    const newVolumeId = volumeId;

    const networking = template.networking
      ? Object.entries(template.networking).reduce<Record<string, Pods.Networking>>((acc, [key, net]) => {
          const cloned = { ...net };
          if (cloned.url) {
            cloned.url = replaceHostPrefix(cloned.url, podId);
          }
          acc[key] = cloned;
          return acc;
        }, {})
      : undefined;

    const volumeMounts = template.volume_mounts
      ? Object.entries(template.volume_mounts).reduce<Record<string, Pods.VolumeMount>>((acc, [key, vm]) => {
          const cloned = { ...vm };
          const newKey = replaceAll(key, deriveBaseName(key), `${base}volume`);
          acc[newKey] = cloned;
          return acc;
        }, {})
      : undefined;

    const env = template.environment_variables
      ? Object.entries(template.environment_variables as Record<string, string>).reduce<Record<string, string>>((acc, [k, v]) => {
          let val = String(v);
          const apiPort = template.networking?.default?.port;
          val = rewriteHostInUrl(val, base);
          val = replaceAll(val, 'disasterpostgres.pods.tacc.develop.tapis.io', `${base}postgres.pods.tacc.develop.tapis.io`);
          val = replaceAll(val, 'disasterpostgres.pods.tacc.tapis.io', `${base}postgres.pods.tacc.develop.tapis.io`);
          val = replaceAll(val, 'upstreamapi.pods.tacc.develop.tapis.io', `${base}api.pods.tacc.develop.tapis.io`);
          val = replaceAll(val, 'upstreamapi.pods.tacc.tapis.io', `${base}api.pods.tacc.develop.tapis.io`);
          val = replaceAll(val, 'upstream.pods.tacc.develop.tapis.io', `${base}.pods.tacc.develop.tapis.io`);
          val = replaceAll(val, 'upstream.pods.tacc.tapis.io', `${base}.pods.tacc.develop.tapis.io`);
          val = replaceAll(val, '.pods.tacc.tapis.io', '.pods.tacc.develop.tapis.io');
          if (k.toUpperCase().includes('UPSTREAM_API_URL') || k.toUpperCase().includes('API_BASE_URL')) {
            val = ensurePort(val, apiPort);
          }
          val = replaceAll(val, 'disasterpostgres', `${base}postgres`);
          val = replaceAll(val, 'upstreamapi', `${base}api`);
          val = replaceAll(val, 'upstream', `${base}`);
          val = replaceAll(val, 'disastervolume', newVolumeId);
          val = rewriteCreds(val, creds.user, creds.password);

          if (k === 'POSTGRES_USER') {
            acc[k] = creds.user;
            return acc;
          }
          if (k === 'POSTGRES_PASSWORD') {
            acc[k] = creds.password;
            return acc;
          }
          acc[k] = val;
          return acc;
        }, {})
      : undefined;

    const payload: Record<string, unknown> = {
      pod_id: podId,
      pod_template: template.pod_template || '',
      description: template.description,
      environment_variables: env,
      data_requests: template.data_requests,
      roles_required: template.roles_required,
      status_requested: 'ON',
      volume_mounts: volumeMounts,
      time_to_stop_default: template.time_to_stop_default,
      time_to_stop_instance: template.time_to_stop_instance,
      networking,
      resources: template.resources,
      command: template.command,
      arguments: template.arguments,
    };

    // Remove pod_template for custom images and forward the image when present.
    delete payload.pod_template;
    if ((template as { image?: string }).image) {
      payload.image = (template as { image?: string }).image;
    }

    return payload as unknown as Pods.NewPod;
  };

  const handleCreateBundle = async () => {
    const base = bundleBase.trim();
    if (!base) {
      alert('Please enter a base name.');
      return;
    }
    const baseLower = base.toLowerCase();
    const volumeId = sanitizeId(baseLower, 'volume');
    try {
      await createVolume.mutateAsync({
        volume_id: volumeId,
        description: `Volume for ${baseLower}`,
      });

      const pgId = `${baseLower}postgres`;
      await createPod.mutateAsync(
        buildNewPodFromTemplate(upstreamBlueprints.postgres, pgId, baseLower, volumeId, { user: pgUser, password: pgPassword })
      );

      // Wait for postgres pod to be up before creating API/UI
      await waitForPodAvailable(pgId);
      // Give the database a bit more time to finish init before API starts
      await waitExtra(60_000);

      await createPod.mutateAsync(
        buildNewPodFromTemplate(upstreamBlueprints.api, `${baseLower}api`, baseLower, volumeId, { user: pgUser, password: pgPassword })
      );

      await createPod.mutateAsync(
        buildNewPodFromTemplate(upstreamBlueprints.app, baseLower, baseLower, volumeId, { user: pgUser, password: pgPassword })
      );

      setSelectedPodId(`${baseLower}api`);
      setBundleBase('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create bundle';
      alert(message);
    }
  };

  const handleDeleteGroup = async (base: string, podsForBase: Pods.PodResponseModel[]) => {
    if (!podsForBase.length) return;
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

  return (
    <div className="mx-auto max-w-6xl p-6 sm:p-10 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">Admin</h1>
        <p className="text-sm text-gray-700">Pods you can access, with permissions for the selected pod.</p>
      </div>

      {!token && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
          Login via Tapis (or provide a Tapis token) to load your pods.
        </div>
      )}

      <section className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Create bundle (3 pods + 1 volume)</h3>
        <p className="text-sm text-gray-600">
          Uses embedded upstream blueprints (volume → postgres → api → ui). Enter a base name like
          <code className="mx-1 rounded bg-gray-100 px-1">sniffer</code> to create snifferpostgres, sniffer, snifferapi
          and a <code className="mx-1 rounded bg-gray-100 px-1">sniffer-volume</code>.
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Base name (e.g., sniffer)"
            value={bundleBase}
            onChange={(e) => setBundleBase(e.target.value)}
            className="flex-1 min-w-[200px] rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
            disabled={createPod.isPending || createVolume.isPending}
          />
          <input
            type="text"
            placeholder="Postgres username"
            value={pgUser}
            onChange={(e) => setPgUser(e.target.value)}
            className="min-w-[180px] rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
            disabled={createPod.isPending || createVolume.isPending}
          />
          <input
            type="password"
            placeholder="Postgres password"
            value={pgPassword}
            onChange={(e) => setPgPassword(e.target.value)}
            className="min-w-[180px] rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
            disabled={createPod.isPending || createVolume.isPending}
          />
          <button
            type="button"
            onClick={handleCreateBundle}
            className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            disabled={createPod.isPending || createVolume.isPending || !bundleBase.trim()}
          >
            {createPod.isPending || createVolume.isPending ? 'Creating…' : 'Create bundle'}
          </button>
        </div>
        {(createPod.isError || createVolume.isError) && (
          <div className="text-xs text-red-600">
            {(createPod.error as Error)?.message || (createVolume.error as Error)?.message || 'Failed to create bundle'}
          </div>
        )}
        {(createPod.isSuccess || createVolume.isSuccess) && (
          <div className="text-xs text-green-700">Bundle creation requested.</div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">Pods</h3>
            </div>
            <div className="text-xs text-gray-500">
              {podsQuery.isFetching ? 'Refreshing…' : podsQuery.isSuccess ? `${pods.length} pods` : ''}
            </div>
          </div>

          <div className="p-4">
            {podsQuery.isLoading && (
              <div className="p-4 text-sm text-gray-700">Loading pods…</div>
            )}
            {podsQuery.isError && (
              <div className="p-4 text-sm text-red-600">
                {(podsQuery.error as Error)?.message || 'Unable to load pods'}
              </div>
            )}
            {!podsQuery.isLoading && !podsQuery.isError && pods.length === 0 && (
              <div className="p-4 text-sm text-gray-700">No pods returned for this user.</div>
            )}

            {showPods && (
              <div className="space-y-2">
                {Object.entries(groupedPods).map(([base, podsForBase]) => {
                  const uiPod = podsForBase.find((p) => p.pod_id.toLowerCase() === base.toLowerCase());
                  const uiLink = uiPod ? buildLink(uiPod) : null;
                  return (
                    <details key={base} className="rounded border border-gray-100 bg-gray-50" open>
                      <summary className="cursor-pointer px-3 py-2 text-xs font-semibold uppercase text-gray-600">
                        {base || '(no base)'}
                      </summary>
                      <div className="flex items-center justify-between px-4 py-2">
                        {uiLink ? (
                          <a
                            href={uiLink}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            Open UI
                          </a>
                        ) : (
                          <span className="text-xs text-gray-500">No UI pod detected</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteGroup(base, podsForBase)}
                          className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                          disabled={deletePod.isPending || deletingBase === base}
                        >
                          {deletingBase === base ? 'Deleting…' : 'Delete group'}
                        </button>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {podsForBase.map((pod) => {
                          const isSelected = pod.pod_id === selectedPodId;
                          const link = buildLink(pod);
                          const volumeInfo = pod.pod_id.toLowerCase().includes('postgres')
                            ? findVolumeForPod(pod)
                            : null;
                          const volumeUsageText =
                            volumeInfo && volumesQuery.isSuccess
                              ? formatVolumeUsage(volumeInfo.volume as Pods.VolumeResponseModel)
                              : null;
                          return (
                            <button
                              key={pod.pod_id}
                              type="button"
                              onClick={() => setSelectedPodId(pod.pod_id)}
                              className={`w-full text-left transition ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                            >
                              <div className="px-4 py-3 space-y-2">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-base font-semibold text-gray-900">{pod.pod_id}</p>
                                    <p className="text-xs text-gray-600">{pod.description || 'Upstream UI frontend'}</p>
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

        <section className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Permissions</h3>
              <p className="text-sm text-gray-600">
                {selectedPodId ? `Access list for ${selectedPodId}` : 'Select a pod to view permissions.'}
              </p>
            </div>
            {selectedPodId && (
              <button
                type="button"
                className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                onClick={() => {
                  const pod = pods.find((p) => p.pod_id === selectedPodId);
                  const link = pod ? buildLink(pod) : null;
                  if (link) window.open(link, '_blank', 'noopener');
                }}
              >
                Open UI
              </button>
            )}
          </div>

          {!selectedPodId && (
            <div className="p-4 text-sm text-gray-700">Choose a pod from the list.</div>
          )}

          {selectedPodId && permissionsQuery.isLoading && (
            <div className="p-4 text-sm text-gray-700">Loading permissions…</div>
          )}

          {selectedPodId && permissionsQuery.isError && (
            <div className="p-4 text-sm text-red-600">
              {(permissionsQuery.error as Error)?.message || 'Unable to load permissions'}
            </div>
          )}

          {selectedPodId &&
            !permissionsQuery.isLoading &&
            !permissionsQuery.isError &&
            (permissions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {permissions.map((perm) => (
                  <div key={perm.raw} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{perm.user}</p>
                      <p className="text-xs text-gray-600 break-all">Raw: {perm.raw}</p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 uppercase tracking-wide">
                      {perm.level}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-sm text-gray-700">No permissions returned for this pod.</div>
            ))}

          {selectedPodId && (
            <div className="border-t border-gray-200 px-4 py-3 space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Add user permission</h4>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                  placeholder="Username"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
                  disabled={addPermission.isPending}
                />
                <select
                  value={newLevel}
                  onChange={(e) => setNewLevel(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500"
                  disabled={addPermission.isPending}
                >
                  <option value="READ">READ</option>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedPodId) return;
                    addPermission.mutate(
                      {
                        podId: selectedPodId,
                        user: newUser.trim(),
                        level: newLevel,
                      },
                      {
                        onSuccess: () => {
                          setNewUser('');
                        },
                      },
                    );
                  }}
                  className="inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  disabled={addPermission.isPending || !newUser.trim()}
                >
                  {addPermission.isPending ? 'Saving…' : 'Add user'}
                </button>
                {addPermission.isError && (
                  <div className="text-xs text-red-600">
                    {(addPermission.error as Error)?.message || 'Failed to add permission'}
                  </div>
                )}
                {addPermission.isSuccess && (
                  <div className="text-xs text-green-700">Permission added.</div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

    </div>
  );
};

export default Admin;
