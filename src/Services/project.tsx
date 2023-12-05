import { CreateProjectPayload, Filters } from "@/Types/Project";
import { PythonApiCaller } from "@/Utils/RestApi";

export const getProjects = (filters: Filters) =>
  PythonApiCaller("/projects", "GET", filters);

export const getProject = (id: string) =>
  PythonApiCaller(`/projects/${id}`, "GET");

export const createProject = (data: CreateProjectPayload) =>
  PythonApiCaller(`/projects`, "POST", data);

export const updateProject = ({
  id,
  data,
}: {
  id: string;
  data: CreateProjectPayload;
}) => PythonApiCaller(`/projects/${id}`, "PATCH", data);

export const removeProject = (id: string) =>
  PythonApiCaller(`/projects/${id}`, "DELETE");
