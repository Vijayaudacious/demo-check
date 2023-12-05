import {
  addFeedbackUser,
  chanagePassword,
  deleteFeedback,
  deleteProfileImage,
  editFeedbackUser,
  feedback,
  getManagers,
  getSingleFeedback,
  profileImage,
  userDetail,
  userEditDetail,
} from "@/Services/Users";
import { isUUID } from "@/Utils/generic";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const QUERY_KEYS = {
  USER_DATA: "userData",
  DELETE_PROFILE_IMAGE: "delete_profile_image",
  PROFILE_IMAGE: "profile_image",
  CHANAGE_PASSWORD: "change_password",
  USER_EDIT: "user_edit",
  USER_DETAILS: "user_details",
  CREATE_FEEDBACK: "create-feedback",
  UPDATE_FEEDBACK: "update-feedback",
  FEEDBACK_LIST: "feedback-list",
  SINGLE_FEEDBACK: "single-feedback",
  MANAGERS: "mangers",
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation(chanagePassword, {
    onSuccess: () => {
      queryClient.refetchQueries([QUERY_KEYS.CHANAGE_PASSWORD]);
    },
  });
};

export const useUserEditDetail = () => {
  const queryClient = useQueryClient();
  return useMutation(userEditDetail, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.USER_EDIT]);
      queryClient.invalidateQueries([QUERY_KEYS.USER_DATA]);
    },
  });
};

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation(profileImage, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.PROFILE_IMAGE]);
      queryClient.invalidateQueries([QUERY_KEYS.USER_DATA]);
    },
  });
};

export const useUserDetails = (id?: string) =>
  useQuery([QUERY_KEYS.USER_DETAILS], () => userDetail(id), {
    enabled: Boolean(isUUID(id || "")),
  });

export const useGetManagers = () =>
  useQuery([QUERY_KEYS.MANAGERS], () => getManagers());

export const useDeleteProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteProfileImage, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.DELETE_PROFILE_IMAGE]);
      queryClient.invalidateQueries([QUERY_KEYS.USER_DATA]);
    },
  });
};

export const useFeedback = (
  userId?: string,
  page?: string,
  size?: string,
  startDate?: string,
  endDate?: string
) => {
  const { isLoading, data, refetch } = useQuery(
    [QUERY_KEYS.FEEDBACK_LIST, userId, page, size, startDate, endDate],
    () =>
      feedback({
        id: userId || "",
        currentPage: String(page),
        limit: size,
        startDate,
        endDate,
      }),
    {
      enabled: Boolean(userId),
    }
  );

  useEffect(() => {
    refetch();
  }, [userId, page, size, startDate, endDate, refetch]);

  return { isLoading, data };
};

export const useCreateFeedbackMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(addFeedbackUser, {
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries([QUERY_KEYS.CREATE_FEEDBACK, { id }]);
    },
  });
};

export const useUpdateFeedbackMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(editFeedbackUser, {
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(QUERY_KEYS.FEEDBACK_LIST);
      queryClient.invalidateQueries([QUERY_KEYS.UPDATE_FEEDBACK, { id }]);
    },
  });
};

export const UseGetSingleFeedback = (id: string) =>
  useQuery([QUERY_KEYS.SINGLE_FEEDBACK], () => getSingleFeedback(id), {
    enabled: Boolean(id),
  });

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteFeedback, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.FEEDBACK_LIST]);
    },
  });
};
