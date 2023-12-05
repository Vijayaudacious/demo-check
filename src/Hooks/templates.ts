import {
  createSalaryTemplate,
  deleteSalaryTemplate,
  salaryTemplate,
  salaryTemplates,
  updateSalaryTemplate,
} from "@/Services/payroll";
import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

const QUERY_KEYS = {
  TEMPLATES: "all-templates",
};

export const useSalaryTemplates = (
  filters: Parameters<typeof salaryTemplates>[0]
) => useQuery([QUERY_KEYS.TEMPLATES, filters], () => salaryTemplates(filters));

export const useSalaryTemplate = (
  id: Parameters<typeof salaryTemplate>[0],
  options?: UseQueryOptions<unknown, unknown, any, string[]>
) =>
  useQuery([QUERY_KEYS.TEMPLATES, id], () => salaryTemplate(id), {
    enabled: Boolean(id),
    ...options,
  });

export const useDeleteSalaryTemplateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteSalaryTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.TEMPLATES]);
    },
  });
};

export const useCreateSalaryTemplateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(createSalaryTemplate, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.TEMPLATES]);
    },
  });
};

export const useUpdateSalaryTemplateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateSalaryTemplate, {
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries([QUERY_KEYS.TEMPLATES]);
    },
  });
};
