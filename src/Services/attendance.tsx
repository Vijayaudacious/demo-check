import { CreateAttendance } from "@/Types/Attendance";
import { Filters } from "@/Types/Project";
import { PythonApiCaller } from "@/Utils/RestApi";

export const getSingleEmployeeAttendance = (id: string) =>
  PythonApiCaller(`/attendance/${id}`, "GET");

export const createAttendance = ({ data }: { data: CreateAttendance[] }) =>
  PythonApiCaller(`/attendance`, "POST", { attendance: data });

export const getAttendance = (filters?: Filters) =>
  PythonApiCaller("/attendance", "GET", filters);
