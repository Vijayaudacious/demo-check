import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import {
  createProject,
  getProject,
  getProjects,
  removeProject,
  updateProject,
} from "../Services/project";

const QUERY_KEYS = {
  PROJECTS_LIST: "projects-list",
  PROJECTS_DETAILS: "project-details",
};

export const useProjects = (filters: Parameters<typeof getProjects>[0]) =>
  useQuery([QUERY_KEYS.PROJECTS_LIST, filters], () => getProjects(filters));

export const useProject = (
  id: Parameters<typeof getProject>[0],
  options?: UseQueryOptions<unknown, unknown, any, string[]>
) =>
  useQuery([QUERY_KEYS.PROJECTS_DETAILS], () => getProject(id), {
    enabled: Boolean(id),
    ...options,
  });

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(createProject, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.PROJECTS_LIST]);
    },
  });
};

export const useRemoveProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(removeProject, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.PROJECTS_LIST]);
    },
  });
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateProject, {
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries([QUERY_KEYS.PROJECTS_LIST]);
      queryClient.invalidateQueries([QUERY_KEYS.PROJECTS_DETAILS, { id }]);
    },
  });
};
