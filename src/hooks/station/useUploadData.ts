import { useMutation } from '@tanstack/react-query';
import { UploadfileCsvApi } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

interface UploadDataParams {
  campaignId: number;
  stationId: number;
  sensorFile?: File;
  measurementFile?: File;
}

export const useUploadData = () => {
  const config = useConfiguration();
  const uploadfileCsvApi = new UploadfileCsvApi(config);
  return useMutation({
    mutationFn: async ({
      campaignId,
      stationId,
      sensorFile,
      measurementFile,
    }: UploadDataParams) => {
      if (!sensorFile && !measurementFile) {
        throw new Error('At least one file must be provided');
      }

      const response =
        await uploadfileCsvApi.postSensorAndMeasurementApiV1UploadfileCsvCampaignCampaignIdStationStationIdSensorPost(
          {
            campaignId,
            stationId,
            uploadFileSensors: sensorFile as Blob,
            uploadFileMeasurements: measurementFile as Blob,
          },
        );

      return response;
    },
  });
};
