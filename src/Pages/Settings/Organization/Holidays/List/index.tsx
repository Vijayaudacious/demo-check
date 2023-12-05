import DatePicker from "@/Components/DatePicker";
import { Table } from "@/Components/Table";
import OrganizationWrapper from "@/Components/Wrappers/OrganizationWrapper";
import { DATE_FORMATS } from "@/Constant";
import { useHolidays } from "@/Hooks/organization";
import { GetHoliday } from "@/Types/Attendance";
import {
  EditOutlined,
  PlusOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button, Col, PageHeader, Row, Space, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import AddHoliday from "../Add";
import DeleteHoliday from "../Delete";
import styles from "./styles.module.less";

const { DAY_MONTH_YEAR, YEAR_MONTH_DAY } = DATE_FORMATS;

const Holidays = () => {
  const [showModal, setShowModal] = useState(false);
  const [holidayDetails, setholidayDetails] = useState<GetHoliday>();
  const [params, setSearchParams] = useSearchParams();
  const limit = params.get("limit") || 1000;
  const currentPage = params.get("currentPage") || 1;
  const startDate = params.get("startDate")
    ? dayjs(params.get("startDate")).format(YEAR_MONTH_DAY)
    : dayjs().startOf("month").format(YEAR_MONTH_DAY);
  const endDate = params.get("endDate")
    ? dayjs(params.get("endDate")).format(YEAR_MONTH_DAY)
    : dayjs().endOf("month").format(YEAR_MONTH_DAY);

  const { data, isLoading } = useHolidays({
    startDate,
    endDate,
  });

  const allHolidays = data?.data || [];

  const { formatMessage } = useIntl();
  const columns: ColumnsType<GetHoliday[]> = [
    {
      title: formatMessage({
        id: "generic.serialNumber",
      }),
      key: "index",
      width: 50,
      render: (_, __, index: number) =>
        (Number(currentPage) - 1) * Number(limit) + index + 1,
    },
    {
      title: formatMessage({
        id: "holiday.list.columns.title",
      }),
      dataIndex: "title",
      key: "title",
      width: 300,
    },
    {
      title: formatMessage({
        id: "holiday.list.columns.date",
      }),
      dataIndex: "startDate",
      key: "startDate",
      width: 200,
      render: (date: string) => dayjs(date).format(DAY_MONTH_YEAR),
    },
    {
      title: formatMessage({
        id: "holiday.list.columns.details",
      }),
      dataIndex: "description",
      key: "description",
    },
    {
      title: formatMessage({
        id: "generic.actions",
      }),
      key: "action",
      width: 100,
      render: (holiday: GetHoliday) => {
        const { startDate, occurenece, _id, title, repeat } = holiday;
        const startDates = dayjs(startDate).format(YEAR_MONTH_DAY);
        const date = dayjs().format(YEAR_MONTH_DAY);
        const { endDate } = occurenece;
        let canDelete = true;
        if (date === startDates || date <= startDates) {
          canDelete = false;
        }

        return (
          <Space className={styles.actions}>
            <Tooltip
              title={formatMessage({
                id: "generic.update",
              })}
            >
              <Button
                icon={<EditOutlined />}
                id={`${_id}_update`}
                onClick={() => {
                  setholidayDetails(holiday);
                  setShowModal(true);
                }}
              />
            </Tooltip>
            <Tooltip
              title={formatMessage({
                id: canDelete ? "generic.cancel" : "generic.delete",
              })}
            >
              <span>
                <DeleteHoliday
                  canDelete={canDelete}
                  disabled={
                    repeat === false
                      ? false
                      : true && endDate === null
                      ? false
                      : true
                  }
                  title={formatMessage({
                    id: canDelete
                      ? "holiday.deleteModal.cancel"
                      : "holiday.deleteModal.title",
                  })}
                  icon={canDelete ? <CloseOutlined /> : <DeleteOutlined />}
                  okButton={
                    canDelete
                      ? formatMessage({
                          id: "generic.yes",
                        })
                      : formatMessage({
                          id: "generic.delete",
                        })
                  }
                  cancelButton={
                    canDelete
                      ? formatMessage({
                          id: "generic.no",
                        })
                      : formatMessage({
                          id: "generic.cancel",
                        })
                  }
                  holidayId={_id}
                  holidayName={title}
                />
              </span>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const onPaginationChange = (currentPage: number, pageSize: number) => {
    setSearchParams({
      currentPage: String(currentPage),
      limit: String(pageSize),
    });
  };

  return (
    <OrganizationWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.settings",
          }),
          path: "/settings/employee",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.organization",
          }),
          path: "/settings/organization",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.holidays",
          }),
          path: "/settings/organization/holidays",
        },
      ]}
    >
      <PageHeader
        ghost={false}
        title={formatMessage({
          id: "holiday.title",
        })}
        extra={
          <Col lg={2}>
            <Button
              type="primary"
              id="add_holiday"
              className={styles.addButton}
              onClick={() => {
                setholidayDetails(undefined);
                setShowModal(true);
              }}
            >
              <PlusOutlined />
              {formatMessage({
                id: "generic.add",
              })}
            </Button>
          </Col>
        }
      />
      <Row className={styles.filterSection}>
        <Col lg={5} className={styles.statDate}>
          <span>
            {formatMessage({
              id: "generic.startDate",
            })}
          </span>
          <br />
          <DatePicker
            format={DAY_MONTH_YEAR}
            value={dayjs(startDate, YEAR_MONTH_DAY)}
            onChange={(date) =>
              setSearchParams({
                endDate,
                startDate: date ? dayjs(date).format(YEAR_MONTH_DAY) : "",
              })
            }
            allowClear={false}
            placeholder={formatMessage({
              id: "holiday.list.filterPlaceHolders.startDate",
            })}
          />
        </Col>
        <Col lg={5}>
          <div className={styles.endDateContainer}>
            <span>
              {formatMessage({
                id: "generic.endDate",
              })}
            </span>
            <br />
            <DatePicker
              placeholder={formatMessage({
                id: "holiday.list.filterPlaceHolders.endDate",
              })}
              format={DAY_MONTH_YEAR}
              value={dayjs(endDate, YEAR_MONTH_DAY)}
              onChange={(date) =>
                setSearchParams({
                  startDate,
                  endDate: date ? dayjs(date).format(YEAR_MONTH_DAY) : "",
                })
              }
              allowClear={false}
            />
          </div>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={allHolidays}
        loading={isLoading}
        pagination={{
          pageSize: Number(limit),
          current: Number(currentPage),
          onChange: onPaginationChange,
          showSizeChanger: true,
          total: data?.totalRecords,
        }}
        bordered
      />
      <AddHoliday
        showModal={showModal}
        handleClose={() => setShowModal(!showModal)}
        holiday={holidayDetails}
      />
    </OrganizationWrapper>
  );
};

export default Holidays;
