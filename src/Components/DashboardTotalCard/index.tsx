import { Loader } from "@/Components/Loader";
import { Col } from "antd";
import React from "react";
import styles from "./styles.module.less";

interface CardProps {
  /**Name of the card */
  title: string;
  /**Actual number which wants to show */
  value: number | React.ReactNode;
  isLoading: boolean;
  /** Color of card*/
  color: string;
  icon: React.ReactNode;
}
const DashboardCard: React.FC<CardProps> = ({
  title,
  value,
  isLoading = false,
  color,
  icon,
}) => {
  return (
    <Col
      xs={24}
      sm={24}
      md={24}
      lg={12}
      xl={8}
      xxl={6}
      className={styles.cardContainer}
    >
      <div
        className={styles.cards}
        style={{ boxShadow: `0px 0px 10px ${color}` }}
      >
        <div style={{ background: color }} className={styles.iconContainer}>
          <div className={styles.cardIcon}>{icon}</div>
        </div>
        <div className={styles.cardText}>
          {isLoading ? (
            <h2 className={styles.cardValue}>
              <Loader size="large" isLoading />
            </h2>
          ) : typeof value === "number" && value !== 0 ? (
            <>
              <h2 className={styles.cardValue}>{value}</h2>
            </>
          ) : (
            <h2>{value}</h2>
          )}
          <h3 className={styles.cardName}>{title}</h3>
        </div>
      </div>
    </Col>
  );
};

export default DashboardCard;
