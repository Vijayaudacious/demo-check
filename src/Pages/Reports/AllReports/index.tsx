import DatePicker, { DatePickerProps } from "@/Components/DatePicker";
import { formatDate } from "@/Components/Formats";
import MobileCard from "@/Components/MobileCard";
import { Table } from "@/Components/Table";
import Username from "@/Components/Username";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { COLOR_STATUS, REJECTED } from "@/Constant";
import { useReports } from "@/Hooks/report";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import DeleteReport from "@/Pages/Reports/DeleteReport";
import UpdateStatus from "@/Pages/Reports/UpdateStatus";
import { Report as ReportType, Task } from "@/Types/Reports";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, PageHeader, Row, Space, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import get from "lodash/get";
import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import TaskList from "./TaskList";
import styles from "./styles.module.less";
import { useIntl } from "react-intl";
import DataVisbilityControl from "@/Components/PlanLimitations/MonthAction";

const Reports = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const limit = params.get("limit") || 10;
  const page = params.get("page") || 1;
  const search = params.get("search") || "";
  const fromDate = params.get("fromDate") || "";
  const toDate = params.get("toDate") || "";
  const date = params.get("date") || "";
  const { isMobile } = useWindowDimensions();

  const { data, isLoading } = useReports({
    limit,
    page,
    search,
    ...(fromDate && { fromDate: fromDate }),
    ...(toDate && { toDate: toDate }),
    ...(date && { date: date }),
  });
  const reports: ReportType[] = get(data, "items", []);
  const totalReports = get(data, "totalItems", 0);

  const columns = [
    {
      title: formatMessage({
        id: "generic.serialNumber",
      }),
      key: "index",
      render: (__: string, _: any, index: number) =>
        (Number(page) - 1) * Number(limit) + index + 1,
    },
    {
      title: formatMessage({
        id: "reports.list.columns.reportDate",
      }),
      dataIndex: "reportDate",
      key: "reportDate",
      render: (report_date: string) => formatDate(report_date, "DD-MM-YYYY"),
    },
    {
      title: formatMessage({
        id: "reports.list.columns.reportedBy",
      }),
      dataIndex: "userId",
      key: "userId",
      render: (user_id: string) => <Username id={user_id} type="link" />,
    },
    {
      title: formatMessage({
        id: "reports.list.columns.taskDescriptions",
      }),
      dataIndex: "tasks",
      key: "tasks",
      align: "left",
      render: (tasks: Task[]) => {
        return <TaskList tasks={tasks} />;
      },
    },
    {
      title: formatMessage({
        id: "reports.list.columns.reportStatus",
      }),
      dataIndex: "tasks",
      key: "tasks",
      render: (tasks: Task[]) => {
        return (
          <Tooltip
            placement="bottom"
            title={tasks[0]?.status === REJECTED && tasks[0]?.reason}
          >
            <Tag color={COLOR_STATUS[tasks[0]?.status]}>{tasks[0]?.status}</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: formatMessage({
        id: "reports.list.columns.actionStatus",
      }),
      key: "reportAction",
      dataIndex: "id",
      render: (id: string) => {
        return <UpdateStatus reportId={id} />;
      },
    },
    {
      title: formatMessage({
        id: "reports.list.columns.action",
      }),
      key: "action",
      dataIndex: "id",
      render: (id: string) => {
        return (
          <Space>
            <Tooltip
              title={formatMessage({
                id: "reports.list.tooltip.update",
              })}
            >
              <Link to={`/reports/${id}/update`}>
                <Button icon={<EditOutlined />} id={`${id}_update`} />
              </Link>
            </Tooltip>
            <Tooltip
              title={formatMessage({
                id: "reports.list.tooltip.delete",
              })}
            >
              <div>
                <DeleteReport reportId={id} />
              </div>
            </Tooltip>
          </Space>
        );
      },
    },
  ];
  const onPaginationChange = (currentPage: number, pageSize: number) => {
    setParams({
      page: String(currentPage),
      limit: String(pageSize),
      search,
    });
  };

  const onStartDateChange: DatePickerProps["onChange"] = (value) => {
    setParams({
      currentPage: "1",
      fromDate: value ? value.format("YYYY-MM-DD") : "",
    });
  };
  const onEndDateChange: DatePickerProps["onChange"] = (value) => {
    setParams({
      currentPage: "1",
      fromDate,
      toDate: value ? value.format("YYYY-MM-DD") : "",
    });
  };

  return (
    <PageLayoutWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.reports",
          }),
          path: "/reports",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.dailyReporting",
          }),
          path: "/reports",
        },
      ]}
    >
      <Row>
        <Col flex="auto" className={styles.reportsList}>
          <PageHeader
            ghost={false}
            title={formatMessage({
              id: "reports.list.title.allReports",
            })}
            extra={[
              <Link to="/reports/new">
                <Button
                  key="1"
                  type="primary"
                  id="add_report"
                  icon={<PlusOutlined />}
                >
                  {formatMessage({
                    id: "generic.add",
                  })}
                </Button>
                ,
              </Link>,
            ]}
          />
          {!isMobile && (
            <Table
              dataSource={reports}
              columns={columns}
              loading={isLoading}
              pagination={{
                pageSize: Number(limit),
                current: Number(page),
                onChange: onPaginationChange,
                showSizeChanger: true,
                total: totalReports,
              }}
              extra={
                <>
                  <Col lg={5} md={12} xs={24} className="mb-3">
                    <span className="d-block mb-2">
                      {formatMessage({
                        id: "reports.list.title.startDate",
                      })}
                    </span>
                    <DatePicker
                      format="DD-MM-YYYY"
                      id="start_date"
                      onChange={onStartDateChange}
                      value={fromDate ? dayjs(fromDate) : undefined}
                      placeholder={formatMessage({
                        id: "reports.list.placeholder.startDate",
                      })}
                    />
                  </Col>
                  <Col lg={5} md={12} xs={24} className="mb-3">
                    <span className="d-block mb-2">
                      {formatMessage({
                        id: "reports.list.title.endDate",
                      })}
                    </span>
                    <DatePicker
                      format="DD-MM-YYYY"
                      id="end_date"
                      onChange={onEndDateChange}
                      value={toDate ? dayjs(toDate) : undefined}
                      placeholder={formatMessage({
                        id: "reports.list.placeholder.endDate",
                      })}
                    />
                  </Col>
                </>
              }
              render={(child) => (
                <DataVisbilityControl
                  module="reports"
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
              module="reports"
              startDate={fromDate}
              endDate={toDate}
            >
              <div>
                <Row>
                  <Col lg={5} md={12} xs={24} className="mb-3">
                    <span className="d-block mb-2">
                      {formatMessage({
                        id: "reports.list.title.startDate",
                      })}
                    </span>
                    <DatePicker
                      format="DD-MM-YYYY"
                      id="start_date"
                      onChange={onStartDateChange}
                      value={fromDate ? dayjs(fromDate) : undefined}
                      placeholder={formatMessage({
                        id: "reports.list.placeholder.startDate",
                      })}
                    />
                  </Col>
                  <Col lg={5} md={12} xs={24} className="mb-3">
                    <span className="d-block mb-2">
                      {formatMessage({
                        id: "reports.list.title.endDate",
                      })}
                    </span>
                    <DatePicker
                      format="DD-MM-YYYY"
                      id="end_date"
                      onChange={onEndDateChange}
                      value={toDate ? dayjs(toDate) : undefined}
                      placeholder={formatMessage({
                        id: "reports.list.placeholder.endDate",
                      })}
                    />
                  </Col>
                </Row>

                {React.Children.toArray(
                  reports.map(({ id, userId, reportDate, tasks }, index) => (
                    <MobileCard
                      key={index}
                      cardNumber={
                        (Number(page) - 1) * Number(limit) + index + 1
                      }
                      extra={
                        <Space>
                          <Tooltip
                            title={formatMessage({
                              id: "reports.list.tooltip.update",
                            })}
                          >
                            <Button
                              icon={<EditOutlined />}
                              onClick={() => navigate(`/reports/${id}/update`)}
                              id={`${id}_update`}
                              className={styles.mobileEditBtn}
                            />
                          </Tooltip>
                          <Tooltip
                            title={formatMessage({
                              id: "reports.list.tooltip.delete",
                            })}
                          >
                            <div>
                              <DeleteReport
                                isMobileDelete
                                reportId={String(id)}
                              />
                            </div>
                          </Tooltip>
                        </Space>
                      }
                    >
                      <Row>
                        <Col className="my-2" md={8} xs={12}>
                          <b>
                            {formatMessage({
                              id: "reports.list.columns.reportDate",
                            })}
                          </b>
                        </Col>
                        <Col className="my-2" md={16} xs={12}>
                          {formatDate(reportDate, "DD-MM-YYYY")}
                        </Col>
                        <Col className="my-2" md={8} xs={12}>
                          <b>
                            {formatMessage({
                              id: "reports.list.columns.reportedBy",
                            })}
                          </b>
                        </Col>
                        <Col className="my-2" md={16} xs={12}>
                          <Username
                            idAttribute={`reportBy_${userId}`}
                            id={userId}
                            type="link"
                          />
                        </Col>
                        <Col className="my-2" md={8} xs={12}>
                          <b>
                            {formatMessage({
                              id: "reports.list.columns.reportStatus",
                            })}
                          </b>
                        </Col>
                        <Col className="my-2" md={16} xs={12}>
                          <Tag color={COLOR_STATUS[tasks[0]?.status]}>
                            {tasks[0]?.status}
                          </Tag>
                        </Col>
                        <Col className="my-2" md={8} xs={12}>
                          <b>
                            {formatMessage({
                              id: "reports.list.columns.actionStatus",
                            })}
                          </b>
                        </Col>
                        <Col className="my-2" md={16} xs={12}>
                          <UpdateStatus reportId={String(id)} />
                        </Col>
                        <Col className="my-2" md={8} xs={12}>
                          <b>
                            {formatMessage({
                              id: "reports.list.columns.taskDescriptions",
                            })}
                          </b>
                        </Col>
                        <Col className="my-2" md={16} xs={12}>
                          <TaskList tasks={tasks} />
                        </Col>
                      </Row>
                    </MobileCard>
                  ))
                )}
              </div>
            </DataVisbilityControl>
          )}
        </Col>
      </Row>
    </PageLayoutWrapper>
  );
};

export default Reports;
