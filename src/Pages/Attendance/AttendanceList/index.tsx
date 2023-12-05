import Icon, { ArrowNext, ArrowPre } from "@/Assets/Images";
import DatePicker from "@/Components/DatePicker";
import { formatName } from "@/Components/Formats";
import DataVisbilityControl from "@/Components/PlanLimitations/MonthAction";
import { Table } from "@/Components/Table";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { ATTENDANCE_STATUS, DATE_FORMATS } from "@/Constant";
import { useAttendance } from "@/Hooks/attendance";
import { useUsers } from "@/Hooks/emloyee";
import { useHolidays } from "@/Hooks/organization";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import { Attendance } from "@/Types/Attendance";
import { checkHolidayByDate, isUUID } from "@/Utils/generic";
import { Button, Col, Input, Row, Space } from "antd";
import { ColumnsType } from "antd/lib/table";
import classNames from "classnames";
import dayjs from "dayjs";
import get from "lodash/get";
import snakeCase from "lodash/snakeCase";
import { ChangeEvent, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useSearchParams } from "react-router-dom";
import ExportAttendance from "../ExportAttendance";
import ListFooter from "./ListFooter";
import AttendanceType from "./ShowAttendanceType";
import styles from "./styles.module.less";

const { HALFDAY, PRESENT, ABSENT, PAIDLEAVE } = ATTENDANCE_STATUS;
const { MONTH_YEAR, YEAR_MONTH_DAY } = DATE_FORMATS;

const AttendanceList = () => {
  const { formatMessage } = useIntl();
  const { isMobile } = useWindowDimensions();
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("currentPage") || "1");
  const size = params.get("limit") || 100;
  const search = params.get("search") || "";
  const [showMonth, setShowMonth] = useState(dayjs().format("YYYY-MM"));
  const { data: holidayResponse, isLoading: isFetching } = useHolidays({
    startDate: dayjs(showMonth).startOf("month").format(YEAR_MONTH_DAY),
    endDate: dayjs(showMonth).endOf("month").format(YEAR_MONTH_DAY),
  });
  const { data: userData, isLoading } = useUsers({
    currentPage: String(page),
    limit: size,
    search,
  });

  const { data, isLoading: attendancesLoading } = useAttendance();

  const onInputChange = (value: string) => {
    setParams({
      currentPage: "1",
      limit: String(size),
      search: value,
    });
  };

  const attendancesData = useMemo(() => {
    return get(data, "items", []);
  }, [data]);

  const filteredAttendancesData = useMemo(() => {
    const currentMonthAttendance = attendancesData.filter((att: Attendance) => {
      const attendanceMonth = dayjs(att.date).format("YYYY-MM");
      return attendanceMonth === showMonth;
    });
    return currentMonthAttendance;
  }, [attendancesData, showMonth, holidayResponse]);

  const columns = useMemo(() => {
    const totalDaysCount = dayjs(showMonth).daysInMonth();
    let totalWorkingDays = totalDaysCount;

    const cols: ColumnsType<any> = [
      {
        title: formatMessage({
          id: "generic.serialNumber",
        }),
        key: "index",
        ...(!isMobile ? { fixed: "left" } : {}),
        width: 100,
        render: (text: string, record: any, index: number) =>
          (Number(page) - 1) * Number(size) + index + 1,
      },
      {
        title: formatMessage({
          id: "attendance.list.columns.employeeId",
        }),
        key: "employeeCode",
        ...(!isMobile ? { fixed: "left" } : {}),
        dataIndex: "employeeCode",
        width: 150,
      },
      {
        title: formatMessage({
          id: "attendance.list.columns.employeeName",
        }),
        key: "name",
        ...(!isMobile ? { fixed: "left" } : {}),
        width: 150,
        render: (value) => {
          return (
            <Link
              to={`/attendance/${value._id}/timesheet`}
              className={styles.nameLink}
              id={`employee_${snakeCase(value.name)}`}
            >
              {formatName(value.name)}
            </Link>
          );
        },
      },

      {
        title: formatMessage({
          id: "attendance.list.columns.totalPresent",
        }),
        dataIndex: "totalPresent",
        key: "totalPresent",
        width: 150,
        ...(!isMobile ? { fixed: "right" } : {}),
        render: (_, user) => {
          const attendance: Attendance[] = filteredAttendancesData.filter(
            (att: Attendance) => att.empId === user.employeeCode
          );
          const totalPresents = attendance.reduce(
            (total, att) =>
              total +
              (att.status === PRESENT ? 1 : att.status === HALFDAY ? 0.5 : 0),
            0
          );
          return totalPresents;
        },
      },
      {
        title: formatMessage({
          id: "attendance.list.columns.totalAbsent",
        }),
        dataIndex: "totalabsent",
        key: "totalabsent",
        width: 150,
        ...(!isMobile ? { fixed: "right" } : {}),
        render: (_, user) => {
          const attendance: Attendance[] = filteredAttendancesData.filter(
            (att: Attendance) => att.empId === user.employeeCode
          );
          const totalPresentDays = attendance.reduce(
            (total, att) =>
              total +
              (att.status === PRESENT ? 1 : att.status === HALFDAY ? 0.5 : 0),
            0
          );
          const totalAbsentDays = totalWorkingDays - totalPresentDays;
          return totalAbsentDays;
        },
      },
    ];

    cols.splice(-2, 0, {
      title: formatMessage({
        id: "attendance.list.columns.totalWorkingDay",
      }),
      dataIndex: "totalDay",
      key: "totalDay",
      width: 150,
      ...(!isMobile ? { fixed: "right" } : {}),
      render: () => {
        return <p>{totalWorkingDays}</p>;
      },
    });

    for (let i = 1; i <= totalDaysCount; i++) {
      const fullDate = dayjs(showMonth).date(i).format(YEAR_MONTH_DAY);
      const currentDate = dayjs(showMonth.concat(`-${i}`))
        .add(1, "day")
        .toString();
      const excectDate = dayjs(currentDate)
        .subtract(1, "day")
        .format(YEAR_MONTH_DAY);

      const holidayData = checkHolidayByDate(
        holidayResponse?.data || [],
        excectDate
      );
      if (holidayData) {
        totalWorkingDays = totalWorkingDays - 1;
      }
      cols.splice(-3, 0, {
        title: (
          <div>
            {currentDate.split(",")[0]}
            <p>{i}</p>
          </div>
        ),
        dataIndex: "status",
        key: "status",
        width: 70,
        render: (_, user) => {
          const attendance: any = attendancesData.find(
            (att: Attendance) =>
              att.empId === user.employeeCode && att.date === fullDate
          );
          const inTime = attendance?.inTime || "-";
          const outTime = attendance?.outTime || "-";

          return (
            <AttendanceType
              status={attendance?.status}
              outTime={outTime}
              inTime={inTime}
              holidayData={holidayData}
            />
          );
        },
      });
    }
    return cols;
  }, [showMonth, filteredAttendancesData, holidayResponse]);

  return (
    <PageLayoutWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.attendance",
          }),
          path: "/attendance",
        },
      ]}
    >
      <Row className={styles.hedarBtn}>
        <Space>
          <Link to="/attendance/upload">
            <Button>
              {formatMessage({
                id: "attendance.list.upload",
              })}
            </Button>
          </Link>
          <ExportAttendance
            currentMonth={showMonth}
            employees={userData?.data || []}
            attendances={filteredAttendancesData}
            holidays={holidayResponse?.data || []}
          />
          <Link to="/attendance/mark">
            <Button type="primary">
              {formatMessage({
                id: "attendance.list.markAttendance",
              })}
            </Button>
          </Link>
        </Space>
      </Row>
      <Col lg={4} md={12} xs={24} className={styles.searchInput}>
        <h4>
          {formatMessage({
            id: "generic.search",
          })}
        </h4>
        <Input
          value={!isUUID(search) ? search : ""}
          placeholder={formatMessage({
            id: "attendance.list.search",
          })}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onInputChange(e.target.value)
          }
          className={styles.inputField}
          id="search"
        />
      </Col>
      <ListFooter />
      <div className={styles.table}>
        <div className={classNames("d-flex", styles.title)}>
          <h2 className={styles.listDeadingText}>
            {formatMessage({
              id: "attendance.list.title",
            })}
          </h2>
          <div className={styles.dateContainer}>
            <Button
              icon={<Icon icon={ArrowPre} />}
              type="ghost"
              className={classNames("px-1 mx-2", styles.dateChangeBtn)}
              onClick={() =>
                setShowMonth(
                  dayjs(showMonth).subtract(1, "month").format("YYYY-MM")
                )
              }
              disabled={isLoading || isFetching}
            />
            <DatePicker
              picker="month"
              format={MONTH_YEAR}
              disabled={isLoading || isFetching}
              onChange={(_date, dateString: string) => {
                setShowMonth(dateString);
              }}
              value={dayjs(showMonth)}
              allowClear={false}
            />
            <Button
              icon={<Icon icon={ArrowNext} />}
              disabled={isLoading || isFetching}
              type="ghost"
              className={classNames("px-1 mx-2", styles.dateChangeBtn)}
              onClick={() =>
                setShowMonth(dayjs(showMonth).add(1, "month").format("YYYY-MM"))
              }
            />
          </div>
        </div>
        <DataVisbilityControl
          module="attendance"
          startDate={showMonth}
          endDate={showMonth}
        >
          <Table
            columns={columns}
            dataSource={userData?.data || []}
            bordered
            loading={attendancesLoading || isLoading || isFetching}
            pagination={{
              pageSize: Number(size),
              current: Number(page),
              onChange: (currentPage: number, pageSize: number) => {
                setParams({
                  limit: String(pageSize),
                  currentPage: String(currentPage),
                });
              },
              total: userData?.totalRecords,
            }}
          />
        </DataVisbilityControl>
      </div>
    </PageLayoutWrapper>
  );
};

export default AttendanceList;
