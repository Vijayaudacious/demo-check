import {
  addIncomesExpenses,
  getIncomesExpenses,
  updateIncomesExpenses,
  deleteIncomesExpenses,
} from "@/Services/incomesExpenses";
import { useMutation, useQuery, useQueryClient } from "react-query";

const QUERY_KEYS = {
  INCOMES_EXPENSES_LIST: "incomes-expenses-list",
};

export const useIncomesExpenses = (
  filters: Parameters<typeof getIncomesExpenses>[0]
) =>
  useQuery([QUERY_KEYS.INCOMES_EXPENSES_LIST, JSON.stringify(filters)], () =>
    getIncomesExpenses(filters)
  );

export const useCreateIncomesExpensesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(addIncomesExpenses, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.INCOMES_EXPENSES_LIST]);
    },
  });
};

export const useUpdateIncomesExpensesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(updateIncomesExpenses, {
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries([QUERY_KEYS.INCOMES_EXPENSES_LIST, { id }]);
    },
  });
};

export const useDeleteIncomesExpenseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteIncomesExpenses, {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEYS.INCOMES_EXPENSES_LIST]);
    },
  });
};
