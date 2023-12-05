import Categoryname from "@/Components/CategoryName";
import DatePicker, { DatePickerProps } from "@/Components/DatePicker";
import SelectCategory from "@/Components/SelectCategoryInput";
import { Table } from "@/Components/Table";
import Username from "@/Components/Username";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { DATE_FORMATS, FILTER } from "@/Constant";
import { useIncomesExpenses } from "@/Hooks/incomesExpenses";
import { Document, Incomes } from "@/Types/incomes";
import { isUUID } from "@/Utils/generic";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Input, PageHeader, Row, Space, Tooltip } from "antd";
import { TablePaginationConfig } from "antd/lib/table";
import dayjs from "dayjs";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import AddIncomeExpense from "../AddIncomeExpense";
import DeleteIncomesExpenses from "../DeleteIncomesExpenses";
import styles from "./styles.module.less";

interface IncomesExpensesListProps {
  type: "income" | "expenses";
}

const { LIMIT, CUREENT_PAGE, FIELD } = FILTER;
const { DAY_MONTH_YEAR, YEAR_MONTH_DAY } = DATE_FORMATS;

const IncomesExpensesList: React.FC<IncomesExpensesListProps> = ({ type }) => {
  const { formatMessage } = useIntl();
  const [params, setParams] = useSearchParams();
  const page = params.get("currentPage") || CUREENT_PAGE;
  const size = params.get("limit") || LIMIT;
  const field = params.get("field") || FIELD;
  const sortBy = params.get("sortBy") || "";
  const fromDate = params.get("fromDate") || "";
  const toDate = params.get("toDate") || "";
  const category = params.get("category") || "";
  const paymentMode = params.get("paymentMode") || "";
  const source = params.get("source") || "";
  const minRange = params.get("minRange") || "";
  const maxRange = params.get("maxRange") || "";
  const [showModal, setShowModal] = useState(false);
  const [incomeExpenseDetails, setIncomeExpenseDetails] = useState<any>();
  const isExpenses = type === "expenses";
  const logoBaseURL = process.env.REACT_APP_BASE_API || "";
  const { isLoading, data: incomesData } = useIncomesExpenses({
    type,
    currentPage: String(page),
    limit: size,
    fromDate,
    toDate,
    field,
    sortBy,
    category,
    paymentMode,
    source,
    minRange,
    maxRange,
  });

  const handleDocumentClick = (document: Document[]) => {
    window.open(logoBaseURL + document[0].file, "_blank");
  };

  const columns = [
    {
      title: formatMessage({ id: "generic.serialNumber" }),
      key: "index",
      render: (__: string, _: any, index: number) =>
        (Number(page) - 1) * Number(size) + index + 1,
    },
    {
      title: formatMessage({
        id: "incomesExpenses.list.columns.invoiceNumber",
      }),
      dataIndex: "invoiceNo",
      key: "invoiceNo",
    },
    {
      title: formatMessage({
        id: "incomesExpenses.list.columns.category.label",
      }),
      dataIndex: "category",
      key: "category",
      render: (category: string) => (
        <Categoryname
          idAttribute={`category${category}`}
          id={category}
          type="text"
        />
      ),
      filterDropdown: () => (
        <div className={styles.filterModal}>
          <h4>
            {formatMessage({
              id: "generic.filter",
            })}
          </h4>
          <SelectCategory
            placeholder={formatMessage({
              id: "incomesExpenses.list.columns.category.placeholder",
            })}
            value={isUUID(category) ? category : null}
            style={{ width: "100%" }}
            onChange={(value) => setParams({ category: value || "" })}
            id="category_by"
            className={styles.inputField}
          />
        </div>
      ),
    },
    {
      title: formatMessage({
        id: "incomesExpenses.list.columns.date",
      }),
      dataIndex: "date",
      key: "date",
      render: (date: string) =>
        date ? dayjs(date).format(DAY_MONTH_YEAR) : <span>-</span>,
    },
    isExpenses
      ? {
          title: formatMessage({
            id: "incomesExpenses.list.columns.updatedBy",
          }),
          dataIndex: "updatedBy",
          key: "updatedBy",
          render: (updatedBy: string) => (
            <Username
              id={updatedBy}
              idAttribute={`updatedBy_${updatedBy}`}
              type="link"
            />
          ),
        }
      : null,
    isExpenses
      ? {
          title: formatMessage({
            id: "incomesExpenses.list.columns.expensesBy",
          }),
          dataIndex: "expensesBy",
          key: "expensesBy",
          render: (expensesBy: string) => (
            <Username
              id={expensesBy}
              idAttribute={`expensesBy_${expensesBy}`}
              type="link"
            />
          ),
        }
      : null,
    {
      title: formatMessage({
        id: isExpenses
          ? "incomesExpenses.list.columns.modeOfPayment"
          : "incomesExpenses.list.columns.modeIncome.label",
      }),
      dataIndex: "mode",
      key: "mode",
      filterDropdown: () => (
        <div className={styles.filterModal}>
          <h4>
            {formatMessage({
              id: "generic.filter",
            })}
          </h4>
          <Input
            placeholder={formatMessage({
              id: "incomesExpenses.list.columns.modeIncome.filterDropdown.placeholder",
            })}
            onChange={(value: React.ChangeEvent<HTMLInputElement>) =>
              setParams({ paymentMode: value.target.value })
            }
            id="paymentMode"
            className={styles.inputField}
            allowClear
          />
        </div>
      ),
    },
    {
      title: formatMessage({
        id: "incomesExpenses.list.columns.amount.label",
      }),
      dataIndex: "amount",
      key: "amount",
      filterDropdown: () => (
        <div className={styles.filterModal}>
          <h4>
            {formatMessage({
              id: "generic.filter",
            })}
          </h4>
          <Input
            type="number"
            placeholder={formatMessage({
              id: "incomesExpenses.list.columns.amount.placeholder.minNumber",
            })}
            onChange={(value: React.ChangeEvent<HTMLInputElement>) =>
              setParams({ minRange: value.target.value, maxRange: maxRange })
            }
            id="paymentMode"
            className={styles.numberField}
            allowClear
          />
          <Input
            type="number"
            placeholder={formatMessage({
              id: "incomesExpenses.list.columns.amount.placeholder.maxNumber",
            })}
            onChange={(value: React.ChangeEvent<HTMLInputElement>) =>
              setParams({ minRange: minRange, maxRange: value.target.value })
            }
            id="paymentMode"
            className={styles.numberField}
            allowClear
          />
        </div>
      ),
    },
    {
      title: formatMessage({
        id: "incomesExpenses.list.columns.description",
      }),
      dataIndex: "description",
      key: "description",
    },
    {
      title: formatMessage({
        id: "incomesExpenses.list.columns.attachment.label",
      }),
      dataIndex: "document",
      key: "document",
      render: (document: any) =>
        document.length > 0 ? (
          <Button onClick={() => handleDocumentClick(document)}>
            {formatMessage({
              id: "incomesExpenses.list.columns.attachment.label",
            })}
          </Button>
        ) : (
          <span>
            {formatMessage({
              id: "incomesExpenses.list.columns.attachment.noFound",
            })}
          </span>
        ),
    },
    {
      title: formatMessage({
        id: "incomesExpenses.list.columns.action.label",
      }),
      key: "action",
      render: (record: Incomes) => {
        return (
          <>
            <Space>
              <Tooltip
                title={formatMessage({
                  id: "generic.update",
                })}
              >
                <Button
                  icon={<EditOutlined />}
                  id={`${record._id}_update`}
                  onClick={() => {
                    setIncomeExpenseDetails(record);
                    setShowModal(true);
                  }}
                />
              </Tooltip>
              <Tooltip
                title={formatMessage({
                  id: "generic.delete",
                })}
              >
                <span>
                  <DeleteIncomesExpenses
                    id={record._id}
                    invoiceNo={record.invoiceNo}
                    incomesExpensesType={type}
                  />
                </span>
              </Tooltip>
            </Space>
          </>
        );
      },
    },
  ];

  const onFilterChange = (pagination: TablePaginationConfig) => {
    const { current: currentPage, pageSize } = pagination;
    setParams({
      ...params,
      currentPage: String(currentPage),
      limit: String(pageSize),
    });
  };

  const onStartDateChange: DatePickerProps["onChange"] = (value) => {
    setParams({
      ...params,
      currentPage: "1",
      fromDate: value ? value.format(YEAR_MONTH_DAY) : "",
      toDate,
    });
  };

  const onEndDateChange: DatePickerProps["onChange"] = (value) => {
    setParams({
      ...params,
      currentPage: "1",
      fromDate,
      toDate: value ? value.format(YEAR_MONTH_DAY) : "",
    });
  };

  const filteredColumns = columns.filter((colum: any) => colum !== null);

  return (
    <PageLayoutWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.moneyManager",
          }),
          path: isExpenses
            ? "/money-manager/incomes"
            : "/money-manager/expenses",
        },
        {
          breadcrumbName: formatMessage({
            id: isExpenses ? "breadcrumbs.expenses" : "breadcrumbs.incomes",
          }),
          path: isExpenses
            ? "/money-manager/expenses"
            : "/money-manager/incomes",
        },
      ]}
    >
      <Row>
        <Col flex="auto">
          <PageHeader
            title={formatMessage({
              id: isExpenses
                ? "incomesExpenses.list.title.expenses"
                : "incomesExpenses.list.title.incomes",
            })}
            ghost={false}
            extra={
              <Button
                type="primary"
                id="add_incoms"
                className={styles.addButton}
                icon={<PlusOutlined />}
                onClick={() => {
                  setIncomeExpenseDetails(null);
                  setShowModal(true);
                }}
              >
                {formatMessage({
                  id: "generic.add",
                })}
              </Button>
            }
          />
          <Table
            columns={filteredColumns}
            bordered
            dataSource={incomesData?.data || []}
            loading={isLoading}
            pagination={{
              pageSize: Number(size),
              current: Number(page),
              showSizeChanger: true,
              total: incomesData?.totalRecords,
            }}
            handleChange={(pagination, filter, sorter) =>
              onFilterChange(pagination)
            }
            extra={
              <>
                <Col lg={5} md={12} xs={24}>
                  <span className={styles.datePickerTitle}>
                    {formatMessage({
                      id: "incomesExpenses.list.filterTitle.startDate.label",
                    })}
                  </span>
                  <DatePicker
                    format={DAY_MONTH_YEAR}
                    id="start_date"
                    onChange={onStartDateChange}
                    className={styles.dateFilter}
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
                    className={styles.dateFilter}
                    onChange={onEndDateChange}
                    placeholder={formatMessage({
                      id: "incomesExpenses.list.filterTitle.endDate.placeholder",
                    })}
                  />
                </Col>
              </>
            }
          />
        </Col>
      </Row>
      <AddIncomeExpense
        showModal={showModal}
        handleClose={() => setShowModal(!showModal)}
        incomeExpense={incomeExpenseDetails}
        incomeExpenseType={type}
      />
    </PageLayoutWrapper>
  );
};

export default IncomesExpensesList;
