import {
  addDocument,
  addUser,
  createEmployee,
  deleteDocument,
  editUser,
  removeDocument,
  salaryCalculations,
  updateDocument,
  updateEmployee,
  userDetail,
  users,
} from "@/Services/Users";
import { isUUID } from "@/Utils/generic";
import { useMutation, useQuery, useQueryClient } from "react-query";

const QUERY_KEYS = {
  USER_DETAILS: "user-details",
  USERS: "all-users",
};

export const useUser = (id: string) =>
  useQuery([QUERY_KEYS.USER_DETAILS, { id }], () => userDetail(id), {
    enabled: Boolean(id) && isUUID(id),
  });

export const useUsers = (filters: Parameters<typeof users>[0]) =>
  useQuery([QUERY_KEYS.USERS, filters], () => users(filters));

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(addUser, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.USERS]);
    },
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(editUser, {
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries([QUERY_KEYS.USERS]);
      queryClient.invalidateQueries([QUERY_KEYS.USER_DETAILS, { id }], {
        refetchInactive: true,
      });
    },
  });
};

export const useDeleteDocumentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteDocument, {
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries([QUERY_KEYS.USERS]);
      queryClient.invalidateQueries([QUERY_KEYS.USER_DETAILS, { id }], {
        refetchInactive: true,
      });
    },
  });
};

export const useCreateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(createEmployee, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.USERS]);
    },
  });
};

export const useUpdateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateEmployee, {
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries([QUERY_KEYS.USERS]);
      queryClient.invalidateQueries([QUERY_KEYS.USER_DETAILS, { id }], {
        refetchInactive: true,
      });
    },
  });
};

export const useAddDocumentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(addDocument, {
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries([QUERY_KEYS.USERS]);
      queryClient.invalidateQueries([QUERY_KEYS.USER_DETAILS, { id }], {
        refetchInactive: true,
      });
    },
  });
};

export const useRemoveDocumentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(removeDocument, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.USER_DETAILS]);
      queryClient.invalidateQueries([QUERY_KEYS.USERS]);
    },
  });
};

export const useUpdateDocumentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateDocument, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.USER_DETAILS]);
      queryClient.invalidateQueries([QUERY_KEYS.USERS]);
    },
  });
};

export const useSalaryCalculation = () => {
  const queryClient = useQueryClient();
  return useMutation(salaryCalculations);
};
