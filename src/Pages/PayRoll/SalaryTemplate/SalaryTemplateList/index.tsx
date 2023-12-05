import { formatDate } from "@/Components/Formats";
import { Table } from "@/Components/Table";
import Username from "@/Components/Username";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { DATE_FORMATS } from "@/Constant";
import { useSalaryTemplates } from "@/Hooks/templates";
import { SalaryTemplate } from "@/Types/SalaryTemplate";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  EditOutlined,
  FilterFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Col, Input, PageHeader, Row, Space, Tooltip } from "antd";
import debounce from "lodash/debounce";
import get from "lodash/get";
import { ChangeEvent, useState } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import DeleteSalaryTemplate from "../DeleteSalaryTemplate";
import styles from "./styles.module.less";
import SelectUser from "@/Components/SelectUserInput";
import { isUUID } from "@/Utils/generic";
import AddSalaryTemplate from "../AddSalaryTemplate";

const { DAY_MONTH_YEAR } = DATE_FORMATS;
const SalaryTemplateList = () => {
  const [showModal, setShowModal] = useState(false);
  const [salaryTemplateDetails, setsalaryTemplateDetails] =
    useState<SalaryTemplate>();
  const { formatMessage } = useIntl();
  const [params, setParams] = useSearchParams();
  const page = params.get("currentPage") || "1";
  const size = params.get("limit") || "10";
  const sort = params.get("sort") || "createdAt";
  const direction = params.get("direction");
  const search = params.get("search") || "";
  const createdBy = params.get("createdBy") || "";

  const { data: salaryData, isLoading } = useSalaryTemplates({
    currentPage: String(page),
    limit: size,
    search,
    sort,
    direction,
    createdBy,
  });

  const columns = [
    {
      title: formatMessage({ id: "generic.serialNumber" }),
      key: "index",
      render: (__: string, _: any, index: number) =>
        (Number(page) - 1) * Number(size) + index + 1,
    },
    {
      title: formatMessage({ id: "salaryTemplate.columns.templateName" }),
      sorter: true,
      sortOrderIcons: {
        ascend: <CaretUpOutlined id="name_ascend" />,
        descend: <CaretDownOutlined id="name_descend" />,
      },
      dataIndex: "templateName",
      key: "templateName",
    },
    {
      title: formatMessage({ id: "salaryTemplate.columns.description" }),
      dataIndex: "description",
      key: "description",
    },

    {
      title: formatMessage({ id: "salaryTemplate.columns.createdDate" }),
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      sortOrderIcons: {
        ascend: <CaretUpOutlined id="name_ascend" />,
        descend: <CaretDownOutlined id="name_descend" />,
      },
      render: (createdAt: string) => formatDate(createdAt, DAY_MONTH_YEAR),
    },
    {
      title: formatMessage({ id: "salaryTemplate.columns.createdBy" }),
      dataIndex: "createdBy",
      key: "createdBy",
      render: (createdBy: string) =>
        createdBy ? (
          <Username
            id={createdBy}
            idAttribute={`createdby_${createdBy}`}
            type="link"
          />
        ) : (
          "-"
        ),
      filterIcon: <FilterFilled id="createdBy_filter" />,
      onFilter: (value: string, record: Record<string, any>) =>
        record.createdBy.includes(value),
      filterDropdown: () => (
        <div className={styles.filterModal}>
          <h4>
            {formatMessage({
              id: "generic.filter",
            })}
          </h4>
          <SelectUser
            placeholder={formatMessage({
              id: "salaryTemplate.placeholder.filter",
            })}
            value={isUUID(createdBy) ? createdBy : null}
            style={{ width: "100%" }}
            onChange={(value) => setParams({ createdBy: value || "" })}
            id="created_by"
            className={styles.inputField}
          />
        </div>
      ),
    },
    {
      title: formatMessage({ id: "salaryTemplate.columns.updatedAt" }),
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: true,
      sortOrderIcons: {
        ascend: <CaretUpOutlined id="name_ascend" />,
        descend: <CaretDownOutlined id="name_descend" />,
      },
      render: (updatedAt: string) => formatDate(updatedAt, DAY_MONTH_YEAR),
    },
    {
      title: formatMessage({ id: "generic.actions" }),
      key: "action",
      render: (record: SalaryTemplate) => {
        return (
          <Space>
            <Tooltip title={formatMessage({ id: "generic.update" })}>
              <Button
                icon={<EditOutlined />}
                id={`${record._id}_update`}
                onClick={() => {
                  setsalaryTemplateDetails(record);
                  setShowModal(true);
                }}
              />
            </Tooltip>
            <Tooltip title={formatMessage({ id: "generic.delete" })}>
              <span>
                <DeleteSalaryTemplate
                  id={record._id}
                  templateName={record.templateName}
                />
              </span>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const onFilterChange = (
    pagination: Record<string, any>,
    sorter: Record<string, any>,
    filters: Record<string, any>
  ) => {
    const { columnKey, order } = sorter;
    const { current: currentPage, pageSize } = pagination;
    let updatedOrder: string;
    if (order === "ascend") {
      updatedOrder = "asc";
    } else if (order === "descend") {
      updatedOrder = "desc";
    } else {
      updatedOrder = "";
    }
    setParams({
      currentPage: String(currentPage),
      limit: String(pageSize),
      sort: columnKey ? columnKey : "createdAt",
      direction: updatedOrder,
      search,
      createdBy,
    });
  };
  const onInputChange = debounce((value: string) => {
    setParams({
      page: "1",
      limit: String(size),
      search: value,
    });
  }, 500);
  const totalSalaryTemplate = get(salaryData, "totalItems", 0);

  return (
    <PageLayoutWrapper
      breadcurmbs={[
          {
            breadcrumbName: formatMessage({
              id: "breadcrumbs.payroll",
            }),
            path: "/payroll/salary-templates",
          },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.salaryTemplates",
          }),
          path: "/payroll/salary-templates",
        },
      ]}
    >
      <Row>
        <Col flex="auto">
          <PageHeader
            title={formatMessage({ id: "salaryTemplate.title" })}
            ghost={false}
            extra={
              <Button
                type="primary"
                id="add_holiday"
                className={styles.addButton}
                onClick={() => {
                  setsalaryTemplateDetails(undefined);
                  setShowModal(true);
                }}
                icon={<PlusOutlined />}
              >
                {formatMessage({
                  id: "generic.add",
                })}
              </Button>
            }
          />
          <Table
            searchable
            value={!isUUID(search) ? search : ""}
            searchPlaceholder={formatMessage({
              id: "salaryTemplate.placeholder.search",
            })}
            onSearch={(value: string) => onInputChange(value)}
            columns={columns}
            dataSource={salaryData?.data}
            loading={isLoading}
            pagination={{
              pageSize: Number(size),
              current: Number(page),
              showSizeChanger: true,
              total: totalSalaryTemplate,
            }}
            handleChange={(pagination, filters, sorter) =>
              onFilterChange(pagination, sorter, filters)
            }
            bordered
          />
        </Col>
      </Row>
      <AddSalaryTemplate
        showModal={showModal}
        handleClose={() => setShowModal(!showModal)}
        salaryTemplate={salaryTemplateDetails}
      />
    </PageLayoutWrapper>
  );
};

export default SalaryTemplateList;
