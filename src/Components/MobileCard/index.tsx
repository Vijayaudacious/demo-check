import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Card } from "antd";
import styles from "./styles.module.less";
import { Outlet } from "react-router-dom";
import React from "react";
import { Loader } from "../Loader";
interface CardProps {
  title?: string | React.ReactNode;
  cardNumber: number;
  subTitle?: string;
  extra?: React.ReactNode;
  children?: React.ReactNode;
}

const MobileCard: React.FC<CardProps> = ({
  title,
  subTitle,
  cardNumber,
  extra,
  children,
}) => {
  return (
    <Card
      title={
        <div className="d-flex">
          <div className="mx-2">
            {cardNumber.toLocaleString("en-US", {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}
            .
          </div>
          <div className="mx-3">{title}</div>
        </div>
      }
      headStyle={{
        background: "#545d7a",
        color: "white",
        fontSize: "1rem",
        fontWeight: "600",
        margin: "0px",
        padding: "0px",
        borderRadius: "20px 20px 0 0",
      }}
      bordered
      extra={<div className={styles.actionContainer}>{extra}</div>}
      className={styles.cardContainer}
      bodyStyle={{ padding: "0 10px" }}
    >
      {Boolean(subTitle) && (
        <h3>
          <b>{subTitle}</b>
        </h3>
      )}
      {children}
      <React.Suspense fallback={<Loader isLoading centered size="large" />}>
        <Outlet />
      </React.Suspense>
    </Card>
  );
};

export default MobileCard;
