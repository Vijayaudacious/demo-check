import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
} from "@/Services/categories";
import { useMutation, useQuery, useQueryClient } from "react-query";

const QUERY_KEYS = {
  CATEGORIES_LIST: "categories-list",
};

export const useCategories = (filters: Parameters<typeof getCategories>[0]) =>
  useQuery([QUERY_KEYS.CATEGORIES_LIST, JSON.stringify(filters)], () =>
    getCategories(filters)
  );

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(createCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.CATEGORIES_LIST]);
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateCategory, {
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries([QUERY_KEYS.CATEGORIES_LIST]);
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.CATEGORIES_LIST]);
    },
  });
};

export const useCategory = (id: Parameters<typeof getCategory>[0]) =>
  useQuery([QUERY_KEYS.CATEGORIES_LIST, id], () => getCategory(id), {
    enabled: Boolean(id),
  });
