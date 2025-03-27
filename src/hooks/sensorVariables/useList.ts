import { useState, useEffect } from 'react';
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
  const [variables, setVariables] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchVariables = async () => {
      try {
        const response =
          await sensorVariablesApi.listSensorVariablesApiV1SensorVariablesGet();
        setVariables(response.filter((variable) => variable !== null));
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Unknown error occurred'),
        );
      } finally {
        setLoading(false);
      }
    };
    fetchVariables();
  }, []);

  return { variables, isLoading, error };
};

export default useList;
