import { Filters } from "@/Types/Project";
import { SalaryTemplate } from "@/Types/SalaryTemplate";
import { PythonApiCaller } from "@/Utils/RestApi";

export const salaryTemplates = async (filters: Filters) =>
  PythonApiCaller("/template", "GET", filters);

export const salaryTemplate = async (id: string) =>
  PythonApiCaller(`/template/${id}`, "GET");

export const deleteSalaryTemplate = (id: string) =>
  PythonApiCaller(`/template/${id}`, "DELETE");

export const createSalaryTemplate = (data: SalaryTemplate) =>
  PythonApiCaller(`/template`, "POST", data);

export const updateSalaryTemplate = ({
  id,
  data,
}: {
  id: string;
  data: SalaryTemplate;
}) => PythonApiCaller(`/template/${id}`, "PATCH", data);

export const myExpenses = async (filters: Filters) =>
  PythonApiCaller("/reimbursement", "GET", filters);

export const createMyExpenses = (formData: object) =>
  PythonApiCaller(`/reimbursement`, "POST", formData);
