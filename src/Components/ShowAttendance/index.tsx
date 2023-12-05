import { ATTENDANCE_STATUS } from "@/Constant";
import classNames from "classnames";
import React from "react";
import styles from "./styles.module.less";

const { ABSENT, HALFDAY, HOLIDAY, PAIDLEAVE, PRESENT, WEEKOFF } =
  ATTENDANCE_STATUS;

interface ShowAttendanceProps {
  status: string;
}
const ShowAttendance: React.FC<ShowAttendanceProps> = ({ status }) => {
  return (
    <div
      className={classNames(styles.conatiner, {
        [styles.absent]: status === ABSENT,
        [styles.present]: status === PRESENT,
        [styles.halfDay]: status === HALFDAY,
        [styles.holiday]: status === HOLIDAY,
        [styles.paid]: status === PAIDLEAVE,
        [styles.weekOff]: status === WEEKOFF,
      })}
    >
      {status || "-"}
    </div>
  );
};

export default ShowAttendance;
