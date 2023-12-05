import { Table, TableProps } from "@/Components/Table";
import { Category } from "@/Types/Categories";
import { isUUID } from "@/Utils/generic";
import React from "react";
import { useIntl } from "react-intl";
import DeleteCategory from "../DeleteCategory";
import { Button, Space, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { ColumnsType, TablePaginationConfig } from "antd/lib/table";
import Username from "@/Components/Username";
import dayjs from "dayjs";
import { DATE_FORMATS } from "@/Constant";
import { PaginationConfig } from "antd/lib/pagination";

const { DAY_MONTH_YEAR } = DATE_FORMATS;

export type CategoryViewProps = {
  search: string;
  onSearch: TableProps["onSearch"];
  isLoading: boolean;
  pagination: PaginationConfig;
  data: Category[];
  handleChange: TableProps["handleChange"];
  onEdit: (record: Category) => void;
};
const CategoryTableView: React.FC<CategoryViewProps> = ({
  search,
  onSearch,
  isLoading,
  pagination,
  data,
  handleChange,
  onEdit,
}) => {
  const { formatMessage } = useIntl();

  const columns: ColumnsType<Category[]> = [
    {
      title: formatMessage({ id: "generic.serialNumber" }),
      key: "index",
      render: (__: string, _: any, index: number) =>
        (Number(pagination.current) - 1) * Number(pagination.pageSize) +
        index +
        1,
    },
    {
      title: formatMessage({
        id: "categories.list.columns.name",
      }),
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: "20%",
    },
    {
      title: formatMessage({
        id: "categories.list.columns.description",
      }),
      dataIndex: "description",
      key: "description",
      width: "50%",
    },
    {
      title: formatMessage({
        id: "categories.list.columns.createdBy",
      }),
      dataIndex: "createdBy",
      key: "createdBy",
      render: (createdBy) =>
        createdBy ? (
          <Username
            idAttribute={`createdBy_${createdBy}`}
            id={createdBy}
            type="link"
          />
        ) : (
          "-"
        ),
    },
    {
      title: formatMessage({
        id: "categories.list.columns.createdAt",
      }),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) =>
        createdAt ? dayjs(createdAt).format(DAY_MONTH_YEAR) : <span>-</span>,
    },
    {
      title: formatMessage({
        id: "categories.list.columns.updatedAt",
      }),
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt) =>
        updatedAt ? dayjs(updatedAt).format(DAY_MONTH_YEAR) : <span>-</span>,
    },
    {
      title: formatMessage({
        id: "categories.list.columns.action",
      }),
      key: "action",
      render: (record: Category) => {
        return (
          <>
            <Space>
              <Tooltip
                title={formatMessage({
                  id: "categories.list.tooltipTitle.update",
                })}
              >
                <Button
                  icon={<EditOutlined />}
                  id={`${record._id}_update`}
                  onClick={() => onEdit(record)}
                />
              </Tooltip>
              <Tooltip
                title={formatMessage({
                  id: "categories.list.tooltipTitle.delete",
                })}
              >
                <span>
                  <DeleteCategory
                    id={record?._id}
                    categoryName={record?.name}
                  />
                </span>
              </Tooltip>
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <Table
      searchable
      value={!isUUID(search) ? search : ""}
      onSearch={onSearch}
      searchPlaceholder={formatMessage({
        id: "categories.list.searchPlaceholder",
      })}
      columns={columns}
      bordered
      loading={isLoading}
      dataSource={data}
      pagination={pagination as TablePaginationConfig}
      handleChange={handleChange}
    />
  );
};

export default CategoryTableView;
