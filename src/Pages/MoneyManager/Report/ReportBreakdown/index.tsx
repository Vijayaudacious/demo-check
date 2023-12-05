import useWindowDimensions from "@/Hooks/useWindowDimensions";
import BreakdownTable from "./BreakdownTable";
import { useContext, useMemo } from "react";
import { useIncomesExpenses } from "@/Hooks/incomesExpenses";
import { useCategories } from "@/Hooks/categories";
import { ReportContext } from "../ReportProvider";
import { Incomes } from "@/Types/incomes";
import BreakdownList from "./BreakdownList";

const ReportBreakdown = () => {
  const { fromDate, toDate } = useContext(ReportContext);

  const { isMobile } = useWindowDimensions();
  const { isLoading: isLoadingCategories, data: categoryData } = useCategories(
    {}
  );
  const { isLoading: isLoadingExpenses, data: expenseData } =
    useIncomesExpenses({
      type: "expenses",
      fromDate,
      toDate,
      field: "date",
    });

  const { isLoading: isLoadingIncome, data: incomeData } = useIncomesExpenses({
    type: "income",
    fromDate,
    toDate,
    field: "date",
  });

  const isLoading = isLoadingCategories || isLoadingExpenses || isLoadingIncome;

  const tableData = useMemo(() => {
    const expense = expenseData?.data || [];
    const income = incomeData?.data || [];
    const categories = categoryData?.data || [];

    return categories.map((category) => {
      const categoryId = category._id;
      const totalIncome = income
        .filter(({ category: catId }: Incomes) => catId === categoryId)
        .reduce((acc: number, { amount }: Incomes) => acc + amount, 0);
      const totalExpense = expense
        .filter(({ category: catId }: Incomes) => catId === categoryId)
        .reduce((acc: number, { amount }: Incomes) => acc + amount, 0);

      return {
        id: Math.random(),
        name: category.name,
        income: totalIncome,
        expense: totalExpense,
        profit: totalIncome - totalExpense,
      };
    });
  }, [incomeData, expenseData, categoryData]);

  return isMobile ? (
    <BreakdownList isLoading={isLoading} data={tableData} />
  ) : (
    <BreakdownTable isLoading={isLoading} data={tableData} />
  );
};

export default ReportBreakdown;
