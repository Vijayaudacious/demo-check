import {
  createReport,
  getReport,
  getReports,
  removeReport,
  updateReport,
  updateReportStatus,
} from "@/Services/report";
import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

const QUERY_KEYS = {
  REPORTS_LIST: "reports-list",
  REPORTS_DETAILS: "reports-list",
};

export const useReports = (filters: Parameters<typeof getReports>[0]) =>
  useQuery([QUERY_KEYS.REPORTS_LIST, filters], () => getReports(filters));

export const useReport = (
  id: Parameters<typeof getReport>[0],
  options?: UseQueryOptions<unknown, unknown, any, string[]>
) =>
  useQuery([QUERY_KEYS.REPORTS_DETAILS], () => getReport(id), {
    enabled: Boolean(id),
    ...options,
  });

export const useRemoveReportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(removeReport, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.REPORTS_LIST]);
    },
  });
};

export const useCreateReportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(createReport, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.REPORTS_LIST]);
    },
  });
};

export const useUpdateReporttMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateReport, {
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries([QUERY_KEYS.REPORTS_LIST]);
      queryClient.invalidateQueries([QUERY_KEYS.REPORTS_DETAILS, { id }]);
    },
  });
};

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();
  return useMutation(updateReportStatus, {
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries([QUERY_KEYS.REPORTS_LIST]);
      queryClient.invalidateQueries([QUERY_KEYS.REPORTS_DETAILS, { id }]);
    },
  });
};
