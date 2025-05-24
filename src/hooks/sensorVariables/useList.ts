import { useQuery } from '@tanstack/react-query';
import { SensorVariablesApi } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

interface UseVariablesReturn {
  variables: string[];
  isLoading: boolean;
  error: Error | null;
}

export const useList = (): UseVariablesReturn => {
  const config = useConfiguration();
  const sensorVariablesApi = new SensorVariablesApi(config);

  const {
    data: variables = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['sensorVariables'],
    queryFn: async () => {
      const response =
        await sensorVariablesApi.listSensorVariablesApiV1SensorVariablesGet();
      return response.filter((variable) => variable !== null);
    },
  });

  return { variables, isLoading, error: error as Error | null };
};

export default useList;
