import {
  createAttendance,
  getAttendance,
  getSingleEmployeeAttendance,
} from "@/Services/attendance";
import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";

const QUERY_KEYS = {
  ATTENDANCE_LIST: "attendance-list",
  ATTENDANCE_DETAILS: "attendance-list",
  EMPLOYEE_ATTENDANCE: "employee-attendance",
};

export const useCreateAttendanceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(createAttendance, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.ATTENDANCE_LIST]);
    },
  });
};

export const useAttendance = (filters?: Parameters<typeof getAttendance>[0]) =>
  useQuery([QUERY_KEYS.ATTENDANCE_LIST, filters], () => getAttendance(filters));

export const useEmployeeAttendance = (
  id: Parameters<typeof getSingleEmployeeAttendance>[0],
  options?: UseQueryOptions<unknown, unknown, any, string[]>
) =>
  useQuery(
    [QUERY_KEYS.EMPLOYEE_ATTENDANCE],
    () => getSingleEmployeeAttendance(id),
    {
      enabled: Boolean(id),
      ...options,
    }
  );
