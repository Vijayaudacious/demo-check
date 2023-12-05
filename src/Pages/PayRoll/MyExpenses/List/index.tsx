import DatePicker, { DatePickerProps } from "@/Components/DatePicker";
import SelectUser from "@/Components/SelectUserInput";
import { Table } from "@/Components/Table";
import Username from "@/Components/Username";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { COLOR_STATUS, DATE_FORMATS, FILTER } from "@/Constant";
import { useMyExpenses } from "@/Hooks/myExpenses";
import useCurrency from "@/Hooks/useCurrency";
import { MyAllExpenes } from "@/Types/MyExpenses";
import { Document } from "@/Types/incomes";
import { formatCurrency, titleCase } from "@/Utils/generic";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, PageHeader, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import classNames from "classnames";
import dayjs from "dayjs";
import { debounce, get, upperCase } from "lodash";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import AddUpdateRequest from "../AddUpdateRequest";
import styles from "./styles.module.less";

const { DAY_MONTH_YEAR, YEAR_MONTH_DAY } = DATE_FORMATS;
const { CUREENT_PAGE, LIMIT } = FILTER;

const MyExpensesList = () => {
  const { formatMessage } = useIntl();
  const currency = useCurrency();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const logoBaseURL = process.env.REACT_APP_BASE_API || "";
  const [params, setParams] = useSearchParams();
  const page = params.get("currentPage") || CUREENT_PAGE;
  const size = params.get("limit") || LIMIT;
  const search = params.get("search") || "";
  const fromDate = params.get("fromDate")
    ? dayjs(params.get("fromDate")).format(YEAR_MONTH_DAY)
    : "";
  const toDate = params.get("toDate")
    ? dayjs(params.get("toDate")).format(YEAR_MONTH_DAY)
    : "";
  const { data, isLoading } = useMyExpenses({
    search,
    fromDate,
    toDate,
    page,
    limit: size,
  });

  const allExpenses = get(data, "data", []);

  const handleDocumentClick = (document: Document[]) => {
    window.open(logoBaseURL + document[0].file, "_blank");
  };

  const columns: ColumnsType<MyAllExpenes> = [
    {
      title: formatMessage({ id: "generic.serialNumber" }),
      key: "index",
      render: (__: string, _: any, index: number) =>
        (Number(page) - 1) * Number(size) + index + 1,
    },
    {
      title: formatMessage({ id: "myexpenses.list.columns.requstedBy" }),
      key: "requstedBy",
      dataIndex: "requstedBy",
      render: (requstedBy) => (
        <Username id={requstedBy} type="link" idAttribute={requstedBy} />
      ),
    },
    {
      title: formatMessage({ id: "myexpenses.list.columns.dateOfExpenses" }),
      key: "date",
      dataIndex: "date",
      render: (date) => dayjs(date).format(DAY_MONTH_YEAR),
    },
    {
      title: formatMessage({ id: "myexpenses.list.columns.reasonOfExpenses" }),
      key: "reasonofExpense",
      dataIndex: "reasonofExpense",
      render: (reason) => reason || "-",
    },
    {
      title: formatMessage({ id: "myexpenses.list.columns.amount" }),
      key: "amount",
      dataIndex: "amount",
      render: (amount) => (amount ? formatCurrency(amount, currency) : "-"),
    },
    {
      title: formatMessage({ id: "myexpenses.list.columns.reportStatus" }),
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tooltip placement="bottom" title={status}>
          <Tag color={COLOR_STATUS[upperCase(status)]}>{titleCase(status)}</Tag>
        </Tooltip>
      ),
    },
    {
      title: formatMessage({ id: "myexpenses.list.columns.attechment" }),
      dataIndex: "document",
      key: "document",
      render: (document: any) =>
        document.length > 0 ? (
          <Button onClick={() => handleDocumentClick(document)}>
            {formatMessage({
              id: "myexpenses.list.attachment.data",
            })}
          </Button>
        ) : (
          <span>
            {formatMessage({
              id: "myexpenses.list.attachment.noData",
            })}
          </span>
        ),
    },
    {
      title: formatMessage({ id: "myexpenses.list.columns.actionStatus" }),
      key: "actionStatus",
      dataIndex: "",
    },
    {
      title: formatMessage({ id: "generic.actions" }),
      key: "actions",
      dataIndex: "",
    },
  ];

  const onInputChange = debounce((value: string) => {
    setParams({
      page: String(CUREENT_PAGE),
      limit: String(size),
      search: value || "",
    });
  }, 500);

  const onFilterChange = (pagination: Record<string, any>) => {
    const { current: currentPage, pageSize } = pagination;
    setParams({
      currentPage: String(currentPage),
      limit: String(pageSize),
      search,
    });
  };

  const onStartDateChange: DatePickerProps["onChange"] = (value) => {
    setParams({
      ...params,
      search,
      currentPage: String(CUREENT_PAGE),
      fromDate: value ? value.format(YEAR_MONTH_DAY) : "",
      toDate,
    });
  };

  const onEndDateChange: DatePickerProps["onChange"] = (value) => {
    setParams({
      ...params,
      search,
      currentPage: String(CUREENT_PAGE),
      fromDate,
      toDate: value ? value.format(YEAR_MONTH_DAY) : "",
    });
  };

  const onClose = () => {
    setIsModalOpen(false);
  };
  return (
    <PageLayoutWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.payroll",
          }),
          path: "/payroll/my-expenses",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.myExpenses",
          }),
          path: "/payroll/my-expenses",
        },
      ]}
    >
      <PageHeader
        title={formatMessage({ id: "myexpenses.list.title" })}
        ghost={false}
        extra={
          <Button
            type="primary"
            id="request"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            {formatMessage({ id: "myexpenses.request.button" })}
          </Button>
        }
      />
      <Table
        columns={columns}
        dataSource={allExpenses}
        loading={isLoading}
        pagination={{
          pageSize: Number(size),
          current: Number(page),
          showSizeChanger: true,
          total: data?.totalRecords,
        }}
        handleChange={(pagination, filters, sorter) =>
          onFilterChange(pagination)
        }
        extra={
          <>
            <Col lg={5} sm={24} className={styles.filterWrapper}>
              <SelectUser
                onChange={(value: string) => onInputChange(value)}
                placeholder={formatMessage({
                  id: "myexpenses.list.filters.search",
                })}
                className={classNames(styles.filters, styles.searchFilter)}
              />
            </Col>
            <Col lg={5} xs={24} className={styles.filterWrapper}>
              <DatePicker
                format={DAY_MONTH_YEAR}
                id="start_date"
                value={fromDate ? dayjs(fromDate) : undefined}
                onChange={onStartDateChange}
                placeholder={formatMessage({
                  id: "myexpenses.list.filters.fromDate",
                })}
                className={styles.filters}
              />
            </Col>
            <Col lg={5} xs={24} className={styles.filterWrapper}>
              <DatePicker
                format={DAY_MONTH_YEAR}
                id="end_date"
                value={toDate ? dayjs(toDate) : undefined}
                onChange={onEndDateChange}
                placeholder={formatMessage({
                  id: "myexpenses.list.filters.toDate",
                })}
                className={styles.filters}
              />
            </Col>
          </>
        }
      />
      <AddUpdateRequest isOpen={isModalOpen} handleClose={onClose} />
    </PageLayoutWrapper>
  );
};

export default MyExpensesList;
