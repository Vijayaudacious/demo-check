import ExportButton from "@/Components/ExportButton";
import { ATTENDANCE_STATUS, DATE_FORMATS } from "@/Constant";
import { GetAttendance, GetHoliday } from "@/Types/Attendance";
import { Employee } from "@/Types/Employee";
import { checkHolidayByDate } from "@/Utils/generic";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";

interface ExportAttendanceProps {
  currentMonth: string;
  employees: Employee[];
  attendances: GetAttendance[];
  holidays: GetHoliday[];
}
const { DAY_MONTHNAME_YEAR, YEAR_MONTH_DAY, MONTHNAME_YEAR } = DATE_FORMATS;
const { ABSENT, HOLIDAY, PRESENT, HALFDAY } = ATTENDANCE_STATUS;

const ExportAttendance: React.FC<ExportAttendanceProps> = ({
  currentMonth,
  employees,
  attendances,
  holidays,
}) => {
  const { formatMessage } = useIntl();
  const sheetHeaders = useMemo(() => {
    const headers = [
      "Name",
      "Employee Code",
      "Total Working Day",
      "Total Present",
      "Total Absent",
    ];
    for (let i = 1; i <= dayjs(currentMonth).daysInMonth(); i++) {
      const fullDate = dayjs(currentMonth).date(i).format(DAY_MONTHNAME_YEAR);
      headers.splice(-3, 0, fullDate);
    }
    return headers;
  }, [currentMonth]);

  const logic = useMemo(() => {
    const totalDays = dayjs(currentMonth).daysInMonth();
    const filteredAttendance = employees.map(({ employeeCode, name }) => {
      let totalWorkingDay = totalDays;
      let totalPresent = 0;
      let totalAbsent = 0;
      const currentMonthAttendance: Record<string, string | number> = {
        Name: name,
      };
      currentMonthAttendance["Employee Code"] = employeeCode;
      for (let i = 1; i <= totalDays; i++) {
        const fullDate = dayjs(currentMonth).date(i).format(YEAR_MONTH_DAY);
        const holidayData = checkHolidayByDate(holidays, fullDate);

        const singleAttendance = attendances.find(
          (attendance) =>
            attendance.empId === employeeCode && attendance.date === fullDate
        );
        if (!singleAttendance && holidayData) {
          totalWorkingDay = totalWorkingDay - 1;
        }
        if (singleAttendance && singleAttendance.status === PRESENT) {
          totalPresent = totalPresent + 1;
        } else if (singleAttendance && singleAttendance.status === HALFDAY) {
          totalPresent = totalPresent + 0.5;
          totalAbsent = totalAbsent + 0.5;
        } else if (
          !holidayData ||
          (singleAttendance && singleAttendance.status === ABSENT)
        ) {
          totalAbsent = totalAbsent + 1;
        }

        currentMonthAttendance[dayjs(fullDate).format(DAY_MONTHNAME_YEAR)] =
          singleAttendance
            ? singleAttendance.status
            : holidayData
            ? HOLIDAY
            : ABSENT;
        currentMonthAttendance["Total Working Day"] = totalWorkingDay;
        currentMonthAttendance["Total Present"] = totalPresent;
        currentMonthAttendance["Total Absent"] = totalAbsent;
      }
      return currentMonthAttendance;
    });

    return filteredAttendance;
  }, [currentMonth, attendances, employees, holidays]);

  return (
    <ExportButton
      data={logic}
      headers={sheetHeaders}
      filename={`Attendance-${dayjs(currentMonth).format(MONTHNAME_YEAR)}`}
    >
      {formatMessage({
        id: "attendance.list.export",
      })}
    </ExportButton>
  );
};

export default ExportAttendance;
