import React from "react";
import ListView from "../ListView";
import styles from "./styles.module.less";

const LeaveList: React.FC = () => {
  return (
    <div className={styles.listTable}>
      <ListView />
    </div>
  );
};
export default LeaveList;
