import { Dayjs } from "dayjs";
import * as React from "react";
import generatePicker, {
  PickerTimeProps,
} from "antd/es/date-picker/generatePicker";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";

export interface TimePickerProps
  extends Omit<PickerTimeProps<Dayjs>, "picker"> {}

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);
const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => {
  return <DatePicker {...props} picker="time" ref={ref} />;
});

TimePicker.displayName = "TimePicker";

export default TimePicker;
