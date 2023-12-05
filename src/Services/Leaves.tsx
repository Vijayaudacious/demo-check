import querystring from "querystring";
import { apiCaller } from "../Utils/RestApi";
import { Pagination } from "../Types/Pagination";
import { AxiosResponse } from "axios";
import { Leave } from "@/Types/Leaves";

export const leaveRequest = (data: {
  requestedBy: any;
  reason: any;
  startDate: any;
  endDate: any;
  description: any;
  startDateHalfDayDetails: string;
  endDateHalfDayDetails: string;
  notifyTo?: string[];
}): Promise<{ token: string }> =>
  apiCaller(`/`, data, "post", undefined, "leaves");

export const listLeave = async ({
  search,
  currentPage,
  limit,
  field,
  sortBy,
  fromDate,
  toDate,
}: Pagination): Promise<{ data: any[]; totalRecords: number }> =>
  (
    await apiCaller(
      `/list?${querystring.stringify({
        search,
        currentPage,
        limit,
        field,
        sortBy,
        fromDate,
        toDate,
      })}`,
      undefined,
      "GET",
      undefined,
      "leaves"
    )
  ).data;

export const userLeave = (id: any): Promise<AxiosResponse<{ data: Leave[] }>> =>
  apiCaller(`/list/${id}`, undefined, "GET", undefined, "leaves");

export const showLeave = (id: any): Promise<{ token: string }> =>
  apiCaller(`/${id}`, undefined, "GET", undefined, "leaves");
export const leaveApproved = ({
  employeeId,
  data,
}: {
  employeeId: string | number;
  data: {
    status: string;
    leaveStatusDescription: string;
  };
}): Promise<{ token: string }> =>
  apiCaller(`/${employeeId}`, data, "PATCH", undefined, "leaves");

export const removeLeave = (id: string | number) =>
  apiCaller(`/${id}`, undefined, "DELETE", undefined, "leaves");
