import Icon, { ArchiveLogo } from "@/Assets/Images";
import { PermissionContext } from "@/Auth";
import DatePicker, { DatePickerProps } from "@/Components/DatePicker";
import DeleteModal from "@/Components/DeleteModal";
import {
  formatDate,
  formatDateWithTime,
  formatName,
} from "@/Components/Formats";
import { Input } from "@/Components/InputField";
import MobileCard from "@/Components/MobileCard";
import AddAction from "@/Components/PlanLimitations/AddAction";
import DeleteAction from "@/Components/PlanLimitations/DeleteAction";
import SelectRoles from "@/Components/SelectRoleInput";
import { Table } from "@/Components/Table";
import { MyTag } from "@/Components/Tag";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { useUpdateUserMutation, useUsers } from "@/Hooks/emloyee";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import { deleteUser, usersTotalCount } from "@/Services/Users";
import { Role } from "@/Types/Employee";
import { isUUID } from "@/Utils/generic";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  EditFilled,
  EditOutlined,
  FilterFilled,
  PlusOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Input as FieldInput,
  Modal,
  PageHeader,
  Pagination,
  PaginationProps,
  Radio,
  RadioChangeEvent,
  Row,
  Skeleton,
  Space,
  Tooltip,
  message,
} from "antd";
import dayjs from "dayjs";
import { get, snakeCase } from "lodash";
import React, { ChangeEvent, useContext, useEffect } from "react";
import { useIntl } from "react-intl";
import { useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./styles.module.less";

const EmployeeList: React.FC = () => {
  const { user } = useContext(PermissionContext);
  const { formatMessage } = useIntl();
  const { isMobile } = useWindowDimensions();
  const [params, setParams] = useSearchParams();
  const page = params.get("currentPage") || 1;
  const size = params.get("limit") || 10;
  const search = params.get("search") || "";
  const fromDate = params.get("fromDate") || "";
  const toDate = params.get("toDate") || "";
  const field = params.get("field") || "createdAt";
  const sortBy = params.get("sortBy") || "";
  const gender = params.get("gender") || "";
  const login = params.get("login") || "";
  const createdAt = params.get("createdAt") || "";
  const joiningDate = params.get("joiningDate") || "";
  const roles = params.get("roles") || "";
  const action = params.get("action") || "active";
  const navigate = useNavigate();
  const { confirm } = Modal;
  const { mutateAsync: updateUserMutation } = useUpdateUserMutation();
  const { data: totalUser } = useQuery("usersTotalCount", usersTotalCount);
  const count = get(totalUser, "data", 0);
  const totoalUserCount = get(count, "totalRecords", 0);

  useEffect(() => {
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const queryClient = useQueryClient();
  const { data, isLoading } = useUsers({
    currentPage: String(page),
    limit: size,
    search,
    field,
    sortBy,
    fromDate,
    toDate,
    gender,
    login,
    createdAt,
    joiningDate,
    roles,
    action,
  });

  const handleUpdateStatus = async (userId: string) => {
    try {
      const userToUpdate = data?.data.find((user) => user._id === userId);
      if (userToUpdate) {
        const {
          manager,
          lastLoginAt,
          _id,
          __v,
          createdAt,
          updatedAt,
          organisationId,
          document,
          joiningDate,
          ...formData
        } = userToUpdate;
        const roleIds = userToUpdate.roles.map((role) => role._id);
        await updateUserMutation({
          id: userId,
          formData: {
            ...formData,
            status: "inactive",
            roles: roleIds,
          },
        });
        message.success(
          formatMessage({
            id: "employee.messages.archived",
          })
        );
      }
    } catch (error) {
      message.error("Unable to prosess");
    }
  };

  const onInputChange = (value: string) => {
    setParams({
      currentPage: "1",
      limit: String(size),
      search: value,
      field,
      sortBy,
      fromDate,
      toDate,
      action,
    });
  };

  const handleArchived = async (userId: string) => {
    try {
      const userToUpdate = data?.data.find((user) => user._id === userId);
      if (userToUpdate) {
        const {
          manager,
          lastLoginAt,
          _id,
          __v,
          createdAt,
          updatedAt,
          organisationId,
          document,
          joiningDate,
          ...formData
        } = userToUpdate;
        const roleIds = userToUpdate.roles.map((role) => role._id);
        await updateUserMutation({
          id: userId,
          formData: {
            ...formData,
            status: "active",
            roles: roleIds,
          },
        });
        message.success(
          formatMessage({
            id: "employee.messages.unarchived",
          })
        );
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  };

  const PermanentlyDelete = async (employeeId: string) => {
    try {
      await deleteUser(`${employeeId}`, "deleted");
      message.success(
        formatMessage({
          id: "employee.messages.deleted",
        })
      );
      queryClient.invalidateQueries(["all-users"]);
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  };
  const columns = [
    {
      title: formatMessage({
        id: "generic.serialNumber",
      }),
      key: "index",
      render: (text: string, record: any, index: number) =>
        (Number(page) - 1) * Number(size) + index + 1,
    },
    {
      title: formatMessage({
        id: "employee.employeeList.columns.name",
      }),
      key: "name",
      width: "10%",
      sorter: true,
      sortOrderIcons: {
        ascend: <CaretUpOutlined id="name_ascend" />,
        descend: <CaretDownOutlined id="name_descend" />,
      },
      onCell: (value: any) => {
        return {
          onClick: () => {
            navigate(`/employees/${value._id}/overview`);
          },
        };
      },
      render: ({ name }: any) => {
        return (
          <span className={styles.nameLink} id={`employee_${snakeCase(name)}`}>
            {formatName(name)}
          </span>
        );
      },
    },

    {
      title: formatMessage({
        id: "employee.employeeList.columns.email",
      }),
      dataIndex: "email",
      key: "email",
      sorter: true,
      sortOrderIcons: {
        ascend: <CaretUpOutlined id="email_ascend" />,
        descend: <CaretDownOutlined id="email_descend" />,
      },
      render: (email: string) => (
        <a
          href={`mailto:${email}`}
          target="_blank"
          rel="noreferrer"
          id={`${snakeCase(email)}_email`}
        >
          {email}
        </a>
      ),
    },
    {
      title: formatMessage({
        id: "employee.employeeList.columns.contactNo",
      }),
      dataIndex: "contactNumber",
      key: "contactNumber",
      render: (contactNumber: string) => (
        <>
          <a
            href={`tel:${contactNumber}`}
            target="_blank"
            rel="noreferrer"
            id={`${snakeCase(contactNumber)}_contact`}
          >
            {contactNumber}
          </a>
        </>
      ),
    },
    {
      title: formatMessage({
        id: "employee.employeeList.columns.gender",
      }),
      dataIndex: "gender",
      key: "gender",
      filterIcon: <FilterFilled id="gender_filter" />,
      onFilter: (value: string, record: Record<string, any>) =>
        record.gender === value,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: {
        setSelectedKeys: (selectedKeys: string[]) => void;
        selectedKeys: string[];
        confirm: () => void;
        clearFilters: () => void;
      }) => (
        <div className={styles.filterModal}>
          <Radio.Group
            options={[
              {
                label: formatMessage({
                  id: "employee.form.gender.options.female",
                }),
                value: "female",
              },
              {
                label: formatMessage({
                  id: "employee.form.gender.options.male",
                }),
                value: "male",
              },
              {
                label: formatMessage({
                  id: "employee.form.gender.options.other",
                }),
                value: "other",
              },
            ]}
            value={selectedKeys[0] || gender}
            defaultValue={gender || selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            id="gender_select"
          />
          <div>
            <Button
              danger
              onClick={() => {
                setSelectedKeys([]);
                setParams({ gender: "", action });
                clearFilters();
                confirm();
              }}
              id="reset"
            >
              {formatMessage({
                id: "generic.reset",
              })}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                confirm();
                document.body.click();
              }}
              id="apply"
            >
              {formatMessage({
                id: "generic.apply",
              })}
            </Button>
          </div>
        </div>
      ),
      render: (gender: string) => <>{formatName(gender)}</>,
    },
    {
      title: formatMessage({
        id: "employee.employeeList.columns.roles",
      }),
      dataIndex: "roles",
      key: "roles",
      render: (roles: any) => (
        <>
          {roles.map(({ name }: any) => {
            return (
              <div key={name}>
                {roles.length > 5 ? (
                  <>{(roles.length = 5)}</>
                ) : (
                  <MyTag color="blue">{formatName(name)}</MyTag>
                )}
              </div>
            );
          })}
        </>
      ),
    },
    {
      title: formatMessage({
        id: "employee.employeeList.columns.remainingLeaves",
      }),
      dataIndex: "remainingLeaves",
      key: "remainingLeaves",
    },
    {
      title: formatMessage({
        id: "employee.employeeList.columns.lastLogin",
      }),
      dataIndex: "lastLoginAt",
      key: "lastLoginAt",
      filterIcon: <FilterFilled id="last_login_at_filter" />,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        closeDropdown,
      }: {
        setSelectedKeys: (selectedKeys: string[]) => void;
        selectedKeys: string[];
        confirm: () => void;
        clearFilters: () => void;
        closeDropdown: () => void;
      }) => (
        <div className={styles.filterModal}>
          <Radio.Group
            options={[
              {
                label: formatMessage({
                  id: "employee.employeeList.optionsLable.loggedIn",
                }),
                value: "loggedIn",
              },
              {
                label: formatMessage({
                  id: "employee.employeeList.optionsLable.notLoggedIn",
                }),
                value: "notLoggedIn",
              },
            ]}
            value={selectedKeys[0] || login}
            defaultValue={login || selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            id={"select_last_login"}
          />
          <Button
            danger
            onClick={() => {
              setSelectedKeys([]);
              setParams({ login: "", action });
              clearFilters();
              confirm();
              closeDropdown();
            }}
            id="reset"
          >
            {formatMessage({
              id: "generic.reset",
            })}
          </Button>
          <Button
            type="primary"
            onClick={() => {
              confirm();
              closeDropdown();
            }}
            id="apply"
          >
            {formatMessage({
              id: "generic.apply",
            })}
          </Button>
        </div>
      ),
      render: (lastLoginAt: string) => (
        <>
          {lastLoginAt
            ? formatDateWithTime(lastLoginAt)
            : formatMessage({
                id: "employee.messages.notLoggedIn",
              })}
        </>
      ),
    },
    {
      title: formatMessage({
        id: "employee.employeeList.columns.createdDate",
      }),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: any) => {
        return <>{formatDate(createdAt)}</>;
      },
    },
    {
      title: formatMessage({
        id: "employee.employeeList.columns.joiningDate",
      }),
      dataIndex: "joiningDate",
      key: "joiningDate",
      sorter: true,
      sortOrderIcons: {
        ascend: <CaretUpOutlined id="joining_date_ascend" />,
        descend: <CaretDownOutlined id="joining_date_descend" />,
      },
      render: (joiningDate: string) =>
        joiningDate ? dayjs(joiningDate).format("DD-MM-YYYY") : <span>-</span>,
    },
    {
      title: formatMessage({
        id: "employee.employeeList.columns.action",
      }),
      key: "action",
      fixed: "right",
      render: (record: any) => {
        return action === "deleted" ? (
          <Space>
            <Tooltip
              title={formatMessage({
                id: "employee.employeeList.columns.unarchived",
              })}
            >
              <span>
                <Button
                  icon={<RedoOutlined />}
                  id={`${snakeCase(record.name)}_unarchive`}
                  className={styles.editBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    confirm({
                      title: formatMessage(
                        {
                          id: "employee.employeeList.confirmModalTitle.unarchived",
                        },
                        {
                          name: formatName(record.name),
                        }
                      ),
                      okText: formatMessage({
                        id: "generic.yes",
                      }),
                      onOk: () => handleArchived(record._id),
                      cancelText: formatMessage({
                        id: "generic.no",
                      }),
                      centered: true,
                      okButtonProps: {
                        id: "yes",
                      },
                      cancelButtonProps: {
                        id: "no",
                      },
                    });
                  }}
                />
              </span>
            </Tooltip>
            <Tooltip
              title={formatMessage({
                id: "employee.employeeList.columns.Delete",
              })}
            >
              <DeleteAction
                module="users"
                tooltipTitle={formatMessage(
                  {
                    id: "employee.employeeList.tooltip.deleteUser",
                  },
                  {
                    Link: (
                      <Link to="/plans" className={styles.upgradeTitle}>
                        {formatMessage({
                          id: "employee.employeeList.tooltip.upgrade",
                        })}
                      </Link>
                    ),
                  }
                )}
              >
                <DeleteModal
                  title={formatMessage({
                    id: "employee.employeeList.confirmModalTitle.delete",
                  })}
                  name={`${formatName(record.name)}`}
                  handleOk={() => PermanentlyDelete(record._id)}
                  deleteingKey={record.name}
                />
              </DeleteAction>
            </Tooltip>
          </Space>
        ) : (
          <Space>
            <Tooltip
              title={formatMessage({
                id: "employee.employeeList.columns.update",
              })}
            >
              <Link to={`/employees/${record._id}/employee-details`}>
                <Button
                  icon={<EditOutlined />}
                  id={`${snakeCase(record.name)}_edit`}
                  className={styles.editBtn}
                />
              </Link>
            </Tooltip>
            <Tooltip
              title={formatMessage({
                id: "employee.employeeList.columns.archive",
              })}
            >
              <span>
                <DeleteModal
                  id={`${snakeCase(record.name)}_archive`}
                  customIcon={<Icon icon={ArchiveLogo} />}
                  title={formatMessage(
                    {
                      id: "employee.employeeList.confirmModalTitle.archive",
                    },
                    {
                      name: formatName(record.name),
                    }
                  )}
                  handleOk={() => {
                    handleUpdateStatus(record._id);
                  }}
                  deleteingKey={record.name}
                  okButtonText={formatMessage({
                    id: "generic.archive",
                  })}
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
    const { lastLoginAt, gender, roles } = filters;

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
      action,
      currentPage: String(currentPage),
      limit: String(pageSize),
      field: columnKey ? columnKey : "createdAt",
      sortBy: updatedOrder,
      login: lastLoginAt ? lastLoginAt[0] : "",
      search,
      fromDate,
      toDate,
      gender: gender ? gender[0] : "",
      roles: roles ? roles : "",
    });
  };

  const onStartDateChange: DatePickerProps["onChange"] = (value) => {
    setParams({
      ...params,
      action,
      search,
      currentPage: "1",
      limit: String(size),
      joiningDate: createdAt ? "" : "true",
      createdAt: createdAt ? "true" : "",
      fromDate: value ? value.format("YYYY-MM-DD") : "",
      toDate,
    });
  };
  const onEndDateChange: DatePickerProps["onChange"] = (value) => {
    setParams({
      ...params,
      action,
      search,
      currentPage: "1",
      limit: String(size),
      joiningDate: joiningDate ? "true" : "",
      createdAt: joiningDate ? "" : "true",
      fromDate,
      toDate: value ? value.format("YYYY-MM-DD") : "",
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
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.employees",
          }),
          path: "/employees",
        },
      ]}
    >
      <div className={styles.radioBtn}>
        <Row align="middle" className="d-block">
          <Col lg={24} xs={24}>
            <Radio.Group
              onChange={({ target }: RadioChangeEvent) => {
                setParams({
                  ...params,
                  action: target.value,
                });
              }}
              className={styles.radioButton}
              defaultValue={action === "deleted" ? "deleted" : "active"}
              optionType="button"
              buttonStyle="solid"
              id="select_employye_list_types"
            >
              <Radio.Button value="active" id="active_employees">
                {formatMessage({
                  id: "employee.employeeList.title.employeesList",
                })}
              </Radio.Button>
              <Radio.Button value="deleted" id="archived_employees">
                {formatMessage({
                  id: "employee.employeeList.title.archivedList",
                })}
              </Radio.Button>
            </Radio.Group>
          </Col>
          <Col lg={24} xs={24} className={styles.EmployeeSection}>
            <PageHeader
              className={styles.EmployeeHeading}
              ghost={false}
              title={
                action === "active"
                  ? formatMessage({
                      id: "employee.employeeList.pageHeaderTitle.allEmployees",
                    })
                  : formatMessage({
                      id: "employee.employeeList.pageHeaderTitle.allArchivedEmployees",
                    })
              }
              extra={[
                action === "active" ? (
                  <AddAction
                    module="users"
                    tooltipTitle={formatMessage(
                      {
                        id: "employee.employeeList.tooltip.addUsers",
                      },
                      {
                        totalUsers: totoalUserCount,
                        Link: (
                          <Link to="/plans" className={styles.upgradeTitle}>
                            {formatMessage({
                              id: "employee.employeeList.tooltip.upgrade",
                            })}
                          </Link>
                        ),
                      }
                    )}
                    totalRecords={totoalUserCount}
                  >
                    <Button key="1" type="primary" id="employee_add">
                      <Link to="/employees/new/employee-details">
                        <PlusOutlined />
                        {formatMessage({
                          id: "generic.add",
                        })}
                      </Link>
                    </Button>
                  </AddAction>
                ) : (
                  ""
                ),
              ]}
            />
            {!isMobile && (
              <Table
                searchable
                value={!isUUID(search) ? search : ""}
                searchPlaceholder={formatMessage({
                  id: "employee.employeeList.placeholder.search",
                })}
                onSearch={(value: string) => onInputChange(value)}
                bordered={true}
                pagination={{
                  pageSize: Number(size),
                  current: Number(page),
                  showSizeChanger: true,
                  total: data?.totalRecords,
                }}
                handleChange={(pagination, filters, sorter) =>
                  onFilterChange(pagination, sorter, filters)
                }
                columns={columns}
                loading={isLoading}
                dataSource={data?.data || []}
                extra={
                  <>
                    <Col lg={5} md={12} xs={24} className={styles.InputField}>
                      <span className="mb-2 d-block ">
                        {formatMessage({
                          id: "employee.employeeList.title.filterByRoles",
                        })}
                      </span>
                      <SelectRoles
                        defaultValue={roles ? JSON.parse(roles) : []}
                        onChange={(
                          selectedRoles: string[],
                          option: Record<string, any>
                        ) => {
                          const allRoles = Array.isArray(option)
                            ? option.map((opt) => opt.label)
                            : [option.label];
                          const roleName =
                            allRoles.length > 0 ? JSON.stringify(allRoles) : "";

                          return setParams({
                            ...params,
                            action,
                            roles: roleName,
                            currentPage: "1",
                            limit: String(size),
                          });
                        }}
                      />
                    </Col>
                    <Col lg={4} md={12} xs={24} className={styles.selectDate}>
                      <span className="mb-2 d-block">
                        {formatMessage({
                          id: "employee.employeeList.title.filterBy",
                        })}
                      </span>
                      <Input
                        id="employee_joining_date"
                        type="select"
                        placeholder={formatMessage({
                          id: "employee.employeeList.placeholder.filterBy",
                        })}
                        defaultValue="joiningDate"
                        options={[
                          {
                            label: formatMessage({
                              id: "employee.employeeList.columns.createdDate",
                            }),
                            value: "createdAt",
                          },
                          {
                            label: formatMessage({
                              id: "employee.employeeList.columns.joiningDate",
                            }),
                            value: "joiningDate",
                          },
                        ]}
                        onChange={(value: any) => {
                          if (value === "createdAt") {
                            setParams({ createdAt: "true", joiningDate: "" });
                          } else if (value === "joiningDate") {
                            setParams({ createdAt: "", joiningDate: "true" });
                          }
                        }}
                      />
                    </Col>
                    <Col lg={5} md={12} xs={24} className={styles.startDate}>
                      <span className="mb-2 d-block">
                        {formatMessage({
                          id: "employee.employeeList.title.startDate",
                        })}
                      </span>
                      <DatePicker
                        format="DD-MM-YYYY"
                        id="employee_start_date"
                        onChange={onStartDateChange}
                        value={fromDate ? dayjs(fromDate) : undefined}
                        placeholder={formatMessage({
                          id: "employee.employeeList.placeholder.startDate",
                        })}
                      />
                    </Col>
                    <Col lg={5} md={12} xs={24} className={styles.endDate}>
                      <span className="mb-2 d-block">
                        {formatMessage({
                          id: "employee.employeeList.title.endDate",
                        })}
                      </span>
                      <DatePicker
                        format="DD-MM-YYYY"
                        id="employee_end_date"
                        onChange={onEndDateChange}
                        value={toDate ? dayjs(toDate) : undefined}
                        placeholder={formatMessage({
                          id: "employee.employeeList.placeholder.endDate",
                        })}
                      />
                    </Col>
                  </>
                }
              />
            )}

            {isMobile && (
              <div>
                <FieldInput
                  placeholder={formatMessage({
                    id: "employee.employeeList.placeholder.search",
                  })}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onInputChange(e.target.value)
                  }
                />
                <Skeleton active loading={isLoading}>
                  {React.Children.toArray(
                    data?.data.map((data, index) => (
                      <MobileCard
                        key={index}
                        title={
                          <Link to={`/employees/${data._id}/overview`}>
                            {formatName(data.name)}
                          </Link>
                        }
                        cardNumber={
                          (Number(page) - 1) * Number(size) + index + 1
                        }
                        extra={
                          action === "deleted" ? (
                            <Space>
                              <Button
                                icon={<RedoOutlined />}
                                id="list_edit_icon"
                                className={styles.editBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirm({
                                    title: formatMessage(
                                      {
                                        id: "employee.employeeList.confirmModalTitle.archive",
                                      },
                                      {
                                        name: formatName(data.name),
                                      }
                                    ),
                                    okText: "Yes",
                                    onOk: () => handleArchived(data._id),
                                    cancelText: "No",
                                    centered: true,
                                  });
                                }}
                              />
                              <DeleteModal
                                title={formatMessage({
                                  id: "employee.employeeList.confirmModalTitle.delete",
                                })}
                                name={formatName(data.name)}
                                handleOk={() => PermanentlyDelete(data._id)}
                                deleteingKey={data.name}
                              />
                            </Space>
                          ) : (
                            <Space>
                              <div
                                className={`${styles.edit} ${styles.action}`}
                              >
                                <Link
                                  to={`/employees/${data._id}/employee-details`}
                                >
                                  <EditFilled key="update" />
                                </Link>
                              </div>

                              <DeleteModal
                                isMobileDelete
                                customIcon={<Icon icon={ArchiveLogo} />}
                                title={formatMessage(
                                  {
                                    id: "employee.employeeList.confirmModalTitle.archive",
                                  },
                                  {
                                    name: formatName(data.name),
                                  }
                                )}
                                handleOk={() => handleUpdateStatus(data._id)}
                                deleteingKey={data.name}
                                okButtonText={formatMessage({
                                  id: "generic.archive",
                                })}
                              />
                            </Space>
                          )
                        }
                      >
                        <Row>
                          <Col md={8} xs={12}>
                            <b>
                              {formatMessage({
                                id: "employee.employeeList.columns.email",
                              })}
                            </b>
                          </Col>
                          <Col md={16} xs={12} className={styles.rightData}>
                            <p>{data.email}</p>
                          </Col>
                          <Col md={8} xs={12}>
                            <b>
                              {formatMessage({
                                id: "employee.employeeList.columns.contactNo",
                              })}
                            </b>
                          </Col>
                          <Col md={16} xs={12} className={styles.rightData}>
                            <p>{data.contactNumber} </p>
                          </Col>
                          <Col md={8} xs={12}>
                            <b>
                              {formatMessage({
                                id: "employee.employeeList.columns.roles",
                              })}
                            </b>
                          </Col>
                          <Col md={16} xs={12} className={styles.rightData}>
                            {data.roles.map(({ name }: Role) => {
                              return <div key={name}>{formatName(name)}</div>;
                            })}
                          </Col>
                          <Col md={8} xs={12}>
                            <b>
                              {formatMessage({
                                id: "employee.employeeList.columns.remainingLeaves",
                              })}
                            </b>
                          </Col>
                          <Col md={16} xs={12} className={styles.rightData}>
                            <p>{data.remainingLeaves || 0}</p>
                          </Col>
                          <Col md={8} xs={12}>
                            <b>
                              {formatMessage({
                                id: "employee.employeeList.columns.lastLogin",
                              })}
                            </b>
                          </Col>
                          <Col md={16} xs={12} className={styles.rightData}>
                            <p>{formatDate(data.lastLoginAt)}</p>
                          </Col>
                          <Col md={8} xs={12}>
                            <b>
                              {formatMessage({
                                id: "employee.employeeList.columns.createdDate",
                              })}
                            </b>
                          </Col>
                          <Col md={16} xs={12} className={styles.rightData}>
                            <p>{formatDate(data.createdAt)}</p>
                          </Col>
                          <Col md={8} xs={12}>
                            <b>
                              {formatMessage({
                                id: "employee.employeeList.columns.joiningDate",
                              })}
                            </b>
                          </Col>
                          <Col md={16} xs={12} className={styles.rightData}>
                            <p>{formatDate(data.joiningDate)}</p>
                          </Col>
                        </Row>
                      </MobileCard>
                    ))
                  )}
                </Skeleton>
                <div className={styles.mobilePagination}>
                  {!isLoading && (
                    <Pagination
                      size="small"
                      total={data?.totalRecords}
                      pageSize={Number(size)}
                      current={Number(page)}
                      onChange={onMobilePagination}
                    />
                  )}
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </PageLayoutWrapper>
  );
};
export default EmployeeList;
