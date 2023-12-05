import { LEAVE_STATUS } from "@/Constant";
import classNames from "classnames";
import React from "react";
import styles from "../styles.module.less";

const { APPROVE, REJECT, WITHDRAWAl, PENDING } = LEAVE_STATUS;

interface LeaveStatusProps {
  status: string;
}
const LeaveStatus: React.FC<LeaveStatusProps> = ({ status }) => {
  return (
    <div
      className={classNames(styles.conatiner, {
        [styles.reject]: status === REJECT,
        [styles.approve]: status === APPROVE,
        [styles.pending]: status === PENDING,
        [styles.withdrawal]: status === WITHDRAWAl,
      })}
    >
      {status || "-"}
    </div>
  );
};

export default LeaveStatus;
