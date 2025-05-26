import { useMutation } from '@tanstack/react-query';
import { UploadfileCsvApi } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

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

  return useMutation({
    mutationFn: async ({
      campaignId,
      stationId,
      sensorFile,
      measurementFile,
      onProgress,
    }: UploadDataParams) => {
      if (!sensorFile && !measurementFile) {
        throw new Error('At least one file must be provided');
      }

      // If we have a measurement file, split it into chunks and upload sequentially
      if (measurementFile) {
        const chunks = await splitCSVIntoChunks(measurementFile);

        for (let i = 0; i < chunks.length; i++) {
          onProgress?.({
            currentChunk: i,
            status: 'uploading',
          });

          try {
            await uploadfileCsvApi.postSensorAndMeasurementApiV1UploadfileCsvCampaignCampaignIdStationStationIdSensorPost(
              {
                campaignId,
                stationId,
                uploadFileSensors: (sensorFile as Blob) || createEmptyBlob(),
                uploadFileMeasurements: chunks[i],
              },
            );
          } catch (error) {
            onProgress?.({
              currentChunk: i,
              status: 'error',
              error: error instanceof Error ? error.message : 'Upload failed',
            });
            throw error;
          }
        }

        onProgress?.({
          currentChunk: chunks.length,
          status: 'complete',
        });
      } else if (sensorFile) {
        // If we only have a sensor file, upload it with an empty measurement file
        onProgress?.({
          currentChunk: 0,
          status: 'uploading',
        });

        try {
          await uploadfileCsvApi.postSensorAndMeasurementApiV1UploadfileCsvCampaignCampaignIdStationStationIdSensorPost(
            {
              campaignId,
              stationId,
              uploadFileSensors: sensorFile as Blob,
              uploadFileMeasurements: createEmptyBlob(),
            },
          );

          onProgress?.({
            currentChunk: 1,
            status: 'complete',
          });
        } catch (error) {
          onProgress?.({
            currentChunk: 0,
            status: 'error',
            error: error instanceof Error ? error.message : 'Upload failed',
          });
          throw error;
        }
      }

      return { success: true };
    },
  });
};
