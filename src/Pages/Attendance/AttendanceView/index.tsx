import Icon, { NextArrowBlack, PrevArrowBlack } from "@/Assets/Images";
import DatePicker from "@/Components/DatePicker";
import ShowAttendance from "@/Components/ShowAttendance";
import ShowRoles from "@/Components/ShowRoles";
import { Table } from "@/Components/Table";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { ATTENDANCE_STATUS, DATE_FORMATS } from "@/Constant";
import { useUserDetails } from "@/Hooks";
import { useEmployeeAttendance } from "@/Hooks/attendance";
import { useGetWorkingDays } from "@/Hooks/organization";
import { Attendance, TimeSheet } from "@/Types/Attendance";
import { CreateWorkingDay } from "@/Types/Organization";
import { getWorkingHours, titleCase } from "@/Utils/generic";
import { Avatar, Button, Card, Col, Row, Skeleton, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import classNames from "classnames";
import dayjs from "dayjs";
import get from "lodash/get";
import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useParams } from "react-router-dom";
import RemainingTime from "./RemainingTime";
import styles from "./styles.module.less";

const gridStyle: React.CSSProperties = {
  width: "250px",
  textAlign: "center",
  display: "inline-flex",
};

const {
  YEAR_MONTH,
  HOUR_MINUTE_MERIDIEM,
  MONTH_YEAR,
  WEEK_NAME,
  HOUR_MINUTE_SECOND,
} = DATE_FORMATS;
const { HALFDAY, PRESENT, ABSENT } = ATTENDANCE_STATUS;

const AttendanceView = () => {
  const { id }: any = useParams();
  const { formatMessage } = useIntl();
  const [showMonth, setShowMonth] = useState(dayjs().format(YEAR_MONTH));
  const [employeeID, setEmployeeID] = useState<string | null>(null);
  const { data, isLoading: isFetching } = useUserDetails(id);
  const userData = get(data, "data.data", "");
  const { data: getWorkingDay } = useGetWorkingDays();
  const workingDays: CreateWorkingDay[] = get(getWorkingDay, "workingDays");

  useEffect(() => {
    if (userData && userData._id === id) {
      setEmployeeID(userData.employeeCode);
    }
  }, [userData, id]);

  const { data: attendanceData, isLoading } = useEmployeeAttendance(
    employeeID || ""
  );
  const filteredData = (attendanceData || [])?.filter(
    (item: { date: string }) => {
      return item.date.startsWith(showMonth);
    }
  );

  const presentRecords = useMemo(() => {
    return filteredData?.filter((record: Attendance) => {
      return (
        (record.status === PRESENT || record.status === HALFDAY) &&
        record.date?.startsWith(showMonth)
      );
    });
  }, [filteredData, id, showMonth]);

  const counts = useMemo(() => {
    let presentDays = 0;
    let absentDays = 0;
    for (let i = 0; i < filteredData.length; i++) {
      if (filteredData[i].status === PRESENT) {
        presentDays = presentDays + 1;
      } else if (filteredData[i].status === ABSENT) {
        absentDays = absentDays + 1;
      } else if (filteredData[i].status === HALFDAY) {
        presentDays = presentDays + 0.5;
        absentDays = absentDays + 0.5;
      }
    }
    return { presentDays, absentDays };
  }, [filteredData, id, showMonth]);

  const seletedMonthDays = dayjs(showMonth).daysInMonth();
  const totalWorkedByEmployee = useMemo(() => {
    let seconds = 0;
    for (let i = 0; i < presentRecords.length; i++) {
      seconds = presentRecords[i].totalTime + seconds;
    }
    return Math.floor(seconds / 3600);
  }, [showMonth, presentRecords]);

  const totalWokingHours = useMemo(() => {
    return getWorkingHours(presentRecords, workingDays);
  }, [showMonth, presentRecords]);

  const columns: ColumnsType<TimeSheet> = [
    {
      title: formatMessage({
        id: "generic.serialNumber",
      }),
      key: "index",
      render: (_, __, index: number) => index + 1,
    },
    {
      title: formatMessage({
        id: "attendance.timeSheet.columns.date",
      }),
      key: "date",
      dataIndex: "date",
      width: "20%",
    },
    {
      title: formatMessage({
        id: "attendance.timeSheet.columns.status",
      }),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return <ShowAttendance status={status} />;
      },
    },
    {
      title: formatMessage({
        id: "attendance.timeSheet.columns.inTime",
      }),
      dataIndex: "inTime",
      key: "inTime",
      render: (inTime) => {
        return <>{dayjs(inTime).format(HOUR_MINUTE_MERIDIEM)}</>;
      },
    },
    {
      title: formatMessage({
        id: "attendance.timeSheet.columns.outTime",
      }),
      dataIndex: "outTime",
      key: "outTime",
      render: (outTime) => {
        return <>{dayjs(outTime).format(HOUR_MINUTE_MERIDIEM)}</>;
      },
    },
    {
      title: formatMessage({
        id: "attendance.timeSheet.columns.totalWorkingHours",
      }),
      dataIndex: "totalTime",
      key: "totalTime",
      render: (hours) => {
        return (
          <>
            {formatMessage(
              {
                id: "attendance.timeSheet.header.hours",
              },
              {
                hours: Math.floor(hours / 3600),
              }
            )}
          </>
        );
      },
    },
    {
      title: formatMessage({
        id: "attendance.timeSheet.columns.remaningTime",
      }),
      key: "remaningTime",
      render: ({ totalTime, date }) => {
        const spendHours = Math.floor(totalTime / 3600);
        const currentWeek = dayjs(date).format(WEEK_NAME).toLowerCase();
        const preSetWorkingHour = workingDays?.find(
          (singleDay) => singleDay.day === currentWeek
        );
        let totalHours = 0;
        if (preSetWorkingHour) {
          const startTime = dayjs(
            preSetWorkingHour.timing[0].startTime,
            HOUR_MINUTE_SECOND
          );
          const endTime = dayjs(
            preSetWorkingHour.timing[0].endTime,
            HOUR_MINUTE_SECOND
          );
          totalHours = endTime.diff(startTime, "hour");
        }
        return (
          <RemainingTime
            hours={totalHours - spendHours}
            setWorkingHour={preSetWorkingHour ? false : currentWeek}
          />
        );
      },
    },
  ];

  return (
    <PageLayoutWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.attendance",
          }),
          path: "/attendance",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.timeSheet",
          }),
          path: "/attendance/",
        },
      ]}
    >
      <div>
        <Row gutter={16} className={styles.header}>
          <Card.Grid hoverable={false} style={gridStyle}>
            <Avatar size={80}>
              <p className={styles.avtarName}>
                {userData.name?.trim().charAt(0).toUpperCase()}
              </p>
            </Avatar>
            <br />
            <Skeleton loading={isFetching}>
              <div>
                <strong>{userData.name}</strong>
                <p>{userData.employeeCode}</p>
              </div>
            </Skeleton>
          </Card.Grid>
          <Card.Grid style={gridStyle} hoverable={false}>
            <Skeleton loading={isFetching}>
              <div>
                <h1>
                  <ShowRoles roles={userData?.roles || []} />
                </h1>
                <p>{userData.email}</p>
              </div>
            </Skeleton>
          </Card.Grid>
          <div className={styles.monthFilter}>
            <Button
              icon={<Icon icon={PrevArrowBlack} />}
              type="ghost"
              className={styles.dateChangeBtn}
              onClick={() =>
                setShowMonth(
                  dayjs(showMonth)
                    .subtract(1, "month")
                    .format(YEAR_MONTH)
                    .toLowerCase()
                )
              }
            />
            <DatePicker
              picker="month"
              format={MONTH_YEAR}
              onChange={(_date, dateString: string) => {
                setShowMonth(dateString);
              }}
              value={dayjs(showMonth)}
              allowClear={false}
            />
            <Button
              icon={<Icon icon={NextArrowBlack} />}
              type="ghost"
              className={styles.dateChangeBtn}
              onClick={() =>
                setShowMonth(dayjs(showMonth).add(1, "month").format("YYYY-MM"))
              }
            />
          </div>
        </Row>
      </div>
      <div className={styles.table}>
        <div className={styles.title}>
          <Row gutter={16}>
            <Col lg={5}>
              <div className={styles.detailWrapper}>
                <h1>
                  {formatMessage({
                    id: "attendance.timeSheet.header.totalWorkingDay",
                  })}
                </h1>
                <p
                  className={classNames(styles.workingDaystatus, styles.value)}
                >
                  <span>
                    {formatMessage(
                      {
                        id: "attendance.timeSheet.header.days",
                      },
                      { days: seletedMonthDays }
                    )}
                  </span>
                </p>
              </div>
            </Col>
            <Col lg={5}>
              <div className={styles.detailWrapper}>
                <h1>
                  {formatMessage({
                    id: "attendance.timeSheet.header.totalPresent",
                  })}
                </h1>
                <p className={classNames(styles.presentStatus, styles.value)}>
                  <span>
                    {formatMessage(
                      {
                        id: "attendance.timeSheet.header.days",
                      },
                      { days: counts.presentDays }
                    )}
                  </span>
                </p>
              </div>
            </Col>
            <Col lg={4}>
              <div className={styles.detailWrapper}>
                <h1>
                  {formatMessage({
                    id: "attendance.timeSheet.header.totalAbsent",
                  })}
                </h1>
                <p className={classNames(styles.absentStatus, styles.value)}>
                  <span>
                    {formatMessage(
                      {
                        id: "attendance.timeSheet.header.days",
                      },
                      { days: counts.absentDays }
                    )}
                  </span>
                </p>
              </div>
            </Col>
            <Col lg={5}>
              <div className={styles.detailWrapper}>
                <h1>
                  {formatMessage({
                    id: "attendance.timeSheet.header.totalOverTime",
                  })}
                </h1>
                {typeof totalWokingHours === "string" ? (
                  <Tooltip
                    title={formatMessage(
                      {
                        id: "attendance.timeSheet.tooltip.updateWorkingDay",
                      },
                      {
                        weekname: titleCase(totalWokingHours),
                      }
                    )}
                  >
                    <Link
                      className={classNames(
                        styles.OverTimeStatus,
                        styles.value
                      )}
                      to="/settings/organization/working-hours"
                    >
                      <span>
                        {` ${formatMessage({
                          id: "generic.update",
                        })} ${titleCase(totalWokingHours)}`}
                      </span>
                    </Link>
                  </Tooltip>
                ) : (
                  <p
                    className={classNames(styles.OverTimeStatus, styles.value)}
                  >
                    <span>
                      {formatMessage(
                        {
                          id: "attendance.timeSheet.header.hours",
                        },
                        {
                          hours: totalWorkedByEmployee - totalWokingHours,
                        }
                      )}
                    </span>
                  </p>
                )}
              </div>
            </Col>
            <Col lg={5}>
              <div className={styles.detailWrapper}>
                <h1>
                  {formatMessage({
                    id: "attendance.timeSheet.header.totalAvailableLeaves",
                  })}
                </h1>
                <p
                  className={classNames(
                    styles.remainingLeaveStatus,
                    styles.value
                  )}
                >
                  <span>
                    {formatMessage(
                      {
                        id: "attendance.timeSheet.header.days",
                      },
                      { days: userData.remainingLeaves }
                    )}
                  </span>
                </p>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.table}>
          <Table
            columns={columns}
            dataSource={filteredData || []}
            loading={isLoading}
            pagination={false}
          />
        </div>
      </div>
    </PageLayoutWrapper>
  );
};

export default AttendanceView;
