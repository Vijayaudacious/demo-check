import { Col } from "antd";
import React from "react";
import styles from "../styles.module.less";
import LeaveStatus from "./LeaveStatus";

interface IndicatorProps {
  fullName: string;
  sortName: string;
}
const Indicator: React.FC<IndicatorProps> = ({ fullName, sortName }) => {
  return (
    <Col lg={6} xs={24} className={styles.indicatorContainer}>
      <h3>
        <div className={styles.status}>
          <LeaveStatus status={sortName} />
        </div>
        {sortName}={fullName}
      </h3>
    </Col>
  );
};

export default Indicator;
