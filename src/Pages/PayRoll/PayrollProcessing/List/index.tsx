import MonthPicker from "@/Components/MonthPicker";
import { Table } from "@/Components/Table";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { ATTENDANCE_STATUS, DATE_FORMATS, FILTER } from "@/Constant";
import { useAttendance } from "@/Hooks/attendance";
import { useSalaryCalculation, useUsers } from "@/Hooks/emloyee";
import { Attendance } from "@/Types/Attendance";
import { Calculations, Employee } from "@/Types/Employee";
import { isUUID, titleCase } from "@/Utils/generic";
import { Button, Col, PageHeader } from "antd";
import dayjs from "dayjs";
import get from "lodash/get";
import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useSearchParams } from "react-router-dom";
import BreakdownModal from "./Breakdown";
import ExportReports from "./ExportReports";
import FooterModal from "./FooterModal";
import styles from "./styles.module.less";

const { YEAR_MONTH_DAY, MONTH_YEAR } = DATE_FORMATS;
const { PRESENT, ABSENT, HALFDAY, PAIDLEAVE, LWP } = ATTENDANCE_STATUS;
const { CUREENT_PAGE } = FILTER;

const getTotal = (
  attendances: Attendance[],
  type: "presentDays" | "absentDays" | "paidLeaves" | "lwp"
) => {
  const counts: Record<string, number> = {
    presentDays: 0,
    absentDays: 0,
    paidLeaves: 0,
    lwp: 0,
  };

  for (const attendance of attendances) {
    switch (attendance.status) {
      case PRESENT:
        counts.presentDays += 1;
        break;
      case ABSENT:
        counts.absentDays += 1;
        break;
      case HALFDAY:
        counts.presentDays += 0.5;
        counts.absentDays += 0.5;
        break;
      case PAIDLEAVE:
        counts.paidLeaves += 1;
        break;
      case LWP:
        counts.lwp += 1;
        break;
    }
  }

  return counts[type] || 0;
};

const PayrollProcessingList: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const [calculatedSalary, setCalculatedSalary] = useState<Calculations[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const { formatMessage } = useIntl();
  const limit = params.get("limit") || 100;
  const currentPage = params.get("currentPage") || CUREENT_PAGE;
  const month = params.get("month") || dayjs();
  const search = params.get("search") || "";

  const { data: employeeResponse, isLoading } = useUsers({
    limit,
    currentPage: String(currentPage),
    search,
  });
  const { mutateAsync: salaryCalculation } = useSalaryCalculation();

  const {
    data: attendanceResponse,
    isLoading: attendancesLoading,
    isSuccess,
  } = useAttendance({
    fromDate: dayjs(month).startOf("month").format(YEAR_MONTH_DAY),
    endDate: dayjs(month).endOf("month").format(YEAR_MONTH_DAY),
  });

  const totalEmployees = get(employeeResponse, "data", []);
  const totalAttendance = get(attendanceResponse, "items", []);

  useEffect(() => {
    if (totalEmployees.length) {
      getSalaryCalculation();
    }
  }, [totalEmployees]);

  const getSalaryCalculation = async () => {
    const employeeIds = totalEmployees.reduce(
      (result: string[], employee: Employee) => {
        if (employee.salaryTemplates !== "") {
          result.push(employee._id);
        }
        return result;
      },
      []
    );

    try {
      const { data } = await salaryCalculation({
        startDate: dayjs(month).startOf("month").format(YEAR_MONTH_DAY),
        endDate: dayjs(month).endOf("month").format(YEAR_MONTH_DAY),
        userIds: employeeIds,
      });
      setCalculatedSalary(data.data);
    } catch (error) {
      console.log("errror---", error);
    }
  };

  const PayrollProccessingColumns = [
    {
      title: formatMessage({
        id: "generic.serialNumber",
      }),
      key: "number",
      render: (_: any, __: any, index: number) =>
        (Number(currentPage) - 1) * Number(limit) + index + 1,
    },
    {
      title: formatMessage({ id: "payrollProcessing.list.column.empId" }),
      key: "employeeCode",
      dataIndex: "employeeCode",
    },
    {
      title: formatMessage({ id: "payrollProcessing.list.column.empName" }),
      key: "name",
      dataIndex: "name",
      render: (name: string, { _id }: Employee) => (
        <Link to={`/employees/${_id}/overview`} className={styles.nameLink}>
          {titleCase(name)}
        </Link>
      ),
    },
    {
      title: formatMessage({ id: "payrollProcessing.list.column.presentDay" }),
      key: "presentDay",
      dataIndex: "presentDays",
    },
    {
      title: formatMessage({ id: "payrollProcessing.list.column.absentDay" }),
      key: "absentDay",
      dataIndex: "absentDays",
    },
    {
      title: formatMessage({ id: "payrollProcessing.list.column.lwp" }),
      key: "lwp",
      dataIndex: "lwp",
    },
    {
      title: formatMessage({ id: "payrollProcessing.list.column.paidDay" }),
      key: "paidLeaves",
      dataIndex: "paidLeaves",
    },
    {
      title: formatMessage({ id: "payrollProcessing.list.column.grossSalary" }),
      key: "salary",
      dataIndex: "salary",
    },
    {
      title: formatMessage({ id: "payrollProcessing.list.column.netPay" }),
      key: "netPay",
      dataIndex: "netPay",
    },
    {
      title: formatMessage({ id: "payrollProcessing.list.column.breakdown" }),
      key: "breakdown",
      dataIndex: "templateId",
      render: (templateId: string) =>
        templateId ? (
          <Button onClick={() => setSelectedTemplateId(templateId)}>
            {formatMessage({ id: "payrollProcessing.list.breakdown.button" })}
          </Button>
        ) : (
          formatMessage({ id: "payrollProcessing.list.breakdown.notFound" })
        ),
    },
    {
      title: formatMessage({ id: "payrollProcessing.list.column.paySlip" }),
      key: "download",
      dataIndex: "templateId",
      render: (templateId: string, data: Employee) => (
        <Link to={`/payroll/processing/${data._id}/${templateId}`}>
          <Button>{formatMessage({ id: "generic.view" })}</Button>
        </Link>
      ),
    },
  ];

  const totalDetails = useMemo(() => {
    const totalMonthDays = dayjs(month).daysInMonth();
    const fliteredEmployees = totalEmployees.map((employee) => {
      const employeeAttendance = totalAttendance.filter(
        (att: Attendance) =>
          att.empId === employee.employeeCode &&
          dayjs(att.date).format(MONTH_YEAR) === dayjs(month).format(MONTH_YEAR)
      );
      const employeeCalculatedSalary = calculatedSalary?.find(
        (salaryData: Calculations) => salaryData.empId === employee.employeeCode
      );
      return {
        _id: employee._id,
        employeeCode: employee.employeeCode,
        name: employee.name,
        remainingLeaves: employee.remainingLeaves,
        salary: employee.salary,
        presentDays: getTotal(employeeAttendance, "presentDays"),
        absentDays: getTotal(employeeAttendance, "absentDays"),
        paidLeaves:
          Number(totalMonthDays) -
          Number(getTotal(employeeAttendance, "presentDays")),
        lwp: getTotal(employeeAttendance, "lwp"),
        netPay: employeeCalculatedSalary
          ? Math.floor(employeeCalculatedSalary.netSalary)
          : employee.salary,
        templateId: employee.salaryTemplates,
      };
    });
    return fliteredEmployees;
  }, [totalEmployees, isSuccess, calculatedSalary]);

  const handleCancel = () => {
    setSelectedTemplateId("");
  };

  const onInputChange = (value: string) => {
    setParams({
      currentPage: "1",
      limit: String(limit),
      search: value,
    });
  };

  return (
    <PageLayoutWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.payroll",
          }),
          path: "/payroll/processing",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.payrollProcessing",
          }),
          path: "/payroll/processing",
        },
      ]}
    >
      <PageHeader
        title={formatMessage({
          id: "payrollProcessing.list.title",
        })}
        ghost={false}
        extra={
          <div className={styles.filtersContainer}>
            <Button type="primary">
              {formatMessage({
                id: "generic.upload",
              })}
            </Button>
            <ExportReports
              tableHeaders={PayrollProccessingColumns.map(
                (column) => column.title
              )}
              tableData={totalDetails}
            />
          </div>
        }
      />

      <Table
        searchable
        value={!isUUID(search) ? search : ""}
        searchPlaceholder={"Search by name"}
        onSearch={(value: string) => onInputChange(value)}
        columns={PayrollProccessingColumns}
        dataSource={totalDetails}
        loading={isLoading}
        extra={
          <Col lg={16} xs={24}>
            <div className={styles.dateFilter}>
              <MonthPicker
                blackButton
                value={dayjs(month)}
                handleChange={(selectedMonth) =>
                  setParams({
                    ...params,
                    month: selectedMonth,
                  })
                }
                label="Select Month"
              />
            </div>
          </Col>
        }
        pagination={{
          pageSize: Number(limit),
          current: Number(currentPage),
          onChange: (currentPage: number, pageSize: number) => {
            setParams({
              ...params,
              limit: String(pageSize),
              currentPage: String(currentPage),
            });
          },
          showSizeChanger: true,
          total: employeeResponse?.totalRecords,
        }}
      />
      <FooterModal
        columns={PayrollProccessingColumns.map((column) => column.title)}
      />
      <BreakdownModal
        open={Boolean(selectedTemplateId)}
        onCancel={handleCancel}
        templateId={selectedTemplateId}
      />
    </PageLayoutWrapper>
  );
};

export default PayrollProcessingList;
