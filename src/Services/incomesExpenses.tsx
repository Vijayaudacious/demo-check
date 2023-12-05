import { Filters } from "@/Types/Project";
import { Incomes } from "@/Types/incomes";
import { PythonApiCaller } from "@/Utils/RestApi";

export const getIncomesExpenses = async (filters: Filters) =>
  PythonApiCaller("income-expenses/transactions", "GET", filters);

export const addIncomesExpenses = (formData: Filters): Promise<{}> =>
  PythonApiCaller(`income-expenses/transactions/`, "POST", formData);

export const updateIncomesExpenses = ({
  id,
  formData,
}: {
  id: string;
  formData: Incomes[];
}) => PythonApiCaller(`/income-expenses/transactions/${id}`, "PATCH", formData);

export const deleteIncomesExpenses = (id: string) =>
  PythonApiCaller(`income-expenses/transactions/${id}`, "DELETE");
