import { Filters } from "@/Types/Project";
import { CreateReportPayload } from "@/Types/Reports";
import { PythonApiCaller } from "@/Utils/RestApi";

export const getReports = (filters: Filters) =>
  PythonApiCaller("/reports", "GET", filters);

export const getReport = (id: string) =>
  PythonApiCaller(`/reports/${id}`, "GET");

export const createReport = (data: { tasks: CreateReportPayload }) =>
  PythonApiCaller(`/reports`, "POST", data);

export const updateReport = ({
  id,
  data,
}: {
  id: string;
  data: CreateReportPayload;
}) => PythonApiCaller(`/reports/${id}`, "PATCH", { tasks: data });

export const removeReport = (id: string) =>
  PythonApiCaller(`/reports/${id}`, "DELETE");

export const updateReportStatus = ({
  id,
  status,
  reason,
}: {
  id: string;
  status: "APPROVED" | "REJECTED";
  reason?: string;
}) => PythonApiCaller(`/reports/${id}/status`, "PATCH", { status, reason });
