import AttendanceStatus from "@/Components/ShowAttendance";
import React from "react";
import styles from "./styles.module.less";
import { Col } from "antd";

interface IndicatorPops {
  fullName: string;
  sortName: string;
}
const Indicator: React.FC<IndicatorPops> = ({ fullName, sortName }) => {
  return (
    <Col lg={4} xs={24}>
      <h3 className={styles.indicatorContainer}>
        <div className={styles.status}>
          <AttendanceStatus status={sortName} />
        </div>
        {sortName}={fullName}
      </h3>
    </Col>
  );
};

export default Indicator;
