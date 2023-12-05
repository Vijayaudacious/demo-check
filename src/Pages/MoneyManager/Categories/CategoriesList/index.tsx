import { Table } from "@/Components/Table";
import Username from "@/Components/Username";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { DATE_FORMATS, FILTER } from "@/Constant";
import { useCategories } from "@/Hooks/categories";
import { Category } from "@/Types/Categories";
import { SortingFilter } from "@/Types/SortingFilter";
import { isUUID } from "@/Utils/generic";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  PageHeader,
  Space,
  TablePaginationConfig,
  Tooltip,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import DeleteCategory from "../DeleteCategory";
import AddCategories from "../AddCategories";
import CategoryTableView, { CategoryViewProps } from "./CategoryTableView";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import CategoryListView from "./CategoryListView";

const { LIMIT, CUREENT_PAGE: CURRENT_PAGE, FIELD } = FILTER;

const CategoriesList = () => {
  const { formatMessage } = useIntl();
  const [params, setParams] = useSearchParams();
  const { isMobile } = useWindowDimensions();

  const page = params.get("currentPage") || CURRENT_PAGE;
  const size = params.get("limit") || LIMIT;
  const search = params.get("search") || "";
  const field = params.get("field") || FIELD;
  const sortBy = params.get("sortBy") || "";
  const [showModal, setShowModal] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState<Category>();

  const { isLoading, data } = useCategories({
    currentPage: String(page),
    limit: size,
    search,
    field,
    sortBy,
  });

  const onFilterChange = (
    pagination: TablePaginationConfig,
    sorter: SortingFilter
  ) => {
    const { field, order } = sorter;
    const { current: currentPage, pageSize } = pagination;
    let updatedOrder: string;
    if (order === "ascend") {
      updatedOrder = "1";
    } else if (order === "descend") {
      updatedOrder = "-1";
    } else {
      updatedOrder = "";
    }
    setParams({
      currentPage: String(currentPage),
      limit: String(pageSize),
      search,
      field: updatedOrder ? field : "",
      sortBy: updatedOrder,
    });
  };

  const onInputChange = (value: string) => {
    setParams({
      currentPage: "1",
      limit: String(size),
      search: value,
    });
  };

  const listProps: CategoryViewProps = {
    onSearch: (value: string) => onInputChange(value),
    data: data?.data || [],
    handleChange: (pagination, filter, sorter) =>
      onFilterChange(pagination, sorter),

    isLoading: isLoading,
    pagination: {
      pageSize: Number(size),
      current: Number(page),
      showSizeChanger: true,
      total: data?.totalRecords,
    },
    search,
    onEdit: (category) => {
      setCategoryDetails(category);
      setShowModal(true);
    },
  };

  return (
    <PageLayoutWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.moneyManager",
          }),
          path: "/money-manager/categories",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.categories",
          }),
          path: "",
        },
      ]}
    >
      <PageHeader
        title={formatMessage({
          id: "categories.title",
        })}
        ghost={false}
        extra={
          <Button
            type="primary"
            id="add_categories"
            onClick={() => setShowModal(true)}
            icon={<PlusOutlined />}
          >
            {formatMessage({
              id: "generic.add",
            })}
          </Button>
        }
      />

      {isMobile ? (
        <CategoryListView {...listProps} />
      ) : (
        <CategoryTableView {...listProps} />
      )}

      <AddCategories
        showModal={showModal}
        handleClose={() => setShowModal(!showModal)}
        categories={categoryDetails}
      />
    </PageLayoutWrapper>
  );
};

export default CategoriesList;
