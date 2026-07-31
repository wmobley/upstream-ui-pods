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

export const LINES_PER_CHUNK = 100; // Number of lines per chunk

const splitCSVIntoChunks = async (file: File): Promise<Blob[]> => {
  const text = await file.text();
  const lines = text.split('\n');
  const header = lines[0];
  const dataLines = lines.slice(1);
  const chunks: Blob[] = [];

  // Split data lines into chunks
  for (let i = 0; i < dataLines.length; i += LINES_PER_CHUNK) {
    const chunkLines = dataLines.slice(i, i + LINES_PER_CHUNK);
    // Include header in each chunk
    const chunkContent = [header, ...chunkLines].join('\n');
    chunks.push(new Blob([chunkContent], { type: 'text/csv' }));
  }

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
              status: 'error',
              error: message,
            });
            throw new Error(message);
          }
        }

        onProgress?.({
          currentChunk: chunks.length,
          status: 'complete',
          warnings,
        });
      } else if (sensorFile) {
        // If we only have a sensor file, upload it with an empty measurement file
        onProgress?.({
          currentChunk: 0,
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
            status: 'complete',
            warnings,
          });
        } catch (error) {
          const message = await describeApiError(error);
          onProgress?.({
            currentChunk: 0,
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
