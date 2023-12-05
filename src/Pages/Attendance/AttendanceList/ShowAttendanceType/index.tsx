import ShowAttendance from "@/Components/ShowAttendance";
import { ATTENDANCE_STATUS, DATE_FORMATS } from "@/Constant";
import { GetHoliday } from "@/Types/Attendance";
import { Tooltip } from "antd";
import dayjs from "dayjs";

const { HOUR_MINUTE_MERIDIEM, YEAR_MONTH_DAY } = DATE_FORMATS;
const { HALFDAY, PRESENT, ABSENT, HOLIDAY } = ATTENDANCE_STATUS;

interface AttendanceTypeProps {
  status?: string;
  inTime?: string;
  outTime?: string;
  holidayData?: GetHoliday;
}
const AttendanceType: React.FC<AttendanceTypeProps> = ({
  status,
  inTime,
  outTime,
  holidayData,
}) => {
  return (
    <Tooltip
      title={
        status === HALFDAY || status === PRESENT ? (
          <p>
            In-Time: {dayjs(inTime).format(HOUR_MINUTE_MERIDIEM)}
            <br />
            Out-Time: {dayjs(outTime).format(HOUR_MINUTE_MERIDIEM)}
          </p>
        ) : (
          holidayData && <p>{holidayData.title}</p>
        )
      }
    >
      <span>
        <ShowAttendance status={status || (holidayData ? HOLIDAY : ABSENT)} />
      </span>
    </Tooltip>
  );
};

export default AttendanceType;
