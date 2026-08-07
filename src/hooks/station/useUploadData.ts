import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UploadfileCsvApi } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';
import { describeApiError } from '../../utils/apiError';

interface UploadDataParams {
  campaignId: number;
  stationId: number;
  sensorFile?: File;
  measurementFile?: File;
  onProgress?: (progress: UploadProgress) => void;
}

interface UploadProgress {
  currentChunk: number;
  totalChunks: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
  warnings?: string[];
}

/** The upload endpoint returns 200 with a body of per-row problems (bad
 * dates, unknown aliases, etc.) rather than failing the whole request —
 * pull those out so they aren't silently dropped on an otherwise-"successful"
 * upload. */
function extractRowWarnings(result: unknown): string[] {
  const errors = (result as { errors?: Array<{ message?: string } | string> } | undefined)?.errors;
  if (!Array.isArray(errors)) return [];
  return errors.map((e) => (typeof e === 'string' ? e : e?.message ?? JSON.stringify(e)));
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
  const uploadfileCsvApi = new UploadfileCsvApi(config);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      campaignId,
      stationId,
      sensorFile,
      measurementFile,
      onProgress,
    }: UploadDataParams) => {
      console.log('this is going invalidated', campaignId, stationId);
      if (!sensorFile && !measurementFile) {
        throw new Error('At least one file must be provided');
      }

      const warnings: string[] = [];

      // If we have a measurement file, split it into chunks and upload sequentially
      if (measurementFile) {
        const chunks = await splitCSVIntoChunks(measurementFile);

        for (let i = 0; i < chunks.length; i++) {
          onProgress?.({
            currentChunk: i,
            totalChunks: chunks.length,
            status: 'uploading',
          });

          try {
            const result =
              await uploadfileCsvApi.postSensorAndMeasurementApiV1UploadfileCsvCampaignCampaignIdStationStationIdSensorPost(
                {
                  campaignId,
                  stationId,
                  uploadFileSensors: (sensorFile as Blob) || createEmptyBlob(),
                  uploadFileMeasurements: chunks[i],
                },
              );
            warnings.push(...extractRowWarnings(result));
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
        // If we only have a sensor file, upload it with an empty measurement file
        onProgress?.({
          currentChunk: 0,
          totalChunks: 1,
          status: 'uploading',
        });

        try {
          const result =
            await uploadfileCsvApi.postSensorAndMeasurementApiV1UploadfileCsvCampaignCampaignIdStationStationIdSensorPost(
              {
                campaignId,
                stationId,
                uploadFileSensors: sensorFile as Blob,
                uploadFileMeasurements: createEmptyBlob(),
              },
            );
          warnings.push(...extractRowWarnings(result));

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

      return { success: true, warnings };
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
