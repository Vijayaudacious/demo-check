import { PermissionContext } from "@/Auth";
import LeaveIndicators from "@/Components/LeaveIndicators";
import { Loader } from "@/Components/Loader";
import DataVisbilityControl from "@/Components/PlanLimitations/MonthAction";
import Truncate from "@/Components/Truncate";
import LeavesWrapper from "@/Components/Wrappers/LeaveWrapper";
import { COLOR_STATUS, DATE_FORMATS, READ } from "@/Constant";
import { useGetLeaveEmloyeeDetails } from "@/Hooks/Leaves";
import { listLeave } from "@/Services/Leaves";
import { getClassNameByStatus } from "@/Utils/generic";
import dayGridPlugins from "@fullcalendar/daygrid";
import interactionPlugins from "@fullcalendar/interaction";
import FullCalendar, {
  DateSelectArg,
  DatesSetArg,
  EventClickArg,
  EventContentArg,
  disableCursor,
} from "@fullcalendar/react";
import "@fullcalendar/react/dist/vdom";
import timeGridPlugins from "@fullcalendar/timegrid";
import { Button, Divider, message } from "antd";
import dayjs from "dayjs";
import snakeCase from "lodash/snakeCase";
import upperCase from "lodash/upperCase";
import React, { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import LeaveActionModal from "./LeaveActionModal";
import styles from "./styles.module.less";

const { YEAR_MONTH_DAY } = DATE_FORMATS;
const AdminCalender: React.FC = () => {
  const { formatMessage } = useIntl();
  const { leave } = useContext(PermissionContext);
  const currentMoth = {
    startDate: dayjs().startOf("month").format(YEAR_MONTH_DAY),
    endDate: dayjs().endOf("month").format(YEAR_MONTH_DAY),
  };
  const [visibleDateRange, setVisibleDateRange] = useState(currentMoth);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [leaveEmployeeDetails, setLeaveEmployeeDetails] = useState({});
  const { isLoading, mutateAsync: getEmployeeLeaveDetails } =
    useGetLeaveEmloyeeDetails();

  const [spinLoading, setSpinLoading] = useState(false);
  const [initialEvents, setInitialEvents] = useState([]);
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  const loadUser = async () => {
    setSpinLoading(true);
    try {
      const { data }: any = await listLeave({ limit: "500" });

      const totalLeaves = JSON.parse(JSON.stringify(data));
      const listArr: any = totalLeaves.map((element: any) => ({
        start: dayjs(element.startDate).format("YYYY-MM-DD"),
        end: dayjs(element.endDate).add(1, "days").format("YYYY-MM-DD"),
        createdBy: element.createdBy,
        description: element.description,
        title: element.reason,
        requestedAt: element.requestedAt,
        id: element?.requestedBy?._id,
        requestedBy: element?.requestedBy?.name,
        status: element.status,
        totalCountDay: element.totalCountDay,
        _id: element._id,
        color: COLOR_STATUS[upperCase(element.status)],
        className: getClassNameByStatus(element),
      }));
      setInitialEvents(listArr);
      setSpinLoading(false);
    } catch (error: any) {
      message.error(error.message);
      setSpinLoading(false);
    }
  };

  const handleEventClick = async (clickInfo: EventClickArg) => {
    const leaveId = await clickInfo.event._def.extendedProps._id;
    try {
      const { data }: any = await getEmployeeLeaveDetails(leaveId);
      setLeaveEmployeeDetails(data.data);
    } catch (error: any) {
      message.error(error.message);
    }
    setIsModalVisible(!isModalVisible);
  };

  const handleClose = () => {
    setIsModalVisible(!isModalVisible);
    loadUser();
  };
  const handleDateSelect = (selectInfo: DateSelectArg) => {};

  const renderEventContent = (eventContent: EventContentArg) => {
    const name =
      eventContent.event.extendedProps.requestedBy?.split(" ")[0] ??
      "Deleted User";
    return (
      <div
        id={`${snakeCase(
          eventContent.event.extendedProps.requestedBy
        )}_${snakeCase(eventContent.event.title)}`}
      >
        <b>
          <Truncate
            text={`${name} - ${eventContent.event.title}`}
            length={50}
          />
        </b>
      </div>
    );
  };
  //Code for apply id in every div of calender
  const fullCalender = document.getElementById("fullcalendar_apply_id");
  const getTableBody = fullCalender?.getElementsByTagName("tbody")[1];
  const getTableRows = getTableBody?.getElementsByTagName("tr");
  if (getTableRows?.length) {
    for (let i = 0; i < getTableRows?.length; i++) {
      const allTableData = getTableRows[i].getElementsByTagName("td");
      for (let j = 0; j < allTableData.length; j++) {
        const day = allTableData[j]
          .getElementsByTagName("a")[0]
          ?.getAttribute("aria-label");
        if (day) {
          allTableData[j]
            .getElementsByTagName("div")[0]
            .setAttribute("id", snakeCase(day));
        }
      }
    }
  }

  const handleDatesSet = (arg: DatesSetArg) => {
    const startDate = dayjs(arg.view.currentStart).format(YEAR_MONTH_DAY);
    const endDate = dayjs(arg.view.currentEnd)
      .subtract(1, "month")
      .format(YEAR_MONTH_DAY);
    setVisibleDateRange({ startDate, endDate });
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
      ]}
    >
      <div className={styles.mainSection} id="fullcalendar_apply_id">
        <div className={styles.loader}>
          <Loader isLoading={spinLoading || isLoading} />
        </div>
        <DataVisbilityControl
          module="leaves"
          startDate={visibleDateRange.startDate}
          endDate={visibleDateRange.endDate}
          extra={
            <Button
              type="primary"
              className={styles.upgradeRestBtn}
              onClick={() => setVisibleDateRange(currentMoth)}
            >
              {formatMessage({
                id: "generic.resetMonth",
              })}
            </Button>
          }
        >
          <LeaveIndicators />
          <Divider className={styles.divider} />
          <FullCalendar
            plugins={[dayGridPlugins, timeGridPlugins, interactionPlugins]}
            showNonCurrentDates={false}
            events={initialEvents}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            select={leave === READ ? disableCursor : handleDateSelect}
            headerToolbar={{
              left: "prev,next,today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            selectable={true}
            datesSet={handleDatesSet}
          />
        </DataVisbilityControl>
        <LeaveActionModal
          isModalVisible={isModalVisible}
          handleClose={handleClose}
          leaveEmployeeDetails={leaveEmployeeDetails}
        />
      </div>
    </LeavesWrapper>
  );
};
export default AdminCalender;
