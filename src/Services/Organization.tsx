import { GetHoliday, Holiday } from "@/Types/Attendance";
import { CreateWorkingDay } from "@/Types/Organization";
import { Filters } from "@/Types/Project";
import { PythonApiCaller } from "../Utils/RestApi";

export const addOrganisationDetail = (formData: object): Promise<{}> =>
  PythonApiCaller(`organisations/`, "POST", formData);

export const editOrganisationDetail = (formData: object): Promise<{}> =>
  PythonApiCaller(`/organisations`, "PATCH", formData);

export const organisationDetail = () =>
  PythonApiCaller(`/organisations`, "GET");

export const deleteOrganizationLogo = () =>
  PythonApiCaller(`/organisations`, "DELETE");

export const SetWorkingDays = (days: CreateWorkingDay[]): Promise<{}> =>
  PythonApiCaller(`/organisations/set-workingdays`, "POST", {
    workingDays: days,
  });

export const getHolidays = (
  filters: Filters
): Promise<{ data: GetHoliday[]; totalRecords: number }> =>
  PythonApiCaller("organisations/holidays", "GET", filters);

export const addHoliday = (data: Holiday) =>
  PythonApiCaller(`/organisations/holidays`, "POST", data);

export const updateHoliday = ({ id, data }: { id: string; data: Holiday }) =>
  PythonApiCaller(`/organisations/holidays/${id}`, "PATCH", data);

export const deleteHoliday = (id: string) =>
  PythonApiCaller(`/organisations/holidays/${id}`, "DELETE");

export const getWorkingDays = () =>
  PythonApiCaller(`organisations/set-workingdays`, "GET");
