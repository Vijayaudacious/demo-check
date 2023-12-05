import { ZestLogo } from "@/Assets/Images";
import { Loader } from "@/Components/Loader";
import MonthPicker from "@/Components/MonthPicker";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { DATE_FORMATS } from "@/Constant";
import { useSalaryCalculation, useUser } from "@/Hooks/emloyee";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import { Calculations, Employee } from "@/Types/Employee";
import { isIndia, isUUID, titleCase } from "@/Utils/generic";
import { numberToWords } from "@/Utils/numberToWords";
import {
  Document,
  Image,
  PDFDownloadLink,
  PDFViewer,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import { Button, Col, Row } from "antd";
import dayjs from "dayjs";
import { get, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useParams, useSearchParams } from "react-router-dom";
import { styles } from "./pdfStyle";
import lessStyle from "./styles.module.less";

const { MONTH_NAME, YEAR_MONTH, YEAR_MONTH_DAY, MONTHNAME_YEAR } = DATE_FORMATS;

type SalaryTable = {
  type: "earnings" | "deductions";
  data?: Record<string, number>;
  total: number;
  columns: string[];
  notFoundText: string;
};
const Table = ({
  type,
  data = {},
  total = 0,
  columns,
  notFoundText,
}: SalaryTable) => {
  return (
    <>
      <View style={styles.earning}>
        <Text>{titleCase(type)}:</Text>
      </View>
      {isEmpty(data) && <Text style={styles.noData}>{notFoundText}</Text>}
      <View style={styles.tableRow}>
        {columns.map((column: string) => (
          <View style={styles.tableCol}>
            <Text style={styles.column}>{column}</Text>
          </View>
        ))}
      </View>
      {Object.keys(data || []).map((key, index) => {
        const earningDeduction = Math.floor(data[key]);
        return (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{index + 1}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{titleCase(key)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{earningDeduction}</Text>
            </View>
          </View>
        );
      })}
      <View style={styles.tableRow}>
        {/* <View style={styles.totalTableCol} /> */}
        <View style={styles.totalTableCol}>
          <Text style={styles.total}>Total</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.total}>{total}</Text>
        </View>
      </View>
    </>
  );
};

const PaySlip: React.FC = () => {
  const { employeeId, templateId } = useParams();
  const { isMobile } = useWindowDimensions();
  const { formatMessage } = useIntl();
  const [params, setParams] = useSearchParams();
  const [templateData, setTemplateData] = useState<Calculations>();
  const month = params.get("month") || dayjs().format(YEAR_MONTH);
  const currentMonthName = dayjs(month).format(MONTH_NAME);
  const {
    data: employeeResponse,
    isSuccess: isEmployeeSuccess,
    isLoading: isEmployeeLoading,
  } = useUser(employeeId || "");

  const employee: Employee = get(employeeResponse, "data.data", {});

  const {
    mutateAsync: salaryCalculation,
    isLoading: isTemplateLoading,
    isSuccess: isTemplateSuccess,
  } = useSalaryCalculation();

  useEffect(() => {
    if (employeeId && isUUID(employeeId || "")) {
      getTemplateData();
    }
  }, [month]);

  const getTemplateData = async () => {
    try {
      const { data } = await salaryCalculation({
        startDate: dayjs(month).startOf("month").format(YEAR_MONTH_DAY),
        endDate: dayjs(month).endOf("month").format(YEAR_MONTH_DAY),
        userIds: [employeeId || ""],
      });
      setTemplateData(data?.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const netSalary = Math.floor(get(templateData, "netSalary", 0));
  const netSalaryInWords = numberToWords(
    netSalary,
    `${isIndia() ? "Rupees" : "Doller"} Only`
  );
  const grossSalary = Math.floor(get(templateData, "salary", 0));
  const grossSalaryInWords = numberToWords(
    grossSalary,
    `${isIndia() ? "Rupees" : "Doller"} Only`
  );
  const tableColumns = [
    formatMessage({ id: "generic.serialNumber" }),
    formatMessage({ id: "payrollProcessing.payslip.table.head" }),
    formatMessage({ id: "payrollProcessing.payslip.table.amount" }),
  ];

  const MainDocument = () => {
    return (
      <Document>
        <Page size="A4">
          <View style={styles.section}>
            <View style={styles.header}>
              <Image src={ZestLogo} style={styles.logo} />
              <View>
                <Text>
                  {formatMessage(
                    { id: "payrollProcessing.payslip.forMonth" },
                    { month: `${month.toString()} ${currentMonthName}` }
                  )}
                </Text>
                <Text>
                  {formatMessage(
                    { id: "payrollProcessing.payslip.workingDays" },
                    { days: dayjs(month).daysInMonth() }
                  )}
                </Text>
                <Text>
                  {formatMessage(
                    { id: "payrollProcessing.payslip.presentDays" },
                    { days: templateData?.paidDays }
                  )}
                </Text>
              </View>
            </View>
            <View style={styles.employeeDetails}>
              <Text>
                {formatMessage(
                  { id: "payrollProcessing.payslip.name" },
                  { name: titleCase(employee.name) }
                )}
              </Text>
              <Text>
                {formatMessage(
                  { id: "payrollProcessing.payslip.employeeId" },
                  { empId: employee.employeeCode }
                )}
              </Text>
            </View>
            {templateData && (
              <>
                <Table
                  type="earnings"
                  columns={tableColumns}
                  data={templateData?.earnings}
                  total={Number(templateData?.totalEarnings)}
                  notFoundText={formatMessage(
                    { id: "payrollProcessing.payslip.noData" },
                    {
                      type: "earnings",
                    }
                  )}
                />
                <Table
                  type="deductions"
                  columns={tableColumns}
                  data={templateData?.deductions}
                  total={Number(templateData?.totalDeductions)}
                  notFoundText={formatMessage(
                    { id: "payrollProcessing.payslip.noData" },
                    {
                      type: "deductions",
                    }
                  )}
                />
              </>
            )}
            <View style={styles.finalAmount}>
              <Text>
                {formatMessage(
                  { id: "payrollProcessing.payslip.netSalary" },
                  {
                    amount: netSalary,
                  }
                )}{" "}
                ({netSalaryInWords} )
              </Text>
              <Text>
                {formatMessage(
                  { id: "payrollProcessing.payslip.grossSalary" },
                  {
                    amount: grossSalary,
                  }
                )}{" "}
                ({grossSalaryInWords})
              </Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  };
  const RenderPDF = () =>
    isMobile ? (
      <PDFDownloadLink
        document={<MainDocument />}
        fileName={`Payslip-${dayjs(month).format(MONTHNAME_YEAR)}`}
      >
        {({ loading }) => (
          <div className={lessStyle.mobileButton}>
            <Button type="primary">
              {formatMessage({
                id: loading
                  ? "payrollProcessing.payslip.button.loading"
                  : "payrollProcessing.payslip.button.success",
              })}
            </Button>
          </div>
        )}
      </PDFDownloadLink>
    ) : (
      <PDFViewer style={styles.viewer}>
        <MainDocument />
      </PDFViewer>
    );

  return (
    <PageLayoutWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.payrollProcessing",
          }),
          path: "/payroll/processing",
        },
      ]}
    >
      <div className={lessStyle.headerContainer}>
        <Row>
          <Col lg={12} className={lessStyle.title}>
            <h1>
              {formatMessage(
                { id: "payrollProcessing.payslip.title" },
                { month: currentMonthName }
              )}
            </h1>
          </Col>
          <Col lg={6} className={lessStyle.monthContainer}>
            <MonthPicker
              blackButton
              value={dayjs(month)}
              handleChange={(selectedMonth) =>
                setParams({
                  ...params,
                  month: selectedMonth,
                })
              }
              className={lessStyle.monthPicker}
            />
          </Col>
        </Row>
      </div>
      {(isEmployeeLoading || isTemplateLoading) && (
        <Loader isLoading centered />
      )}
      <div className={lessStyle.pdfContainer}>
        {isEmployeeSuccess && isTemplateSuccess && <RenderPDF />}
      </div>
    </PageLayoutWrapper>
  );
};

export default PaySlip;
