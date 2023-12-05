import { DATE_FORMATS } from "@/Constant";
import { Attendance, GetHoliday } from "@/Types/Attendance";
import { Leave } from "@/Types/Leaves";
import { CreateWorkingDay } from "@/Types/Organization";
import { message } from "antd";
import dayjs from "dayjs";
import { get } from "lodash";
import camelCase from "lodash/camelCase";
import startCase from "lodash/startCase";
import CountryTimeZoneMapping from "./countries.json";
import { AxiosError } from "axios";

const { WEEK_NAME, HOUR_MINUTE_SECOND, YEAR_MONTH_DAY } = DATE_FORMATS;

export const titleCase = (str: string) => startCase(camelCase(str));

export const isUUID = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

export const getWorkingHours = (
  attendanceRecords: Attendance[],
  workingRecords: CreateWorkingDay[]
) => {
  let hours: number | string = 0;
  for (let i = 0; i < attendanceRecords.length; i++) {
    const currentWeekName = dayjs(attendanceRecords[i].date)
      .format(WEEK_NAME)
      .toLowerCase();
    const preSetWorkingHour = workingRecords.find(
      (singleDay) => singleDay.day === currentWeekName
    );
    if (preSetWorkingHour) {
      const startTime = dayjs(
        preSetWorkingHour.timing[0].startTime,
        HOUR_MINUTE_SECOND
      );
      const endTime = dayjs(
        preSetWorkingHour.timing[0].endTime,
        HOUR_MINUTE_SECOND
      );
      const totalHours = endTime.diff(startTime, "hour", true);
      hours = hours + totalHours;
    } else {
      hours = currentWeekName;
      break;
    }
  }
  return hours;
};

export const checkHolidayByDate = (
  holidays: GetHoliday[],
  currentDate: string
) => {
  const holidayData = holidays.find((holiday) => {
    const { cycle } = holiday.occurenece;
    const isHolidayExpired = dayjs(holiday.occurenece.endDate).isBefore(
      dayjs(currentDate)
    );
    const isHolidayStarted =
      dayjs(holiday.startDate).format(YEAR_MONTH_DAY) === currentDate ||
      !dayjs(holiday.startDate).isAfter(dayjs(currentDate));

    if (!holiday.repeat || cycle === "daily") {
      return (
        dayjs(holiday.startDate).format(YEAR_MONTH_DAY) ===
        dayjs(currentDate).format(YEAR_MONTH_DAY)
      );
    }

    switch (cycle) {
      case "weekly":
        return (
          holiday.occurenece.day === dayjs(currentDate).day() &&
          !isHolidayExpired &&
          isHolidayStarted
        );

      case "monthly":
        return (
          holiday.occurenece.date === dayjs(currentDate).get("date") &&
          !isHolidayExpired &&
          isHolidayStarted
        );

      case "yearly":
        return (
          holiday.occurenece.month &&
          dayjs()
            .set("date", holiday.occurenece.date)
            .set("month", holiday.occurenece.month)
            .format(YEAR_MONTH_DAY) ===
            dayjs(currentDate).format(YEAR_MONTH_DAY) &&
          !isHolidayExpired &&
          isHolidayStarted
        );

      default:
        return false;
    }
  });
  return holidayData;
};

export const formatCurrency = (amount: number, type: string = "INR") => {
  const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: type,
    maximumFractionDigits: 0,
  });
  return currency.format(amount);
};

export const showErrorMessage = (
  error: any,
  path: string = "data.message",
  defaultValue: string = "Unable to process"
) => {
  if (![401, 403].includes(error.response?.status as number)) {
    const value = get(error, path, get(error, "response.data.message", defaultValue));
    message.error(value);
  }
};

export const getClassNameByStatus = (element: Leave) => {
  switch (element.halfDayLeaves?.startDateHalfDayDetails) {
    case 1:
      return "firstHalf";
    case 2:
      return "secondHalf";
    default:
      return "";
  }
};

export const isServer = () => typeof window === "undefined";

export const getCountry = () =>
  !isServer() && localStorage.getItem("countryFromBrowser");

export const detectCountry = () => {
  if (!isServer() && !getCountry()) {
    if (typeof Intl !== "undefined") {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const tzArr = userTimeZone.split("/");
      const userCity = tzArr[tzArr.length - 1];
      const userCountry = (CountryTimeZoneMapping as Record<string, string>)[
        userCity
      ];
      localStorage.setItem("countryFromBrowser", userCountry.toLowerCase());
    } else {
      console.log(" not available.");
    }
  }
};
export const isIndia = () => (getCountry() || "").toLowerCase() !== "india";

export const getCurrency = () => (isIndia() ? "inr" : "usd");
