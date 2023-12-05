import { Category } from "@/Types/Categories";
import { Filters } from "@/Types/Project";
import { apiCaller } from "@/Utils/RestApi";

export const getCategories = async ({
  search,
  currentPage,
  limit,
  field,
  sortBy,
}: Filters): Promise<{ data: Category[]; totalRecords: number }> =>
  (
    await apiCaller(
      `/`,
      {
        search,
        currentPage,
        limit,
        field,
        sortBy,
      },
      "GET",
      undefined,
      "income-expenses/categories"
    )
  ).data;

export const deleteCategory = (id: string) =>
  apiCaller(
    `/${id}`,
    undefined,
    "DELETE",
    undefined,
    "income-expenses/categories"
  );
export const createCategory = (data: Category) =>
  apiCaller(`/`, data, "POST", undefined, "income-expenses/categories");

export const updateCategory = ({ id, data }: { id: string; data: Category }) =>
  apiCaller(`/${id}`, data, "PATCH", undefined, "income-expenses/categories");

export const getCategory = async (
  id: string
): Promise<{
  name: string;
  data: Category;
}> =>
  (
    await apiCaller(
      `/${id}`,
      undefined,
      "GET",
      undefined,
      "income-expenses/categories"
    )
  ).data;
