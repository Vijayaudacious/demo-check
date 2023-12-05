import { Calculations, CreateEmployee, Employee } from "@/Types/Employee";
import { FeedbackType } from "@/Types/Feedback";
import { Filters } from "@/Types/Project";
import { AxiosResponse } from "axios";
import querystring from "querystring";
import { PythonApiCaller, apiCaller } from "../Utils/RestApi";

export const users = async ({
  action = "active",
  search,
  currentPage,
  limit,
  field,
  sortBy,
  fromDate,
  toDate,
  gender,
  login,
  createdAt,
  joiningDate,
  roles,
}: Filters): Promise<{ data: Employee[]; totalRecords: number }> =>
  (
    await apiCaller(
      `/?status=${
        action === "deleted" ? "inactive" : "active"
      }&action=${action}?${querystring.stringify({
        action,
        search,
        currentPage,
        limit,
        field,
        sortBy,
        fromDate,
        toDate,
        gender,
        login,
        createdAt,
        joiningDate,
        roles,
      })}`,
      undefined,
      "GET",
      undefined,
      "user"
    )
  ).data;

export const usersTotalCount = (): Promise<{}> =>
  apiCaller(`/`, undefined, "GET", undefined, "user");

export const addUser = (formData: object): Promise<{}> =>
  apiCaller(`/`, formData, "POST", undefined, "user");

export const deleteDocument = ({
  id,
  documentId,
}: {
  id: string | number;
  documentId: { docId: string | number };
}): Promise<{}> =>
  apiCaller(`/doc/${id}`, documentId, "DELETE", undefined, "user");

export const editDocument = (
  editingFileIndex: string | number,
  formData: object
): Promise<{}> =>
  apiCaller(`/doc/${editingFileIndex}`, formData, "PUT", undefined, "user");

export const editUser = ({
  id,
  formData,
}: {
  id: string;
  formData: object;
}): Promise<void> => apiCaller(`/${id}`, formData, "PUT", undefined, "user");

export const userDetail = (
  id: string | undefined
): Promise<AxiosResponse<any>> =>
  apiCaller(`/${id}`, undefined, "GET", undefined, "user");

export const resetPassword = (id: string): Promise<{}> =>
  apiCaller(`/reset-password/${id}`, undefined, "GET", undefined, "user");

export const getAllPermission = (): Promise<{}> =>
  apiCaller(`/permissions/all`, undefined, "GET", undefined, "user");

export const userProfile = () =>
  apiCaller(`/userData`, undefined, "GET", undefined, "user");

export const chanagePassword = (data: any) =>
  apiCaller(`/changePassword`, data, "PATCH", undefined, "user");

export const userEditDetail = ({
  loggedInUserData,
}: {
  loggedInUserData: any;
}) => apiCaller(`/edit`, loggedInUserData, "PATCH", undefined, "user");

export const profileImage = (formData: object) =>
  apiCaller(`/update/profile`, formData, "PATCH", undefined, "user");

export const getManagers = () =>
  apiCaller(`/manager/list`, undefined, "GET", undefined, "user");

export const deleteProfileImage = () =>
  apiCaller(`/update/profile`, undefined, "DELETE", undefined, "user");

export const deleteUser = (id: string | number, action: string): Promise<{}> =>
  apiCaller(`/${id}?action=${action}`, undefined, "DELETE", undefined, "user");

export const addFeedbackUser = ({ id, data }: { id: string; data: object }) =>
  apiCaller(`/${id}/feedback`, data, "POST", undefined, "user");

export const editFeedbackUser = ({ id, data }: { id: string; data: object }) =>
  apiCaller(`/feedback/${id}`, data, "PATCH", undefined, "user");

export const feedback = async ({
  id,
  currentPage,
  limit,
  startDate,
  endDate,
}: {
  id: string;
  currentPage?: string;
  limit?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{
  data: FeedbackType[];
  totalRecords: number;
}> =>
  (
    await apiCaller(
      `/${id}/feedback?${querystring.stringify({
        currentPage,
        limit,
        startDate,
        endDate,
      })}`,
      undefined,
      "GET",
      undefined,
      "user"
    )
  ).data;

export const deleteFeedback = (id: string) =>
  apiCaller(`/feedback/${id}`, undefined, "DELETE", undefined, "user");

export const getSingleFeedback = (id: string) =>
  apiCaller(`/feedback/${id}`, undefined, "GET", undefined, "user");

export const createEmployee = (data: CreateEmployee) =>
  PythonApiCaller(`/user`, "POST", data);

export const updateEmployee = ({ id, data }: { id: string; data: object }) =>
  PythonApiCaller(`/user/${id}`, "PUT", data);

export const addDocument = ({ id, data }: { id: string; data: FormData }) =>
  PythonApiCaller(`/user/${id}/doc`, "POST", data);

export const removeDocument = ({
  employeeId,
  documentId,
}: {
  employeeId: string;
  documentId: string;
}) => PythonApiCaller(`/user/${employeeId}/doc/${documentId}`, "DELETE");

export const updateDocument = ({
  employeeId,
  documentId,
  data,
}: {
  employeeId: string;
  documentId: string;
  data: FormData;
}) => PythonApiCaller(`/user/${employeeId}/doc/${documentId}`, "PUT", data);

export const salaryCalculations = (data: {
  startDate: string;
  endDate: string;
  userIds: string[];
}) => PythonApiCaller(`/user/salary/calculations`, "POST", data);
