export const READ = "read";
export const WRITE = "write";
export const ADMIN = "admin";

export const APPROVED = "APPROVED";
export const REJECTED = "REJECTED";

export const COLOR_STATUS: any = {
  PENDING: "#ff9800",
  APPROVED: "#1183e1",
  REJECTED: "#ff5722",
};

export const ATTENDANCE_STATUS = {
  PRESENT: "P",
  ABSENT: "A",
  HALFDAY: "HD",
  HOLIDAY: "H",
  PAIDLEAVE: "PL",
  WEEKOFF: "W/O",
  LWP: "LWP",
};

export const LEAVE_STATUS = {
  PENDING: "P",
  APPROVE: "A",
  REJECT: "R",
  WITHDRAWAl: "W",
};

export const DATE_FORMATS = {
  HOUR_MINUTE: "HH:mm",
  HOUR_MINUTE_MERIDIEM: "hh:mm A",
  HOUR_MINUTE_SECOND: "HH:mm:ss",
  MONTH_YEAR: "MMM-YYYY",
  DAY_MONTH_YEAR: "DD-MM-YYYY",
  YEAR_MONTH_DAY: "YYYY-MM-DD",
  YEAR_MONTH_DAY_TIME: "YYYY-MM-DD HH:mm:ss",
  YEAR_MONTH: "YYYY-MM",
  WEEK_NAME: "dddd",
  DAY_MONTHNAME_YEAR: "DD-MMM-YYYY",
  MONTHNAME_YEAR: "MMM-YYYY",
  DATE_HOUR_MINUTE_MERIDIEM: "DD-MM-YYYY hh:mm A",
  DEFAULT_DATE_FORMAT: "DD MMM, YYYY",
  MONTH_NAME: "MMMM",
};

export const BLANK_DAYS = ["--:--"];
export const ABSENTCASETIME = "00:00:00";

export const FILTER = {
  LIMIT: 10,
  CUREENT_PAGE: 1,
  FIELD: "createdAt",
};

export const VALIDATION_FORMATS = {
  GST_NO: "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$",
  PAN_NO: "[A-Z]{5}[0-9]{4}[A-Z]{1}",
  CONTACT_NO: /^(?:(?:\+|0{0,2},[a-zA-Z])91(\s*[\-]\s*)?)?[6789]\d{9}$/,
  EMAIL: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
};
