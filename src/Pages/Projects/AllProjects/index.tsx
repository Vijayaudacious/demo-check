import DatePicker, { DatePickerProps } from "@/Components/DatePicker";
import { formatDate } from "@/Components/Formats";
import MobileCard from "@/Components/MobileCard";
import SelectUser from "@/Components/SelectUserInput";
import { Table } from "@/Components/Table";
import Username from "@/Components/Username";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { DATE_FORMATS } from "@/Constant";
import { useProjects } from "@/Hooks/project";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import { isUUID, titleCase } from "@/Utils/generic";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Input as FieldInput,
  PageHeader,
  Pagination,
  Row,
  Space,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { debounce, get } from "lodash";
import React, { ChangeEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DeleteProject from "../DeleteProject";
import styles from "./styles.module.less";
import DeleteAction from "@/Components/PlanLimitations/DeleteAction";
import AddAction from "@/Components/PlanLimitations/AddAction";
import { useIntl } from "react-intl";

const { YEAR_MONTH_DAY, DAY_MONTH_YEAR, DATE_HOUR_MINUTE_MERIDIEM } =
  DATE_FORMATS;

const AllProjects = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [params, setParams] = useSearchParams();
  const limit = params.get("limit") || 10;
  const page = params.get("page") || 1;
  const search = params.get("search") || "";
  const fromDate = params.get("fromDate") || "";
  const toDate = params.get("toDate") || "";
  const date = params.get("date") || "";
  const { isMobile } = useWindowDimensions();

  const { data, isLoading } = useProjects({
    limit,
    page,
    search,
    ...(fromDate && { fromDate: fromDate }),
    ...(toDate && { toDate: toDate }),
    ...(date && { date: date }),
  });

  const columns = [
    {
      title: formatMessage({ id: "generic.serialNumber" }),
      key: "index",
      render: (__: string, _: any, index: number) =>
        (Number(page) - 1) * Number(limit) + index + 1,
    },
    {
      title: formatMessage({
        id: "project.list.column.projectName",
      }),
      dataIndex: "name",
      key: "name",
    },
    {
      title: formatMessage({
        id: "project.list.column.projectManager",
      }),
      dataIndex: "managerId",
      key: "managerId",
      render: (id: string) => (
        <Username idAttribute={`manager_${id}`} id={id} type="link" />
      ),
    },
    {
      title: formatMessage({
        id: "project.list.column.createdBy",
      }),
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
    },
    {
      title: formatMessage({
        id: "project.list.column.updatedBy",
      }),
      dataIndex: "updatedBy",
      key: "updatedBy",
      render: (updatedBy: string | null) =>
        updatedBy ? (
          <Username
            idAttribute={`updatedby_${updatedBy}`}
            id={updatedBy}
            type="link"
          />
        ) : (
          "-"
        ),
    },
    {
      title: formatMessage({
        id: "project.list.column.startDate",
      }),
      dataIndex: "startDate",
      key: "startDate",
      render: (startDate: string) => formatDate(startDate, DAY_MONTH_YEAR),
    },
    {
      title: formatMessage({
        id: "project.list.column.estimatedDate",
      }),
      dataIndex: "estimatedEndDate",
      key: "estimatedEndDate",
      render: (estimatedEndDate: string) =>
        formatDate(estimatedEndDate, DAY_MONTH_YEAR),
    },
    {
      title: formatMessage({
        id: "project.list.column.endDate",
      }),
      dataIndex: "endDate",
      key: "endDate",
      render: (endDate: string) => formatDate(endDate, DAY_MONTH_YEAR),
    },
    {
      title: formatMessage({
        id: "project.list.column.createdAt",
      }),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) =>
        formatDate(createdAt, DATE_HOUR_MINUTE_MERIDIEM),
    },
    {
      title: formatMessage({
        id: "project.list.column.updatedAt",
      }),
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt: string) =>
        formatDate(updatedAt, DATE_HOUR_MINUTE_MERIDIEM),
    },
    {
      title: formatMessage({ id: "generic.actions" }),
      key: "action",
      render: (project: any) => {
        return (
          <Space>
            <Tooltip title={formatMessage({ id: "generic.update" })}>
              <Link to={`/projects/${project.id}/update`}>
                <Button icon={<EditOutlined />} id={`${project.id}_update`} />
              </Link>
            </Tooltip>
            <DeleteAction
              module="projects"
              tooltipTitle={formatMessage(
                {
                  id: "projects.tooltip.deleteProject",
                },
                {
                  Link: (
                    <Link to="/plans" className={styles.upgradeTitle}>
                      {formatMessage({
                        id: "projects.tooltip.upgrade",
                      })}
                    </Link>
                  ),
                }
              )}
            >
              <Tooltip title={formatMessage({ id: "generic.delete" })}>
                <span>
                  <DeleteProject
                    projectId={project.id}
                    projectName={project.name}
                  />
                </span>
              </Tooltip>
            </DeleteAction>
          </Space>
        );
      },
      fixed: "right",
    },
  ];

  const onPaginationChange = (currentPage: number, pageSize: number) => {
    setParams({
      page: String(currentPage),
      limit: String(pageSize),
      search,
    });
  };

  const onInputChange = debounce((value: string) => {
    setParams({
      page: "1",
      limit: String(limit),
      search: value,
    });
  }, 500);
  const projects = get(data, "items", []);

  const totalProjects = get(data, "totalItems", 0);
  const onStartDateChange: DatePickerProps["onChange"] = (value) => {
    setParams({
      currentPage: "1",
      fromDate: value ? value.format(YEAR_MONTH_DAY) : "",
    });
  };
  const onEndDateChange: DatePickerProps["onChange"] = (value) => {
    setParams({
      currentPage: "1",
      fromDate,
      toDate: value ? value.format(YEAR_MONTH_DAY) : "",
    });
  };

  return (
    <PageLayoutWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.reports",
          }),
          path: "/projects",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.projects",
          }),
          path: "/projects",
        },
      ]}
    >
      <Row>
        <Col flex="auto" className={styles.projectList}>
          <PageHeader
            ghost={false}
            title={formatMessage({
              id: "project.list.title",
            })}
            className="px-0"
            extra={[
              <AddAction
                module="projects"
                tooltipTitle={formatMessage(
                  {
                    id: "projects.tooltip.addProject",
                  },
                  {
                    totalproject: totalProjects,
                    Link: (
                      <Link to="/plans" className={styles.upgradeTitle}>
                        {formatMessage({
                          id: "projects.tooltip.upgrade",
                        })}
                      </Link>
                    ),
                  }
                )}
                totalRecords={totalProjects}
              >
                <Link to="/projects/new">
                  <Button
                    key="1"
                    type="primary"
                    id="add_project"
                    icon={<PlusOutlined />}
                  >
                    {formatMessage({
                      id: "generic.add",
                    })}
                  </Button>
                </Link>
              </AddAction>,
            ]}
          />
          {!isMobile && (
            <Table
              bordered
              searchable
              value={!isUUID(search) ? search : ""}
              searchPlaceholder={formatMessage({
                id: "project.list.filters.projectName.placeholder",
              })}
              onSearch={(value: string) => onInputChange(value)}
              dataSource={projects}
              columns={columns}
              loading={isLoading}
              pagination={{
                pageSize: Number(limit),
                current: Number(page),
                onChange: onPaginationChange,
                showSizeChanger: true,
                total: totalProjects,
              }}
              extra={
                <>
                  <Col lg={4} md={12} xs={24} className="mb-3">
                    <span className="d-block mb-2">
                      {formatMessage({
                        id: "project.list.filters.createdBy.title",
                      })}
                    </span>
                    <SelectUser
                      value={isUUID(search) ? search : null}
                      style={{ width: "100%" }}
                      onChange={(value) => setParams({ search: value || "" })}
                      id="created_by"
                    />
                  </Col>
                  <Col lg={4} md={12} xs={24} className="mb-3">
                    <span className="d-block mb-2">
                      {formatMessage({
                        id: "project.form.projectDates.startDate.label",
                      })}
                    </span>
                    <DatePicker
                      format={DAY_MONTH_YEAR}
                      id="start_date"
                      onChange={onStartDateChange}
                      value={fromDate ? dayjs(fromDate) : undefined}
                      placeholder={formatMessage({
                        id: "project.list.filters.startDate.placeholder",
                      })}
                      className={styles.antPicker}
                    />
                  </Col>
                  <Col lg={4} md={12} xs={24} className="mb-3">
                    <span className="d-block mb-2">
                      {formatMessage({
                        id: "project.form.projectDates.endDate.label",
                      })}
                    </span>
                    <DatePicker
                      format={DAY_MONTH_YEAR}
                      id="end_date"
                      onChange={onEndDateChange}
                      value={toDate ? dayjs(toDate) : undefined}
                      placeholder={formatMessage({
                        id: "project.list.filters.endDate.placeholder",
                      })}
                      className={styles.antPicker}
                    />
                  </Col>
                </>
              }
            />
          )}
          {isMobile && (
            <div>
              <Row>
                <Col lg={4} md={12} xs={24} className="mb-3">
                  <FieldInput
                    placeholder="Project name"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      onInputChange(e.target.value)
                    }
                  />
                </Col>
                <Col lg={4} md={12} xs={24} className="mb-3">
                  <span className="d-block mb-2">
                    {formatMessage({
                      id: "project.list.filters.createdBy.title",
                    })}
                  </span>
                  <SelectUser
                    value={isUUID(search) ? search : null}
                    style={{ width: "100%" }}
                    onChange={(value) => setParams({ search: value || "" })}
                    id="created_by"
                  />
                </Col>
                <Col lg={4} md={12} xs={24} className="mb-3">
                  <span className="d-block mb-2">
                    {formatMessage({
                      id: "project.form.projectDates.startDate.label",
                    })}
                  </span>
                  <DatePicker
                    format={DAY_MONTH_YEAR}
                    id="start_date"
                    onChange={onStartDateChange}
                    value={fromDate ? dayjs(fromDate) : undefined}
                    placeholder={formatMessage({
                      id: "project.list.filters.startDate.placeholder",
                    })}
                    className={styles.antPicker}
                  />
                </Col>
                <Col lg={4} md={12} xs={24} className="mb-3">
                  <span className="d-block mb-2">
                    {formatMessage({
                      id: "project.form.projectDates.endDate.label",
                    })}
                  </span>
                  <DatePicker
                    format={DAY_MONTH_YEAR}
                    id="end_date"
                    onChange={onEndDateChange}
                    value={toDate ? dayjs(toDate) : undefined}
                    placeholder={formatMessage({
                      id: "project.list.filters.endDate.placeholder",
                    })}
                    className={styles.antPicker}
                  />
                </Col>
              </Row>

              {React.Children.toArray(
                projects.map(
                  (
                    {
                      id,
                      name,
                      managerId,
                      createdBy,
                      updatedBy,
                      startDate,
                      endDate,
                      estimatedEndDate,
                    }: any,
                    index: number
                  ) => (
                    <MobileCard
                      key={index}
                      cardNumber={
                        (Number(page) - 1) * Number(limit) + index + 1
                      }
                      title={titleCase(name)}
                      extra={
                        <Space>
                          <Tooltip
                            title={formatMessage({ id: "generic.update" })}
                          >
                            <Button
                              icon={<EditOutlined />}
                              onClick={() => navigate(`/projects/${id}/update`)}
                              id={`${id}_update`}
                              className={styles.mobileEditBtn}
                            />
                          </Tooltip>
                          <Tooltip
                            title={formatMessage({ id: "generic.delete" })}
                          >
                            <DeleteProject
                              isMobileDelete
                              projectId={id}
                              projectName={name}
                            />
                          </Tooltip>
                        </Space>
                      }
                    >
                      <Row>
                        <Col md={8} xs={12}>
                          <b>
                            {formatMessage({
                              id: "project.list.column.projectManager",
                            })}
                          </b>
                        </Col>
                        <Col md={16} xs={12} className={styles.rightData}>
                          <Username
                            idAttribute={`manager_${managerId}`}
                            id={managerId}
                            type="link"
                          />
                        </Col>
                        <Col md={8} xs={12}>
                          <b>
                            {formatMessage({
                              id: "project.list.column.createdBy",
                            })}
                          </b>
                        </Col>
                        <Col md={16} xs={12} className={styles.rightData}>
                          <Username
                            idAttribute={`createdby_${createdBy}`}
                            id={createdBy}
                            type="link"
                          />
                        </Col>
                        <Col md={8} xs={12}>
                          <b>
                            {formatMessage({
                              id: "project.list.column.updatedBy",
                            })}
                          </b>
                        </Col>
                        <Col md={16} xs={12} className={styles.rightData}>
                          <Username
                            idAttribute={`manager_${updatedBy}`}
                            id={updatedBy}
                            type="link"
                          />
                        </Col>
                        <Col md={8} xs={12}>
                          <b>
                            {formatMessage({
                              id: "project.list.column.startDate",
                            })}
                          </b>
                        </Col>
                        <Col md={16} xs={12} className={styles.rightData}>
                          {formatDate(startDate, DAY_MONTH_YEAR)}
                        </Col>
                        <Col md={8} xs={12}>
                          <b>
                            {formatMessage({
                              id: "project.list.column.estimatedDate",
                            })}
                          </b>
                        </Col>
                        <Col md={16} xs={12} className={styles.rightData}>
                          {formatDate(estimatedEndDate, DAY_MONTH_YEAR)}
                        </Col>
                        <Col md={8} xs={12}>
                          <b>
                            {formatMessage({
                              id: "project.list.column.endDate",
                            })}
                          </b>
                        </Col>
                        <Col md={16} xs={12} className={styles.rightData}>
                          {formatDate(endDate, DAY_MONTH_YEAR)}
                        </Col>
                      </Row>
                    </MobileCard>
                  )
                )
              )}
              <div className={styles.mobilePagination}>
                <Pagination
                  size="small"
                  total={totalProjects}
                  pageSize={Number(limit)}
                  current={Number(page)}
                  onChange={onPaginationChange}
                />
              </div>
            </div>
          )}
        </Col>
      </Row>
    </PageLayoutWrapper>
  );
};

export default AllProjects;
