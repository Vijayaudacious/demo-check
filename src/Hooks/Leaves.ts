import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  leaveApproved,
  listLeave,
  removeLeave,
  showLeave,
  userLeave,
} from "@/Services/Leaves";

export const LEAVES_QUERY_KEYS = {
  SINGLE_EMPLOYEE_LEAVE_DETAILS: "single-employee-leave-details",
  LEAVES_LIST: "leaves-list",
  LEAVES_BY_USER: "leaves-by-user",
};

export const useLeaves = (filters: Parameters<typeof listLeave>[0]) =>
  useQuery([LEAVES_QUERY_KEYS.LEAVES_LIST, filters], () => listLeave(filters));

export const useLeavesByUser = (userId: string) =>
  useQuery([LEAVES_QUERY_KEYS.LEAVES_BY_USER, userId], () => userLeave(userId), {
    enabled: Boolean(userId),
  });

export const useGetLeaveEmloyeeDetails = () => {
  const queryClient = useQueryClient();
  return useMutation(showLeave, {
    onSuccess: () => {
      queryClient.refetchQueries([LEAVES_QUERY_KEYS.SINGLE_EMPLOYEE_LEAVE_DETAILS]);
    },
  });
};

export const useApproveRejectLeave = () => {
  const queryClient = useQueryClient();
  return useMutation(leaveApproved, {
    onSuccess: () => {
      queryClient.refetchQueries([LEAVES_QUERY_KEYS.SINGLE_EMPLOYEE_LEAVE_DETAILS]);
    },
  });
};

export const useRemoveLeaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(removeLeave, {
    onSuccess: () => {
      queryClient.refetchQueries([LEAVES_QUERY_KEYS.SINGLE_EMPLOYEE_LEAVE_DETAILS]);
    },
  });
};
