import { startCase } from "lodash";
import dayjs from "dayjs";

export const formatName = (name: string) => {
  return startCase(name);
};

export const formatDateWithTime = (date: string) => {
  const finalFormat = "DD-MM-YYYY hh:mm A";
  return dayjs(date).format(finalFormat);
};

export const formatDate = (date: string, format?: string) => {
  if (!date) {
    return "--";
  }

  const DefaultFormate = "DD-MM-YYYY";
  return dayjs(date).format(format || DefaultFormate);
};

export const FormatMonth = (date: string) => {
  const DateFormate = "DD-MMMM-YYYY";
  return dayjs(date).format(DateFormate);
};
