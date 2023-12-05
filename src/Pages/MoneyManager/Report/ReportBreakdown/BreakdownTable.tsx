import { Table } from "@/Components/Table";
import { useIncomesExpenses } from "@/Hooks/incomesExpenses";
import useCurrency from "@/Hooks/useCurrency";
import { Incomes } from "@/Types/incomes";
import { formatCurrency } from "@/Utils/generic";
import React, { useContext, useMemo } from "react";
import { useIntl } from "react-intl";
import { ReportContext } from "../ReportProvider";
import { useCategories } from "@/Hooks/categories";

export type BreakdownByCategory = {
  name: string;
  income: number;
  expense: number;
  profit: number;
};

type BreakdownTableProps = {
  isLoading: boolean;
  data: BreakdownByCategory[];
};
const BreakdownTable: React.FC<BreakdownTableProps> = ({ isLoading, data }) => {
  const currency = useCurrency();
  const { formatMessage } = useIntl();

  const columns = [
    {
      title: formatMessage({
        id: "incomesExpenses.highcharts.highchartsComponent.category",
      }),
      key: "name",
      dataIndex: "name",
      width: 200,
    },
    {
      title: formatMessage({
        id: "incomesExpenses.highcharts.highchartsComponent.incomes",
      }),
      dataIndex: "income",
      key: "income",
      render: (totalIncome: number) => {
        if (totalIncome) {
          return formatCurrency(totalIncome, currency);
        } else {
          return "-";
        }
      },
    },
    {
      title: formatMessage({
        id: "incomesExpenses.highcharts.highchartsComponent.expenses",
      }),
      dataIndex: "expense",
      key: "expense",

      render: (totalIncome: number) => {
        if (totalIncome) {
          return formatCurrency(totalIncome, currency);
        } else {
          return "-";
        }
      },
    },
    {
      title: formatMessage({
        id: "incomesExpenses.highcharts.highchartsComponent.profitLoss",
      }),
      dataIndex: "profit",
      key: "profit",
      width: 250,
      render: (profitLoss: number) => {
        const isProfit = profitLoss >= 0;
        const colorStyle = isProfit ? { color: "green" } : { color: "red" };
        return (
          <span style={colorStyle}>{`${isProfit ? "" : "-"}${formatCurrency(
            profitLoss,
            currency
          )}`}</span>
        );
      },
    },
  ];

  return (
    <Table
      bordered
      loading={isLoading}
      columns={columns}
      pagination={false}
      dataSource={data}
    />
  );
};

export default BreakdownTable;
