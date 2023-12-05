import {
  createMyExpenses,
  myExpenses,
  salaryTemplates,
} from "@/Services/payroll";
import { useMutation, useQuery, useQueryClient } from "react-query";

const QUERY_KEYS = {
  MY_EXPENSES: "my-all-expenses",
};

export const useMyExpenses = (filters: Parameters<typeof salaryTemplates>[0]) =>
  useQuery([QUERY_KEYS.MY_EXPENSES, filters], () => myExpenses(filters));

export const useCreateMyExpenses = () => {
  const queryClient = useQueryClient();
  return useMutation(createMyExpenses, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.MY_EXPENSES]);
    },
  });
};
