import { Filters } from "@/Types/Project";
import { Role } from "@/Types/Role";
import { apiCaller } from "../Utils/RestApi";

export const roles = async ({
  search,
  currentPage,
  limit,
  field,
  sortBy,
}: Filters): Promise<{ data: any[]; totalRecords: number }> =>
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
      "roles"
    )
  ).data;

export const addRole = ({
  name,
  description,
  permission,
}: {
  name: string;
  description: string;
  permission: any;
}): Promise<{ token: string }> =>
  apiCaller(
    `/`,
    {
      name,
      description,
      permission,
    },
    "post",
    undefined,
    "roles"
  );

export const roleDetail = async (id: string): Promise<{ data: Role }> =>
  (await apiCaller(`/${id}`, undefined, "GET", undefined, "roles")).data;

export const deleteRole = (id: string | number): Promise<{}> =>
  apiCaller(`/${id}`, undefined, "DELETE", undefined, "roles");

export const editRole = ({
  id,
  formData,
}: {
  id: string;
  formData: object;
}): Promise<{}> => apiCaller(`/${id}`, formData, "PATCH", undefined, "roles");

export const getActions = async (): Promise<
  Record<string, Record<string, number>>
> => (await apiCaller("/actions", undefined, "GET", undefined, "roles")).data;
