import { useQuery } from '@tanstack/react-query';
import { ProjectsApi, PyTASProject } from '@upstream/upstream-api';
import useConfiguration from '../api/useConfiguration';

export const useList = () => {
  const config = useConfiguration();
  const projectsApi = new ProjectsApi(config);

  return useQuery<PyTASProject[], Error>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await projectsApi.getProjectsApiV1ProjectsGet();
      return response;
    },
  });
};