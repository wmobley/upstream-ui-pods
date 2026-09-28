import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Configuration } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';
import { describeApiError } from '../../utils/apiError';

interface UploadDataParams {
  campaignId: number;
  stationId: number;
  sensorFile?: File;
  measurementFile?: File;
  onProgress?: (progress: UploadProgress) => void;
}

export interface UploadAudit {
  measurement_rows_read?: number;
  measurement_values_attempted?: number;
  measurement_values_inserted?: number;
  measurement_values_skipped_duplicate?: number;
  sensor_alias_count?: number;
  row_errors?: string[];
}

export interface UploadChunkResult {
  upload_event_id?: number;
  upload_session_id?: string;
  finalized?: boolean;
  chunk_index?: number | null;
  total_chunks?: number | null;
  audit?: UploadAudit;
  post_processing?: {
    status?: string;
    statistics_refreshed?: boolean;
    station_geometry_refreshed?: boolean;
  };
  ckan_sync?: {
    status?: string;
    message?: string | null;
  };
  errors?: Array<{ message?: string } | string>;
  [key: string]: unknown;
}

interface UploadProgress {
  currentChunk: number;
  totalChunks: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
  warnings?: string[];
}

interface ChunkUploadOptions {
  campaignId: number;
  stationId: number;
  uploadSessionId: string;
  chunkIndex: number;
  totalChunks: number;
  finalize: boolean;
  sensorFile: Blob;
  measurementFile: Blob;
}

type UploadDiagnosticValue = string | number | boolean | null | undefined;

const CKAN_DIAGNOSTIC_STATUSES = [
  'scheduled',
  'completed',
  'authorization_failed',
  'retryable_failed',
  'missing_tapis_token',
  'ckan_disabled',
  'already_finalized',
  'skipped_incomplete_upload',
  'not_finalized',
] as const;

export const logUploadDiagnostic = (
  event: string,
  fields: Record<string, UploadDiagnosticValue> = {},
  level: 'info' | 'warn' = 'info',
) => {
  const payload = { event, ...fields };
  if (level === 'warn') {
    console.warn('[upload]', payload);
  } else {
    console.info('[upload]', payload);
  }
};

const diagnosticStatus = (value: unknown) =>
  typeof value === 'string' &&
  CKAN_DIAGNOSTIC_STATUSES.includes(
    value as (typeof CKAN_DIAGNOSTIC_STATUSES)[number],
  )
    ? value
    : 'unknown';

const finalizedDiagnosticState = (value: unknown) =>
  value === true ? 'true' : value === false ? 'false' : 'missing';

const elapsedMilliseconds = (startedAt: number) =>
  Math.round(performance.now() - startedAt);

const UPLOAD_ENDPOINT = '/api/v1/uploadfile_csv/campaign/{campaign_id}/station/{station_id}/sensor';

/** The upload endpoint returns 200 with a body of per-row problems (bad
 * dates, unknown aliases, etc.) rather than failing the whole request —
 * pull those out so they aren't silently dropped on an otherwise-"successful"
 * upload. */
function extractRowWarnings(result: UploadChunkResult): string[] {
  const errors = result?.errors;
  if (!Array.isArray(errors)) return [];
  return errors.map((e) => (typeof e === 'string' ? e : e?.message ?? JSON.stringify(e)));
}

// The generated OpenAPI client does not yet model the chunked-upload form
// fields (upload_session_id, chunk_index, total_chunks, finalize_upload), so
// the chunked path posts multipart form data directly via fetch. The generated
// client remains the fallback for legacy single-request uploads.
async function postUploadChunk(
  config: Configuration,
  options: ChunkUploadOptions,
): Promise<UploadChunkResult> {
  const { campaignId, stationId, uploadSessionId, chunkIndex, totalChunks, finalize, sensorFile, measurementFile } = options;

  const requestId = crypto.randomUUID();
  const formData = new FormData();
  formData.append('upload_file_sensors', sensorFile);
  formData.append('upload_file_measurements', measurementFile);
  formData.append('upload_session_id', uploadSessionId);
  formData.append('chunk_index', String(chunkIndex));
  formData.append('total_chunks', String(totalChunks));
  formData.append('finalize_upload', String(finalize));
  // Keep the correlation id in the existing multipart body so ingress and
  // the API can correlate a browser request without introducing a CORS
  // preflight-triggering custom header.
  formData.append('client_request_id', requestId);

  const path = UPLOAD_ENDPOINT
    .replace('{campaign_id}', encodeURIComponent(String(campaignId)))
    .replace('{station_id}', encodeURIComponent(String(stationId)));

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (config.headers) {
    Object.assign(headers, config.headers as Record<string, string>);
  }
  delete headers['Content-Type']; // fetch sets the multipart boundary

  const basePath = config.basePath?.replace(/\/+$/, '') || '';
  const startedAt = performance.now();
  logUploadDiagnostic('upload_request_started', {
    request_id: requestId,
    upload_session_id: uploadSessionId,
    chunk_index: chunkIndex,
    total_chunks: totalChunks,
    finalize_upload: finalize,
    sensor_bytes: sensorFile.size,
    measurement_bytes: measurementFile.size,
  });

  let response: Response;
  try {
    response = await fetch(`${basePath}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    });
  } catch {
    logUploadDiagnostic(
      'upload_request_failed',
      {
        request_id: requestId,
        upload_session_id: uploadSessionId,
        chunk_index: chunkIndex,
        total_chunks: totalChunks,
        failure: 'network_or_abort',
        response_available: false,
        duration_ms: elapsedMilliseconds(startedAt),
      },
      'warn',
    );
    throw new Error('Upload request failed before the server returned a response.');
  }

  if (!response.ok) {
    logUploadDiagnostic(
      'upload_request_failed',
      {
        request_id: requestId,
        upload_session_id: uploadSessionId,
        chunk_index: chunkIndex,
        total_chunks: totalChunks,
        failure: 'http_error',
        response_available: true,
        http_status: response.status,
        duration_ms: elapsedMilliseconds(startedAt),
      },
      'warn',
    );
    let detail = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      detail = typeof body?.detail === 'string' ? body.detail : detail;
    } catch {
      // keep the status-based message
    }
    throw new Error(detail);
  }

  let result: UploadChunkResult;
  try {
    result = (await response.json()) as UploadChunkResult;
  } catch {
    logUploadDiagnostic(
      'upload_request_failed',
      {
        request_id: requestId,
        upload_session_id: uploadSessionId,
        chunk_index: chunkIndex,
        total_chunks: totalChunks,
        failure: 'invalid_json_response',
        response_available: true,
        http_status: response.status,
        duration_ms: elapsedMilliseconds(startedAt),
      },
      'warn',
    );
    throw new Error('Upload response was not valid JSON.');
  }

  logUploadDiagnostic('upload_request_finished', {
    request_id: requestId,
    upload_session_id: uploadSessionId,
    upload_event_id:
      typeof result.upload_event_id === 'number' ? result.upload_event_id : null,
    chunk_index: chunkIndex,
    total_chunks: totalChunks,
    http_status: response.status,
    finalized: finalizedDiagnosticState(result.finalized),
    ckan_sync_status: diagnosticStatus(result.ckan_sync?.status),
    duration_ms: elapsedMilliseconds(startedAt),
  });

  return result;
}

// Target size per uploaded chunk. Byte-based rather than a fixed line count
// so chunk size stays predictable regardless of how many columns a CSV has.
export const TARGET_CHUNK_BYTES = 1_000_000; // ~1MB of CSV data per chunk

const splitCSVIntoChunks = async (file: File): Promise<Blob[]> => {
  const text = await file.text();
  const lines = text.split('\n');
  const header = lines[0];
  const dataLines = lines.slice(1).filter((line) => line.length > 0);
  const chunks: Blob[] = [];
  const encoder = new TextEncoder();

  let currentLines: string[] = [];
  let currentBytes = 0;

  const flush = () => {
    if (currentLines.length === 0) return;
    const chunkContent = [header, ...currentLines].join('\n');
    chunks.push(new Blob([chunkContent], { type: 'text/csv' }));
    currentLines = [];
    currentBytes = 0;
  };

  for (const line of dataLines) {
    const lineBytes = encoder.encode(line).length + 1; // +1 for the joining newline
    if (currentLines.length > 0 && currentBytes + lineBytes > TARGET_CHUNK_BYTES) {
      flush();
    }
    currentLines.push(line);
    currentBytes += lineBytes;
  }
  flush();

  return chunks;
};

// Create an empty blob for when we don't have a file
const createEmptyBlob = () => new Blob([''], { type: 'text/csv' });

export const useUploadData = () => {
  const config = useConfiguration();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      stationId,
      sensorFile,
      measurementFile,
      onProgress,
    }: UploadDataParams) => {
      if (!sensorFile && !measurementFile) {
        logUploadDiagnostic(
          'upload_submit_rejected',
          {
            campaign_id: campaignId,
            station_id: stationId,
            reason: 'no_file_selected',
          },
          'warn',
        );
        throw new Error('At least one file must be provided');
      }

      let uploadSessionId: string;
      try {
        uploadSessionId = crypto.randomUUID();
      } catch {
        logUploadDiagnostic(
          'upload_preflight_failed',
          {
            campaign_id: campaignId,
            station_id: stationId,
            failure: 'session_id_generation',
          },
          'warn',
        );
        throw new Error('Could not start the upload session.');
      }

      logUploadDiagnostic('upload_submit_started', {
        campaign_id: campaignId,
        station_id: stationId,
        upload_session_id: uploadSessionId,
        sensor_file_selected: Boolean(sensorFile),
        measurement_file_selected: Boolean(measurementFile),
        sensor_bytes: sensorFile?.size ?? 0,
        measurement_bytes: measurementFile?.size ?? 0,
      });

      const warnings: string[] = [];
      const aggregateAudit: UploadAudit = {};
      let finalized = false;

      // If we have a measurement file, split it into chunks and upload sequentially.
      // All chunks share one upload_session_id; only the last chunk is marked
      // finalize_upload=true so post-processing runs exactly once server-side.
      if (measurementFile) {
        let chunks: Blob[];
        try {
          chunks = await splitCSVIntoChunks(measurementFile);
        } catch {
          logUploadDiagnostic(
            'upload_preflight_failed',
            {
              campaign_id: campaignId,
              station_id: stationId,
              upload_session_id: uploadSessionId,
              failure: 'measurement_file_read_or_chunking',
            },
            'warn',
          );
          throw new Error('Could not read the measurement file.');
        }
        logUploadDiagnostic('upload_chunks_prepared', {
          campaign_id: campaignId,
          station_id: stationId,
          upload_session_id: uploadSessionId,
          total_chunks: chunks.length,
          measurement_bytes: measurementFile.size,
        });

        for (let i = 0; i < chunks.length; i++) {
          onProgress?.({
            currentChunk: i,
            totalChunks: chunks.length,
            status: 'uploading',
          });

          try {
            const result = await postUploadChunk(config, {
              campaignId,
              stationId,
              uploadSessionId,
              chunkIndex: i,
              totalChunks: chunks.length,
              finalize: i === chunks.length - 1,
              sensorFile: (sensorFile as Blob) || createEmptyBlob(),
              measurementFile: chunks[i],
            });

            warnings.push(...extractRowWarnings(result));
            aggregateAudit.measurement_rows_read =
              (aggregateAudit.measurement_rows_read ?? 0) + (result.audit?.measurement_rows_read ?? 0);
            aggregateAudit.measurement_values_attempted =
              (aggregateAudit.measurement_values_attempted ?? 0) + (result.audit?.measurement_values_attempted ?? 0);
            aggregateAudit.measurement_values_inserted =
              (aggregateAudit.measurement_values_inserted ?? 0) + (result.audit?.measurement_values_inserted ?? 0);
            aggregateAudit.measurement_values_skipped_duplicate =
              (aggregateAudit.measurement_values_skipped_duplicate ?? 0) + (result.audit?.measurement_values_skipped_duplicate ?? 0);
            finalized = result.finalized === true;
          } catch (error) {
            const message = await describeApiError(error);
            onProgress?.({
              currentChunk: i,
              totalChunks: chunks.length,
              status: 'error',
              error: message,
            });
            throw new Error(message);
          }
        }

        onProgress?.({
          currentChunk: chunks.length,
          totalChunks: chunks.length,
          status: 'complete',
          warnings,
        });
      } else if (sensorFile) {
        // If we only have a sensor file, upload it with an empty measurement file.
        // A single-chunk session with finalize_upload=true is equivalent to the
        // legacy single-request upload.
        onProgress?.({
          currentChunk: 0,
          totalChunks: 1,
          status: 'uploading',
        });

        try {
          const result = await postUploadChunk(config, {
            campaignId,
            stationId,
            uploadSessionId,
            chunkIndex: 0,
            totalChunks: 1,
            finalize: true,
            sensorFile: sensorFile as Blob,
            measurementFile: createEmptyBlob(),
          });
          warnings.push(...extractRowWarnings(result));
          aggregateAudit.measurement_values_inserted =
            (aggregateAudit.measurement_values_inserted ?? 0) + (result.audit?.measurement_values_inserted ?? 0);
          finalized = result.finalized === true;

          onProgress?.({
            currentChunk: 1,
            totalChunks: 1,
            status: 'complete',
            warnings,
          });
        } catch (error) {
          const message = await describeApiError(error);
          onProgress?.({
            currentChunk: 0,
            totalChunks: 1,
            status: 'error',
            error: message,
          });
          throw new Error(message);
        }
      }

      logUploadDiagnostic('upload_submit_finished', {
        campaign_id: campaignId,
        station_id: stationId,
        upload_session_id: uploadSessionId,
        finalized: finalizedDiagnosticState(finalized),
        inserted_values: aggregateAudit.measurement_values_inserted ?? 0,
        warning_count: warnings.length,
      });
      return { success: true, warnings, audit: aggregateAudit, finalized };
    },
    onSuccess: (_, variables) => {
      // Invalidate station detail query
      queryClient.invalidateQueries({
        queryKey: [
          'station',
          variables.campaignId.toString(),
          variables.stationId.toString(),
        ],
      });

      // Invalidate all sensor queries for this station
      queryClient.invalidateQueries({
        queryKey: ['sensors'],
      });
    },
  });
};
