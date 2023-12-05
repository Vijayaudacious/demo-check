import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addRole,
  deleteRole,
  editRole,
  getActions,
  roleDetail,
  roles,
} from "../Services/role";

const QUERY_KEYS = {
  ROLE_LIST: "role-list",
  ROLE_DETAILS: "role-details",
  ACTIONS: "role-actions",
};

export const useRoles = (filters: Parameters<typeof roles>[0]) =>
  useQuery([QUERY_KEYS.ROLE_LIST, JSON.stringify(filters)], () =>
    roles(filters)
  );

export const useRole = (id: Parameters<typeof roleDetail>[0]) =>
  useQuery([QUERY_KEYS.ROLE_DETAILS, id], () => roleDetail(id), {
    enabled: Boolean(id),
  });

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(addRole, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.ROLE_LIST]);
    },
  });
};

export const useUpdateRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(editRole, {
    onSuccess: (_: any, { id }) => {
      queryClient.invalidateQueries([QUERY_KEYS.ROLE_LIST]);
      queryClient.invalidateQueries([QUERY_KEYS.ROLE_DETAILS, id]);
    },
  });
};

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteRole, {
    onSuccess: (_: any, id) => {
      queryClient.invalidateQueries([QUERY_KEYS.ROLE_LIST]);
      queryClient.invalidateQueries([QUERY_KEYS.ROLE_DETAILS, id]);
    },
  });
};

export const useAllActions = () =>
  useQuery([QUERY_KEYS.ACTIONS], () => getActions());
