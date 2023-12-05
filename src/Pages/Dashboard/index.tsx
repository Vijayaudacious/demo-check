import Icon, {
  Dashemp,
  Dashleave,
  Dashproject,
  HolidayIcon,
} from "@/Assets/Images";
import { UserContext } from "@/Auth";
import DashboardCard from "@/Components/DashboardTotalCard";
import SingleIdUserCalender from "@/Components/SingleIdUserCalender";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { DATE_FORMATS } from "@/Constant";
import { useLeaves } from "@/Hooks/Leaves";
import { useUsers } from "@/Hooks/emloyee";
import { useHolidays } from "@/Hooks/organization";
import { useProjects } from "@/Hooks/project";
import { Holiday } from "@/Types/Attendance";
import { GetEmployeeDetails } from "@/Types/Employee";
import { Leave } from "@/Types/Leaves";
import { Occurenece } from "@/Types/UpcomingHoliday";
import { Avatar, Row, Tooltip } from "antd";
import dayjs from "dayjs";
import get from "lodash/get";
import React, { useContext } from "react";
import { useIntl } from "react-intl";
import styles from "./styles.module.less";
import { titleCase } from "@/Utils/generic";

const { DEFAULT_DATE_FORMAT, YEAR_MONTH_DAY } = DATE_FORMATS;

const RANDOM_COLORS: Record<string, string> = {
  A: "#FF5733",
  B: "#42A5F5",
  C: "#4CAF50",
  D: "#FFC107",
  E: "#9C27B0",
  F: "#FF9800",
  G: "#673AB7",
  H: "#8BC34A",
  I: "#E91E63",
  J: "#00BCD4",
  K: "#FF5252",
  L: "#607D8B",
  M: "#795548",
  N: "#FFEB3B",
  O: "#9E9E9E",
  P: "#FFA726",
  Q: "#FFEE58",
  R: "#03A9F4",
  S: "#FF8A65",
  T: "#8D6E63",
  U: "#4DB6AC",
  V: "#DCE775",
  W: "#FF7043",
  X: "#BA68C8",
  Y: "#A1887F",
  Z: "#9CCC65",
  default: "#000000",
};

const setRandomBackground = (name: string) => {
  const firstLetter = name.charAt(0).toUpperCase();
  return RANDOM_COLORS[firstLetter] || RANDOM_COLORS.default;
};

const Dashboard: React.FC = () => {
  const { formatMessage } = useIntl();
  const { _id: loggedUserId } = useContext(UserContext);
  const { data: Users, isLoading: isUsersLoading } = useUsers({
    action: "active",
  });
  const { data: Projects, isLoading: isProjectsLoading } = useProjects({});
  const { data: leaves, isLoading: isLeavesLoading } = useLeaves({
    fromDate: dayjs().startOf("day").format(YEAR_MONTH_DAY),
    toDate: dayjs().endOf("day").format(YEAR_MONTH_DAY),
  });
  const { data, isLoading: isHolidayLoading } = useHolidays({
    startDate: dayjs().startOf("day").format(YEAR_MONTH_DAY),
    limit: 1,
  });
  const holidayData: Holiday[] = get(data, "data", []);
  const filterHoliday = holidayData.find(
    (holiday) => holiday.leaveType !== "weekoff"
  );
  const occureneceHoliday = get(filterHoliday, "occurenece") as
    | Occurenece
    | undefined;
  let upcomingHoliday;
  if (occureneceHoliday?.cycle === "weekly") {
    upcomingHoliday = dayjs()
      .day(0)
      .add(occureneceHoliday.day, "day")
      .format(YEAR_MONTH_DAY);
  } else if (occureneceHoliday?.cycle === "daily") {
    upcomingHoliday = dayjs().format(YEAR_MONTH_DAY);
  } else if (occureneceHoliday?.cycle === "monthly" || "yearly") {
    upcomingHoliday = dayjs().date(occureneceHoliday?.date || 1);
  } else {
    upcomingHoliday = filterHoliday?.startDate;
  }
  const isSameDay = dayjs(upcomingHoliday).isSame(dayjs(), "day");

  const totalUsers = get(Users, "totalRecords", 0);
  const totalProjects = get(Projects, "totalItems", 0);
  const userLeaves = get(leaves, "data", []);

  return (
    <PageLayoutWrapper noBreadcrum>
      {/* <div className={styles.mainDashboard}>
        <Row gutter={16}>
          <DashboardCard
            title={formatMessage({
              id: "dashboard.card.title.employee",
            })}
            value={totalUsers}
            isLoading={isUsersLoading}
            color="#ff9800"
            icon={<Icon icon={Dashemp} className={styles.imgWidth} />}
          />
          <DashboardCard
            title={formatMessage({
              id: "dashboard.card.title.project",
            })}
            value={totalProjects}
            isLoading={isProjectsLoading}
            color="#03a9f4"
            icon={<Icon icon={Dashproject} className={styles.imgWidth} />}
          />
          <DashboardCard
            title={formatMessage({
              id: isSameDay
                ? "dashboard.card.title.todayHoliday"
                : "dashboard.card.title.holiday",
            })}
            value={
              <div>
                {filterHoliday ? (
                  <Tooltip title={titleCase(filterHoliday?.title)}>
                    <h4 className={styles.centerItem}>
                      {dayjs(upcomingHoliday).format(DEFAULT_DATE_FORMAT)}
                    </h4>
                    <small className={styles.centerItem}>
                      ({dayjs(upcomingHoliday).fromNow()})
                    </small>
                  </Tooltip>
                ) : (
                  <h5 className={styles.centerItem}>
                    {formatMessage({
                      id: "dashboard.card.title.noHoliday",
                    })}
                  </h5>
                )}
              </div>
            }
            isLoading={isHolidayLoading}
            color="#ff9800"
            icon={<Icon icon={HolidayIcon} className={styles.imgWidth} />}
          />
          <DashboardCard
            title={formatMessage({
              id: "dashboard.card.title.leave",
            })}
            value={
              <Avatar.Group
                maxCount={3}
                size="large"
                className={styles.centerItem}
              >
                {!userLeaves.length ? (
                  <h5 className={styles.centerItem}>
                    {formatMessage({
                      id: "dashboard.card.title.noLeave",
                    })}
                  </h5>
                ) : (
                  userLeaves.map((leave: Leave) => {
                    const employee = get(
                      leave,
                      "requestedBy",
                      {}
                    ) as GetEmployeeDetails;
                    const { startDateHalfDayDetails, endDateHalfDayDetails } =
                      leave.halfDayLeaves;
                    const startDateHalf =
                      startDateHalfDayDetails === 1
                        ? `(${formatMessage({
                            id: "dashboard.leaveType.firstHalf",
                          })})`
                        : startDateHalfDayDetails === 2
                        ? `(${formatMessage({
                            id: "dashboard.leaveType.secondHalf",
                          })})`
                        : "";
                    const endDateHalf =
                      endDateHalfDayDetails === 1
                        ? `(${formatMessage({
                            id: "dashboard.leaveType.firstHalf",
                          })})`
                        : endDateHalfDayDetails === 2
                        ? `(${formatMessage({
                            id: "dashboard.leaveType.secondHalf",
                          })})`
                        : "";

                    return (
                      <Tooltip
                        title={`${employee.name} ${startDateHalf}${endDateHalf}`}
                        key={leave.userId}
                      >
                        {employee?.profilePicture ? (
                          <Avatar
                            src={`${process.env.REACT_APP_BASE_API}${employee.profilePicture}`}
                          />
                        ) : (
                          <Avatar
                            style={{
                              backgroundColor: setRandomBackground(
                                employee?.name
                              ),
                            }}
                          >
                            {employee?.name?.charAt(0)}
                          </Avatar>
                        )}
                      </Tooltip>
                    );
                  })
                )}
              </Avatar.Group>
            }
            isLoading={isLeavesLoading}
            color="red"
            icon={<Icon icon={Dashleave} className={styles.imgWidth} />}
          />
        </Row>

        <div className={styles.removebutton}>
          <SingleIdUserCalender
            isDashboardCalender={true}
            userId={loggedUserId}
          />
        </div>
      </div> */}
    </PageLayoutWrapper>
  );
};

export default Dashboard;
