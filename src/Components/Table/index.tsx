import { Col, Input, Table as NativeTable, Row } from "antd";
import { LocaleProviderProps } from "antd/lib/locale-provider";
import { TablePaginationConfig } from "antd/lib/table";
import { debounce } from "lodash";
import React, { ChangeEvent, useState } from "react";
import styles from "./styles.module.less";
import { TableRowSelection } from "antd/lib/table/interface";

interface RowSection {}
export interface TableProps {
  columns: any[];
  /** Items to pass on */
  dataSource: any[];
  loading?: boolean;
  handleChange?: (
    pagination: TablePaginationConfig,
    filters?: any,
    sorter?: any
  ) => void;
  /** Display search bar... or not */
  searchable?: boolean;
  /** Title for search bar */
  searchTitle?: string;
  searchPlaceholder?: string;
  /** value for search bar */
  value?: string;
  onSearch?: any;
  /** extra filters,i.e, DatePicker,Range picker etc*/
  extra?: React.ReactNode;
  /**pagination of provided data */
  pagination?: boolean | TablePaginationConfig;
  locale?: LocaleProviderProps;
  bordered?: boolean;
  /** Row selection [config](https://ant.design/components/table/#rowSelection) */
  rowSelection?: Omit<TableRowSelection<any>, "getCheckboxProps">;
  render?: (children: React.ReactNode) => React.ReactNode;
}

export const Table: React.FC<TableProps> = ({
  columns,
  loading,
  dataSource,
  handleChange,
  searchable,
  searchTitle = "Search here",
  searchPlaceholder = "Search",
  value,
  onSearch,
  extra,
  pagination,
  locale,
  bordered = true,
  rowSelection,
  render,
  ...props
}) => {
  const [search, setSearch] = useState(value || "");

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearch(value);
    debounce(() => {
      onSearch(value);
    }, 500)();
  };

  const table = (
    <div className={styles.tableContainer}>
      <NativeTable
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        bordered={bordered}
        locale={{
          ...locale,
          emptyText: loading ? "Loading..." : "No Data Found",
        }}
        pagination={
          typeof pagination === "boolean"
            ? !pagination
              ? false
              : { showSizeChanger: true }
            : pagination
        }
        showSorterTooltip={false}
        onChange={handleChange}
        rowKey={(dataSource) =>
          dataSource._id ? dataSource._id : dataSource.id
        }
        rowSelection={rowSelection}
      />
    </div>
  );
  return (
    <div {...props}>
      {(searchable || extra) && (
        <Row gutter={16} className={styles.filterSection}>
          {searchable && (
            <Col lg={5} md={12} xs={24}>
              <h4>{searchTitle}</h4>
              <Input
                allowClear
                placeholder={searchPlaceholder}
                id="search_here"
                className={styles.search}
                value={search}
                onChange={handleSearch}
              />
            </Col>
          )}
          {extra}
        </Row>
      )}
      {render ? render(table) : table}
    </div>
  );
};
