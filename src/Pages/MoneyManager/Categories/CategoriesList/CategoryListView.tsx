import Username from "@/Components/Username";
import { DATE_FORMATS } from "@/Constant";
import { EditOutlined } from "@ant-design/icons";
import { List } from "antd";
import React from "react";
import { useIntl } from "react-intl";
import DeleteCategory from "../DeleteCategory";
import { CategoryViewProps } from "./CategoryTableView";
import dayjs from "dayjs";

const { DAY_MONTH_YEAR } = DATE_FORMATS;

const CategoryListView: React.FC<CategoryViewProps> = ({
  search,
  onSearch,
  isLoading,
  pagination,
  data,
  handleChange,
  onEdit,
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <List
        dataSource={data}
        loading={isLoading}
        pagination={pagination}
        renderItem={(item) => {
          return (
            <List.Item
              actions={[
                <a
                  id={`${item._id}_update`}
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit(item);
                  }}
                >
                  <EditOutlined />
                </a>,
                <DeleteCategory
                  id={item._id}
                  categoryName={item.name}
                  isMobile
                />,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={
                  <div>
                    <div>{item.description}</div>
                    <span>
                      {formatMessage({
                        id: "categories.list.columns.createdAt",
                      })}
                      : {dayjs(item.createdAt).format(DAY_MONTH_YEAR)}
                    </span>
                    <div>
                      {formatMessage({
                        id: "categories.list.columns.createdBy",
                      })}
                      : <Username id={item.createdBy} type="link" />
                    </div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default CategoryListView;
