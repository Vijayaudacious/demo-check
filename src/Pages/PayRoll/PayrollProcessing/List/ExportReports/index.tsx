import ExportButton from "@/Components/ExportButton";
import { ExportSheet } from "@/Types/Payroll";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";

interface ExportReportsProps {
  tableHeaders: string[];
  tableData: ExportSheet[];
}
const ExportReports: React.FC<ExportReportsProps> = ({
  tableHeaders,
  tableData,
}) => {
  const { formatMessage } = useIntl();

  const exportingData = useMemo(() => {
    const data = tableData.map((user, index) => {
      const singleValue: Record<string, string | number> = {};
      singleValue[
        formatMessage({
          id: "generic.serialNumber",
        })
      ] = index + 1;
      singleValue[
        formatMessage({ id: "payrollProcessing.list.column.empId" })
      ] = user.employeeCode;
      singleValue[
        formatMessage({ id: "payrollProcessing.list.column.empName" })
      ] = user.name;
      singleValue[
        formatMessage({ id: "payrollProcessing.list.column.presentDay" })
      ] = user.presentDays;
      singleValue[
        formatMessage({ id: "payrollProcessing.list.column.absentDay" })
      ] = user.absentDays;
      singleValue[formatMessage({ id: "payrollProcessing.list.column.lwp" })] =
        user.lwp;
      singleValue[
        formatMessage({ id: "payrollProcessing.list.column.paidDay" })
      ] = user.paidLeaves;
      singleValue[
        formatMessage({ id: "payrollProcessing.list.column.grossSalary" })
      ] = user.salary;
      singleValue[
        formatMessage({ id: "payrollProcessing.list.column.netPay" })
      ] = user.netPay;

      return singleValue;
    });
    return data;
  }, [tableData]);
  return (
    <ExportButton
      data={exportingData}
      headers={tableHeaders.slice(0, -2)}
      filename={`payroll_${dayjs().format("MMM")}_${Date.now()}`}
    >
      {formatMessage({
        id: "generic.export",
      })}
    </ExportButton>
  );
};

export default ExportReports;
