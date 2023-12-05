import type { PickerDateProps } from "antd/es/date-picker/generatePicker";
import generatePicker from "antd/es/date-picker/generatePicker";
import classNames from "classnames";
import type { Dayjs } from "dayjs";
import "dayjs/locale/en";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import React from "react";
import styles from "./styles.module.less";

export interface DatePickerProps
  extends Omit<PickerDateProps<Dayjs>, "picker"> {
  picker?: "date" | "time" | "week" | "month" | "quarter" | "year";
}
const NativeDatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

const DatePicker = React.forwardRef<any, DatePickerProps>(
  ({ picker = "date", ...props }, ref) => (
    <NativeDatePicker
      {...props}
      className={classNames(styles.DatePicker, props.className)}
      ref={ref}
      getPopupContainer={(node) => node.parentElement as HTMLElement}
      picker={picker}
      placement="bottomRight"
      popupStyle={{ minHeight: "300px" }}
    />
  )
);

export default DatePicker;
