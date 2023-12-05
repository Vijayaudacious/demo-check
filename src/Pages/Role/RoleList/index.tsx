import DeleteModal from "@/Components/DeleteModal";
import { formatName } from "@/Components/Formats";
import MobileCard from "@/Components/MobileCard";
import { Table } from "@/Components/Table";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { useAllActions, useDeleteRoleMutation, useRoles } from "@/Hooks/Roles";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import { Role } from "@/Types/Role";
import { titleCase } from "@/Utils/generic";
import {
  CheckOutlined,
  CloseOutlined,
  EditFilled,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  PageHeader,
  Pagination,
  PaginationProps,
  Row,
  Space,
  Tooltip,
  message,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import { snakeCase } from "lodash";
import get from "lodash/get";
import React, { ChangeEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./styles.module.less";
import { useIntl } from "react-intl";

const RoleList: React.FC = () => {
  const { isMobile } = useWindowDimensions();
  const { formatMessage } = useIntl();
  const { data: actions } = useAllActions();

  const [params, setParams] = useSearchParams();
  const page = params.get("currentPage") || 1;
  const size = params.get("limit") || 10;
  const search = params.get("search") || "";
  const field = params.get("field") || "createdAt";
  const sortBy = params.get("sortBy") || "";

  const { mutateAsync: deleteRoleMutation, isLoading: isDeleting } =
    useDeleteRoleMutation();

  const { isLoading, data } = useRoles({
    currentPage: String(page),
    limit: size,
    search,
    field,
    sortBy,
  });

  const onRoleSearch = (value: string) => {
    setParams({
      currentPage: "1",
      limit: String(size),
      search: value,
      field,
      sortBy,
    });
  };

  const columns: ColumnsType<Role> = [
    {
      title: formatMessage({
        id: "generic.serialNumber",
      }),
      key: "index",
      fixed: "left",
      render: (text: string, record: any, index: number) =>
        (Number(page) - 1) * Number(size) + index + 1,
    },
    {
      fixed: "left",
      title: formatMessage({
        id: "roles.columns.name",
      }),
      dataIndex: "name",
      key: "name",
      width: "10%",
      sorter: true,
      render: (name: string) => {
        return <>{titleCase(name)}</>;
      },
    },
    {
      title: formatMessage({
        id: "roles.columns.description",
      }),
      dataIndex: "description",
      key: "description",
      width: "20%",
      render: (description: string) => <>{description ? description : "---"}</>,
    },
    {
      title: formatMessage({
        id: "roles.columns.permissions",
      }),
      children: Object.keys(actions || {}).map((action) => ({
        title: titleCase(action),
        children: Object.keys((actions || {})[action]).map((actionKey) => ({
          title: titleCase(actionKey),
          render: (role: any) => {
            return get(role, `permission.${action}`, []).includes(actionKey) ? (
              <CheckOutlined className={styles.permission} />
            ) : (
              <CloseOutlined className={styles.noPermission} />
            );
          },
        })),
      })),
    },
    {
      title: formatMessage({
        id: "generic.actions",
      }),
      key: "action",
      fixed: "right",
      render: (record: any) => {
        return (
          <>
            <Space>
              <Tooltip
                title={formatMessage({
                  id: "roles.tooltipTitle.update",
                })}
              >
                <Link to={`/roles/${record._id}/update`}>
                  <Button
                    className={styles.actionButtons}
                    icon={<EditOutlined />}
                    type="primary"
                    ghost
                    id={`${snakeCase(record.name)}_edit`}
                  />
                </Link>
              </Tooltip>
              <Tooltip
                title={formatMessage({
                  id: "roles.tooltipTitle.delete",
                })}
              >
                <span>
                  <DeleteModal
                    title={formatMessage({
                      id: "roles.deleteModal.title",
                    })}
                    name={formatName(record.name)}
                    handleOk={() => handleDelete(record._id)}
                    deleteingKey={record.name}
                  />
                </span>
              </Tooltip>
            </Space>
          </>
        );
      },
    },
  ];

  const handleDelete = async (roleId: string) => {
    try {
      const { data } = await deleteRoleMutation(roleId);
      message.success(data.message);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  };
  const onFilterChange = (
    pagination: Record<string, any>,
    sorter: Record<string, any>
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

  const onMobilePagination: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    setParams({
      currentPage: String(current),
      limit: String(pageSize),
    });
  };

  return (
    <PageLayoutWrapper
      breadcurmbs={[{ breadcrumbName: "Roles", path: "/roles" }]}
    >
      <Col flex="auto" className={styles.mainSection}>
        <PageHeader
          ghost={false}
          title={formatMessage({
            id: "roles.title.allRoles",
          })}
          extra={[
            <Link
              to={`/roles/new`}
              onClick={(e) => {
                e.stopPropagation();
              }}
              key="1"
            >
              <Button
                type="primary"
                className={styles.add_employee}
                id="add_role"
                icon={<PlusOutlined />}
              >
                {formatMessage({
                  id: "generic.add",
                })}
              </Button>
            </Link>,
          ]}
        />

        {!isMobile && (
          <div className={styles.roleTable}>
            <Table
              bordered
              searchable
              searchPlaceholder={formatMessage({
                id: "roles.placeholder.searchPlaceholder",
              })}
              onSearch={(value: string) => onRoleSearch(value)}
              value={search}
              pagination={{
                pageSize: Number(size),
                current: Number(page),
                showSizeChanger: true,
                total: data?.totalRecords,
              }}
              handleChange={(pagination, filter, sorter) =>
                onFilterChange(pagination, sorter)
              }
              columns={columns}
              loading={isLoading}
              dataSource={data?.data || []}
            />
          </div>
        )}

        {isMobile && (
          <div>
            <Input
              className="w-75"
              placeholder={formatMessage({
                id: "roles.placeholder.searchPlaceholder",
              })}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onRoleSearch(e.target.value)
              }
            />
            {React.Children.toArray(
              data?.data.map((data: Record<string, string>, index) => {
                return (
                  <MobileCard
                    title={formatName(data.name)}
                    cardNumber={(Number(page) - 1) * Number(size) + index + 1}
                    subTitle={formatMessage({
                      id: "roles.columns.permissions",
                    })}
                    extra={
                      <Space className="mr-5">
                        <Link to={`/roles/${data._id}/update`}>
                          <Button
                            type="link"
                            className={`${styles.actionEdit}`}
                          >
                            <EditFilled key="update" />
                          </Button>
                        </Link>
                        <DeleteModal
                          title={formatMessage({
                            id: "roles.deleteModal.title",
                          })}
                          name={formatName(data.name)}
                          handleOk={() => handleDelete(data._id)}
                          deleteingKey={data.name}
                        />
                      </Space>
                    }
                  >
                    <Row>
                      {Object.keys(actions || {}).map((action) => {
                        return (
                          <>
                            <Col xs={24} key={action}>
                              <b>{titleCase(action)}</b>
                            </Col>
                            <Col xs={24}>
                              <Row>
                                {Object.keys((actions || {})[action]).map(
                                  (actionKey) => {
                                    return (
                                      <Col xs={12} key={actionKey}>
                                        {get(
                                          data,
                                          `permission.${action}`
                                        )?.includes(actionKey) ? (
                                          <CheckOutlined
                                            className={styles.permission}
                                          />
                                        ) : (
                                          <CloseOutlined
                                            className={styles.noPermission}
                                          />
                                        )}
                                        <span>{titleCase(actionKey)}</span>
                                      </Col>
                                    );
                                  }
                                )}
                              </Row>
                            </Col>
                          </>
                        );
                      })}
                    </Row>
                  </MobileCard>
                );
              })
            )}
            <div className={styles.mobilePagination}>
              <Pagination
                size="small"
                total={data?.totalRecords}
                pageSize={Number(size)}
                current={Number(page)}
                onChange={onMobilePagination}
              />
            </div>
          </div>
        )}
      </Col>
    </PageLayoutWrapper>
  );
};

export default RoleList;
