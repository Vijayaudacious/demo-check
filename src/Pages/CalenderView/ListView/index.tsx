import DatePicker, { DatePickerProps } from "@/Components/DatePicker";
import { formatDateWithTime, formatName } from "@/Components/Formats";
import MobileCard from "@/Components/MobileCard";
import DataVisbilityControl from "@/Components/PlanLimitations/MonthAction";
import { Table } from "@/Components/Table";
import LeavesWrapper from "@/Components/Wrappers/LeaveWrapper";
import { COLOR_STATUS, DATE_FORMATS, FILTER } from "@/Constant";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import { leaveApproved, listLeave } from "@/Services/Leaves";
import { Leave } from "@/Types/Leaves";
import { isUUID } from "@/Utils/generic";
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Col,
  Form,
  Input,
  Pagination,
  PaginationProps,
  Row,
  Space,
  Tag,
  Tooltip,
  message,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import dayjs from "dayjs";
import React, { ChangeEvent, useState } from "react";
import { useIntl } from "react-intl";
import { useQuery, useQueryClient } from "react-query";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./styles.module.less";
import Username from "@/Components/Username";
import Modal from "@/Components/Modal";
import confirm from "antd/lib/modal/confirm";

const { YEAR_MONTH_DAY, DAY_MONTH_YEAR } = DATE_FORMATS;
const { LIMIT, CUREENT_PAGE } = FILTER;

const ListView: React.FC = () => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const { isMobile } = useWindowDimensions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rejectLeave, setRejectLeave] = useState("");
  const [params, setParams] = useSearchParams();
  const page = params.get("currentPage") || CUREENT_PAGE;
  const size = params.get("limit") || LIMIT;
  const search = params.get("search") || "";
  const fromDate = params.get("fromDate")
    ? dayjs(params.get("fromDate")).format(YEAR_MONTH_DAY)
    : dayjs().startOf("month").format(YEAR_MONTH_DAY);
  const toDate = params.get("toDate")
    ? dayjs(params.get("toDate")).format(YEAR_MONTH_DAY)
    : dayjs().endOf("month").format(YEAR_MONTH_DAY);

  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery(
    ["list-view", { page, size, search, fromDate, toDate }],
    () =>
      listLeave({
        currentPage: String(page),
        limit: size,
        search,
        fromDate,
        toDate,
      })
  );
  const handleSearchChange = (value: string) => {
    setParams({
      currentPage: "1",
      limit: String(size),
      search: value,
      fromDate,
      toDate,
    });
  };

  const onPaginationChange = (currentPage: number, pageSize: number) => {
    setParams({
      currentPage: String(currentPage),
      limit: String(pageSize),
      search,
      fromDate,
      toDate,
    });
  };

  const onStartDateChange: DatePickerProps["onChange"] = (value) => {
    setParams({
      search,
      currentPage: "1",
      limit: String(size),
      fromDate: value
        ? value.format(YEAR_MONTH_DAY)
        : dayjs().startOf("month").format(YEAR_MONTH_DAY),
      toDate,
    });
  };

  const onEndDateChange: DatePickerProps["onChange"] = (value) => {
    setParams({
      search,
      currentPage: "1",
      limit: String(size),
      fromDate,
      toDate: value
        ? value.format(YEAR_MONTH_DAY)
        : dayjs().endOf("month").format(YEAR_MONTH_DAY),
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: formatMessage({ id: "generic.serialNumber" }),
      key: "index",
      render: (text: string, record: any, index: number) =>
        (Number(page) - 1) * Number(size) + index + 1,
    },
    {
      title: formatMessage({
        id: "listView.list.columns.startDate",
      }),
      key: "startDate",
      dataIndex: "startDate",
      render: (start: any) => {
        const formatStartDate = start.split("T");
        return <>{dayjs(formatStartDate[0]).format(DAY_MONTH_YEAR)}</>;
      },
    },
    {
      title: formatMessage({
        id: "listView.list.columns.endDate",
      }),
      key: "endDate",
      dataIndex: "endDate",
      render: (end: any) => {
        const formatEndDate = end.split("T");
        return <>{dayjs(formatEndDate[0]).format(DAY_MONTH_YEAR)}</>;
      },
    },

    {
      title: formatMessage({
        id: "listView.list.columns.leaveCount",
      }),
      dataIndex: "totalCountDay",
      key: "totalCountDay",
      render: (totalCountDay: Leave, record: Leave) => {
        const { startDateHalfDayDetails, endDateHalfDayDetails } =
          record.halfDayLeaves;
        const startDateHalf =
          startDateHalfDayDetails === 1
            ? `(${formatMessage({ id: "dashboard.leaveType.firstHalf" })})`
            : startDateHalfDayDetails === 2
            ? `(${formatMessage({ id: "dashboard.leaveType.secondHalf" })})`
            : "";
        const endDateHalf =
          endDateHalfDayDetails === 1
            ? `(${formatMessage({ id: "dashboard.leaveType.firstHalf" })})`
            : endDateHalfDayDetails === 2
            ? `(${formatMessage({ id: "dashboard.leaveType.secondHalf" })})`
            : "";

        return <>{`${totalCountDay}${startDateHalf}${endDateHalf}`}</>;
      },
    },

    {
      title: formatMessage({
        id: "listView.list.columns.requestedBy",
      }),
      key: "requestedBy",
      render: ({ users, requestedBy }: any) => {
        return (
          <Username
            id={requestedBy._id}
            type="link"
            idAttribute={requestedBy._id}
          />
        );
      },
    },
    {
      title: formatMessage({
        id: "listView.list.columns.title",
      }),
      key: "reason",
      dataIndex: "reason",
    },
    {
      title: formatMessage({
        id: "listView.list.columns.description",
      }),
      key: "description",
      dataIndex: "description",
    },
    {
      title: formatMessage({
        id: "listView.list.columns.status",
      }),
      key: "status",
      dataIndex: "status",
      render: (status: string) => {
        return (
          <>
            <Tag color={COLOR_STATUS[status.toUpperCase()]}>
              {status.toUpperCase()}
            </Tag>
          </>
        );
      },
    },
    {
      title: formatMessage({
        id: "listView.list.columns.requestAt",
      }),
      key: "requestedAt",
      dataIndex: "requestedAt",
      width: "1.5%",
      render: (requestedAt: any) => {
        return <>{formatDateWithTime(requestedAt)}</>;
      },
    },
    {
      title: formatMessage({
        id: "listView.list.columns.action",
      }),
      key: "action",
      width: "1.5%",
      render: (record: any) => {
        return (
          <Space>
            <Tooltip
              title={formatMessage({
                id: "listView.list.columns.approve",
              })}
            >
              <CheckOutlined
                id="approve"
                onClick={(e) => {
                  e.stopPropagation();
                  handelApprove(record._id);
                }}
                disabled={true}
              ></CheckOutlined>
            </Tooltip>
            <Tooltip
              title={formatMessage({
                id: "listView.list.columns.reject",
              })}
            >
              <CloseOutlined
                id="reject"
                onClick={() => {
                  showModal();
                  setRejectLeave(record._id);
                }}
              >
                {formatMessage({
                  id: "listView.list.columns.reject",
                })}
              </CloseOutlined>
            </Tooltip>
          </Space>
        );
      },
    },
  ];
  const handelApprove = async (record: any) => {
    confirm({
      title: formatMessage({
        id: "listView.list.actionModal.approve.title",
      }),
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: formatMessage({ id: "generic.yes" }),
      okType: "danger",
      cancelText: formatMessage({ id: "generic.no" }),
      okButtonProps: {
        id: "yes",
      },
      cancelButtonProps: {
        id: "no",
      },
      onOk: async () => {
        try {
          await leaveApproved({
            employeeId: record,
            data: {
              status: "approved",
              leaveStatusDescription: "",
            },
          });
          setIsModalVisible(false);
          queryClient.invalidateQueries(["list-view"]);
          message.success(
            formatMessage({
              id: "listView.list.actionModal.approve.message",
            })
          );
        } catch (error: any) {
          message.error(error.message);
        }
      },
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

  const onFinish = async (values: React.FormEvent<HTMLFormElement>) => {
    const { describtion }: any = values;
    try {
      await leaveApproved({
        employeeId: rejectLeave,
        data: {
          status: "rejected",
          leaveStatusDescription: describtion,
        },
      });
      queryClient.invalidateQueries(["list-view"]);
      message.success(
        formatMessage({
          id: "listView.list.actionModal.rejected.message",
        })
      );
      form.resetFields();
    } catch (error: any) {
      message.error(error.response.data.message);
    }
    setIsModalVisible(false);
  };
  return (
    <LeavesWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.attendance",
          }),
          path: "/attendance",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.calender",
          }),
          path: "/leaves/calender",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.list",
          }),
          path: "/leaves/list",
        },
      ]}
    >
      <div className={styles.listView}>
        {!isMobile && (
          <Table
            searchable
            value={!isUUID(search) ? search : ""}
            searchPlaceholder={formatMessage({
              id: "listView.list.searchPlaceholder",
            })}
            onSearch={(value: string) => handleSearchChange(value)}
            pagination={{
              pageSize: Number(size),
              current: Number(page),
              onChange: onPaginationChange,
              showSizeChanger: true,
              total: data?.totalRecords,
            }}
            columns={columns as any}
            loading={isLoading}
            dataSource={data?.data || []}
            bordered
            extra={
              <>
                <Col lg={5} md={12} xs={24}>
                  <span className="d-block mb-2">
                    {formatMessage({
                      id: "listView.list.filter.startDate.title",
                    })}
                  </span>
                  <DatePicker
                    format={DAY_MONTH_YEAR}
                    id="start_date"
                    onChange={onStartDateChange}
                    value={
                      fromDate ? dayjs(fromDate) : dayjs().startOf("month")
                    }
                    placeholder={formatMessage({
                      id: "listView.list.filter.startDate.placeholder",
                    })}
                  />
                </Col>
                <Col lg={5} md={24} xs={24}>
                  <span className="d-block mb-2">
                    {formatMessage({
                      id: "listView.list.filter.endDate.title",
                    })}
                  </span>
                  <DatePicker
                    format={DAY_MONTH_YEAR}
                    id="end_date"
                    onChange={onEndDateChange}
                    value={toDate ? dayjs(toDate) : dayjs().endOf("month")}
                    placeholder={formatMessage({
                      id: "listView.list.filter.endDate.placeholder",
                    })}
                  />
                </Col>
              </>
            }
            render={(child) => (
              <DataVisbilityControl
                module="leaves"
                startDate={fromDate}
                endDate={toDate}
              >
                {child}
              </DataVisbilityControl>
            )}
          />
        )}

        {isMobile && (
          <DataVisbilityControl
            module="leaves"
            startDate={fromDate}
            endDate={toDate}
          >
            <div>
              <Input
                placeholder={formatMessage({
                  id: "listView.list.searchPlaceholder",
                })}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleSearchChange(e.target.value)
                }
              />
              {React.Children.toArray(
                data?.data.map((data: Record<string, any>, index) => (
                  <MobileCard
                    title={
                      <Link
                        to={`/employees/${data.requestedBy._id}/overview`}
                        className={styles.requestedByName}
                      >
                        {data.requestedBy.name}
                      </Link>
                    }
                    cardNumber={(Number(page) - 1) * Number(size) + index + 1}
                    extra={
                      <>
                        <CheckOutlined
                          id="user_list_approve_button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handelApprove(data._id);
                          }}
                        >
                          {formatMessage({
                            id: "listView.list.columns.approve",
                          })}
                        </CheckOutlined>
                        <CloseOutlined
                          id="user_list_reject_button"
                          onClick={() => {
                            showModal();
                            setRejectLeave(data._id);
                          }}
                        >
                          {formatMessage({
                            id: "listView.list.columns.reject",
                          })}
                        </CloseOutlined>
                      </>
                    }
                  >
                    <Row>
                      <Col xs={12}>
                        {formatMessage({
                          id: "listView.list.columns.title",
                        })}
                      </Col>
                      <Col xs={12}>{data.reason}</Col>
                      <Col xs={12}>
                        {formatMessage({
                          id: "listView.list.columns.startDate",
                        })}
                      </Col>
                      <Col xs={12}>
                        {dayjs(data.start).format(DAY_MONTH_YEAR)}
                      </Col>
                      <Col xs={12}>
                        {formatMessage({
                          id: "listView.list.columns.endDate",
                        })}
                      </Col>
                      <Col xs={12}>
                        {dayjs(data.end).format(DAY_MONTH_YEAR)}
                      </Col>
                      <Col xs={12}>
                        {formatMessage({
                          id: "listView.list.columns.status",
                        })}
                      </Col>
                      <Col xs={12}>{data.status}</Col>
                      <Col xs={12}>
                        {formatMessage({
                          id: "listView.list.columns.requestAt",
                        })}
                      </Col>
                      <Col xs={12}>{formatDateWithTime(data.requestedAt)}</Col>
                      <Col xs={12}>
                        {formatMessage({
                          id: "listView.list.columns.totalDays",
                        })}
                      </Col>
                      <Col xs={12}>{data.totalCountDay}</Col>
                      <Col xs={12}>
                        {formatMessage({
                          id: "listView.list.columns.description",
                        })}
                      </Col>
                      <Col xs={12}>{data.description}</Col>
                    </Row>
                  </MobileCard>
                ))
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
          </DataVisbilityControl>
        )}
        <Modal
          title={formatMessage({
            id: "listView.list.actionModal.rejected.title",
          })}
          className={styles.rejectModal}
          open={isModalVisible}
          onOk={() => form.submit()}
          onCancel={() => {
            handleCancel();
            form.resetFields();
          }}
          okButtonProps={{ id: "ok" }}
          cancelButtonProps={{ id: "cancel" }}
        >
          <Form
            form={form}
            name="register"
            id="reject_reason_describtion_form"
            onFinish={onFinish}
          >
            <Form.Item
              name="describtion"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: formatMessage({
                    id: "listView.list.actionModal.rejected.requiredMessage",
                  }),
                },
              ]}
            >
              <TextArea id="reject_leave_describtion" rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </LeavesWrapper>
  );
};

export default ListView;
