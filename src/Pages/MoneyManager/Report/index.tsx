import Icon, { ExpensesIcon, IncomeIcon } from "@/Assets/Images";
import DatePicker, { DatePickerProps } from "@/Components/DatePicker";
import HighchartsComponent from "@/Components/Highcharts";
import { Input } from "@/Components/InputField";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { DATE_FORMATS } from "@/Constant";
import { useCategories } from "@/Hooks/categories";
import { useIncomesExpenses } from "@/Hooks/incomesExpenses";
import useCurrency from "@/Hooks/useCurrency";
import PieChart from "@/Pages/MoneyManager/Report/peiChart";
import { Category } from "@/Types/Categories";
import { Incomes } from "@/Types/incomes";
import { formatCurrency } from "@/Utils/generic";
import { Card, Col, Row } from "antd";
import dayjs from "dayjs";
import get from "lodash/get";
import { ChangeEvent } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import ReportBreakdown from "./ReportBreakdown";
import styles from "./styles.module.less";
import { ReportProvider } from "./ReportProvider";

const { DAY_MONTH_YEAR, YEAR_MONTH_DAY } = DATE_FORMATS;

const Report = () => {
  const { formatMessage } = useIntl();
  const currency = useCurrency();
  const [params, setParams] = useSearchParams();
  const fromDate = params.get("fromDate")
    ? dayjs(params.get("fromDate")).format(YEAR_MONTH_DAY)
    : dayjs().startOf("month").format(YEAR_MONTH_DAY);
  const toDate = params.get("toDate")
    ? dayjs(params.get("toDate")).format(YEAR_MONTH_DAY)
    : dayjs().endOf("month").format(YEAR_MONTH_DAY);

  const lastMonthFromDate = dayjs()
    .subtract(1, "month")
    .startOf("month")
    .format(YEAR_MONTH_DAY);
  const lastMonthToDate = dayjs()
    .subtract(1, "month")
    .endOf("month")
    .format(YEAR_MONTH_DAY);

  const { data: categoriesData } = useCategories({});
  const { data: expenseData } = useIncomesExpenses({
    type: "expenses",
    fromDate,
    toDate,
    field: "date",
  });
  const expensesData = get(expenseData, "data", []);
  const { isLoading: isIncomeLoading, data: incomesData } = useIncomesExpenses({
    type: "income",
    fromDate,
    toDate,
    field: "date",
  });

  const { data: lastMonthIncomesData } = useIncomesExpenses({
    type: "income",
    fromDate: lastMonthFromDate,
    toDate: lastMonthToDate,
  });
  const { data: lastMonthExpensesData } = useIncomesExpenses({
    type: "expenses",
    fromDate: lastMonthFromDate,
    toDate: lastMonthToDate,
  });
  const lastMonthIncome = get(lastMonthIncomesData, "data", []);
  const lastMonthExpenses = get(lastMonthExpensesData, "data", []);

  const incomeData = get(incomesData, "data", []);
  const incomeDataByCategory: { [key: string]: Incomes[] } = {};
  incomeData.forEach((item: Incomes) => {
    const categoryId = item.category;
    if (incomeDataByCategory[categoryId]) {
      incomeDataByCategory[categoryId].push(item);
    } else {
      incomeDataByCategory[categoryId] = [item];
    }
  });

  const chartIncomeData = categoriesData?.data.map((category: Category) => {
    const categoryId = category._id;
    const incomeForCategory = incomeDataByCategory[categoryId];
    const totalIncome = incomeForCategory
      ? incomeForCategory.reduce((total, item) => total + item.amount, 0)
      : 0;
    return [category.name, totalIncome];
  });

  const expensesDataByCategory: { [key: string]: Incomes[] } = {};
  expensesData.forEach((item: any) => {
    const categoryId = item.category;
    if (expensesDataByCategory[categoryId]) {
      expensesDataByCategory[categoryId].push(item);
    } else {
      expensesDataByCategory[categoryId] = [item];
    }
  });
  const chartExpensesData = categoriesData?.data.map((category: Category) => {
    const categoryId = category._id;
    const expensesForCategory = expensesDataByCategory[categoryId];
    const totalExpenses = expensesForCategory
      ? expensesForCategory.reduce((total, item) => total + item.amount, 0)
      : 0;
    return [category.name, totalExpenses];
  });

  const onStartDateChange: DatePickerProps["onChange"] = (value) => {
    setParams({
      ...params,
      currentPage: "1",
      fromDate: value
        ? value.format(YEAR_MONTH_DAY)
        : dayjs().startOf("month").format(YEAR_MONTH_DAY),
      toDate,
    });
  };

  const onEndDateChange: DatePickerProps["onChange"] = (value) => {
    setParams({
      ...params,
      currentPage: "1",
      fromDate,
      toDate: value
        ? value.format(YEAR_MONTH_DAY)
        : dayjs().endOf("month").format(YEAR_MONTH_DAY),
    });
  };

  const incomeFormattedData = incomeData.map((income: Incomes) => ({
    x: dayjs(income.date).format(DAY_MONTH_YEAR),
    y: income.amount,
  }));
  const expensesFormattedData = expensesData.map((expenses: Incomes) => ({
    x: dayjs(expenses.date).format(DAY_MONTH_YEAR),
    y: expenses.amount,
  }));
  const incomeSeriesData = incomeFormattedData.map((data: any) => data.y);
  const expensesSeriesData = expensesFormattedData.map((data: any) => data.y);
  const incomeCategoriesData = incomeFormattedData.map((data: any) => data.x);
  const totalIncome = incomeData.reduce(
    (total: number, income: Incomes) => total + income.amount,
    0
  );
  const totalExpenses = expensesData.reduce(
    (total: number, expenses: Incomes) => total + expenses.amount,
    0
  );
  const totalLastMonthIncome = lastMonthIncome?.reduce(
    (total: number, income: Incomes) => total + income.amount,
    0
  );
  const totalLastMonthExpenses = lastMonthExpenses.reduce(
    (total: number, expenses: Incomes) => total + expenses.amount,
    0
  );

  const handleDateRangeSelection = (
    value: string | string[] | ChangeEvent<any>
  ) => {
    switch (value) {
      case "thisMonth":
        setParams({
          fromDate: dayjs().startOf("month").format(YEAR_MONTH_DAY),
          toDate: dayjs().endOf("month").format(YEAR_MONTH_DAY),
        });
        break;
      case "lastMonth":
        setParams({
          fromDate: dayjs()
            .subtract(1, "month")
            .startOf("month")
            .format(YEAR_MONTH_DAY),
          toDate: dayjs()
            .subtract(1, "month")
            .endOf("month")
            .format(YEAR_MONTH_DAY),
        });
        break;
      case "thisYear":
        const currentYear = dayjs().year();
        const firstDateOfYear = dayjs()
          .year(currentYear)
          .startOf("year")
          .format(YEAR_MONTH_DAY);
        const lastDateOfYear = dayjs()
          .year(currentYear)
          .endOf("year")
          .format(YEAR_MONTH_DAY);
        setParams({
          fromDate: firstDateOfYear,
          toDate: lastDateOfYear,
        });
        break;
      case "lastQuarter":
        const startOfLastQuarter = dayjs()
          .subtract(1, "quarter")
          .startOf("quarter")
          .format(YEAR_MONTH_DAY);
        const endOfLastQuarter = dayjs()
          .subtract(1, "quarter")
          .endOf("quarter")
          .format(YEAR_MONTH_DAY);
        setParams({
          fromDate: startOfLastQuarter,
          toDate: endOfLastQuarter,
        });
        break;
      case "lastYear":
        const lastYear = dayjs().year() - 1;
        const firstDateOfLastYear = dayjs()
          .year(lastYear)
          .startOf("year")
          .format(YEAR_MONTH_DAY);
        const lastDateOfLastYear = dayjs()
          .year(lastYear)
          .endOf("year")
          .format(YEAR_MONTH_DAY);
        setParams({
          fromDate: firstDateOfLastYear,
          toDate: lastDateOfLastYear,
        });
        break;
      case "thisQuarter":
        const startQuarter = dayjs().startOf("quarter").format(YEAR_MONTH_DAY);
        const endQuarter = dayjs().endOf("quarter").format(YEAR_MONTH_DAY);
        setParams({
          fromDate: startQuarter,
          toDate: endQuarter,
        });
        break;
      default:
        break;
    }
  };

  return (
    <PageLayoutWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.moneyManager",
          }),
          path: "/money-manager/report",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.report",
          }),
          path: "",
        },
      ]}
    >
      <ReportProvider
        value={{
          fromDate,
          toDate,
        }}
      >
        <div>
          <Row gutter={10}>
            <Col lg={5} md={24} xs={24}>
              <span className={styles.datePickerTitle}>
                {formatMessage({
                  id: "incomesExpenses.list.filterTitle.startDate.label",
                })}
              </span>
              <DatePicker
                format={DAY_MONTH_YEAR}
                id="start_date"
                onChange={onStartDateChange}
                value={fromDate ? dayjs(fromDate) : dayjs().startOf("month")}
                placeholder={formatMessage({
                  id: "incomesExpenses.list.filterTitle.startDate.placeholder",
                })}
              />
            </Col>
            <Col lg={5} md={24} xs={24}>
              <span className={styles.datePickerTitle}>
                {formatMessage({
                  id: "incomesExpenses.list.filterTitle.endDate.label",
                })}
              </span>
              <DatePicker
                format={DAY_MONTH_YEAR}
                id="end_date"
                value={toDate ? dayjs(toDate) : dayjs().endOf("month")}
                onChange={onEndDateChange}
                placeholder={formatMessage({
                  id: "incomesExpenses.list.filterTitle.endDate.placeholder",
                })}
              />
            </Col>
            <Col lg={14} md={24} xs={24}>
              <div className={styles.flexEnd}>
                <div className={styles.filterDropdown}>
                  <span className={styles.datePickerTitle}>
                    {formatMessage({
                      id: "incomesExpenses.list.filterTitle.range.label",
                    })}
                  </span>
                  <Input
                    type="select"
                    defaultValue="thisMonth"
                    options={[
                      {
                        label: formatMessage({
                          id: "incomesExpenses.filterDropdown.thisMonth",
                        }),
                        value: "thisMonth",
                      },
                      {
                        label: formatMessage({
                          id: "incomesExpenses.filterDropdown.lastMonth",
                        }),
                        value: "lastMonth",
                      },
                      {
                        label: formatMessage({
                          id: "incomesExpenses.filterDropdown.thisQuarter",
                        }),
                        value: "thisQuarter",
                      },
                      {
                        label: formatMessage({
                          id: "incomesExpenses.filterDropdown.lastQuarter",
                        }),
                        value: "lastQuarter",
                      },
                      {
                        label: formatMessage({
                          id: "incomesExpenses.filterDropdown.thisYear",
                        }),
                        value: "thisYear",
                      },
                      {
                        label: formatMessage({
                          id: "incomesExpenses.filterDropdown.lastYear",
                        }),
                        value: "lastYear",
                      },
                    ]}
                    onChange={(value) => handleDateRangeSelection(value)}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <Row className={styles.amountCard} gutter={[20, 10]}>
            <Col lg={12} xl={8} xs={24}>
              <Card
                loading={isIncomeLoading}
                title={formatMessage({
                  id: "incomesExpenses.highcharts.totalCard.totalIncome",
                })}
                bordered={true}
                bodyStyle={{ display: "flex" }}
              >
                <Icon
                  icon={IncomeIcon}
                  width={65}
                  className={styles.cardIcon}
                />
                <div className={styles.cardTitle}>
                  <p>{formatCurrency(totalLastMonthIncome, currency)}</p>
                  <p
                    style={{
                      color:
                        totalLastMonthIncome < totalIncome ? "green" : "red",
                    }}
                    className={styles.cardValue}
                  >
                    {totalLastMonthIncome < totalIncome
                      ? formatCurrency(totalIncome, currency)
                      : formatCurrency(-totalIncome, currency)}
                  </p>
                </div>
              </Card>
            </Col>
            <Col lg={12} xl={8} xs={24}>
              <Card
                loading={isIncomeLoading}
                title={formatMessage({
                  id: "incomesExpenses.highcharts.totalCard.totalExpenses",
                })}
                bordered={true}
                bodyStyle={{ display: "flex" }}
              >
                <Icon
                  icon={ExpensesIcon}
                  width={65}
                  className={styles.cardIcon}
                />
                <div className={styles.cardTitle}>
                  <p>{formatCurrency(totalLastMonthExpenses, currency)} </p>
                  <p
                    style={{
                      color:
                        totalLastMonthExpenses < totalExpenses
                          ? "green"
                          : "red",
                    }}
                    className={styles.cardValue}
                  >
                    {totalLastMonthExpenses < totalExpenses
                      ? formatCurrency(totalExpenses, currency)
                      : formatCurrency(-totalExpenses, currency)}
                  </p>
                </div>
              </Card>
            </Col>
          </Row>
          <Row className={styles.chartsCard} gutter={[15, 10]}>
            <Col xs={24} md={24} xl={12} xxl={8}>
              <PieChart
                title={formatMessage({
                  id: "incomesExpenses.highcharts.pieChart.title.incomeCategory",
                })}
                chartData={chartIncomeData}
              />
            </Col>
            <Col xs={24} md={24} xl={12} xxl={8}>
              <PieChart
                title={formatMessage({
                  id: "incomesExpenses.highcharts.pieChart.title.expensesCategory",
                })}
                chartData={chartExpensesData}
              />
            </Col>
            <Col xs={24} md={24} xl={24} xxl={8}>
              <HighchartsComponent
                title={formatMessage({
                  id: "incomesExpenses.highcharts.highchartsComponent.title",
                })}
                yAxisTitle={formatMessage({
                  id: "incomesExpenses.highcharts.highchartsComponent.amount",
                })}
                seriesNameFirst={formatMessage({
                  id: "incomesExpenses.highcharts.highchartsComponent.incomes",
                })}
                seriesNameSecond={formatMessage({
                  id: "incomesExpenses.highcharts.highchartsComponent.expenses",
                })}
                seriesDataFirst={incomeSeriesData}
                seriesDataSecond={expensesSeriesData}
                categories={incomeCategoriesData}
              />
            </Col>
          </Row>
          <ReportBreakdown />
        </div>
      </ReportProvider>
    </PageLayoutWrapper>
  );
};

export default Report;
