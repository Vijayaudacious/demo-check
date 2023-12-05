import Icon, { PremiumCrown } from "@/Assets/Images";
import { PlanContext } from "@/Auth";
import { Button, Card } from "antd";
import dayjs from "dayjs";
import get from "lodash/get";
import React, { useContext } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import styles from "./styles.module.less";

interface DurationCheckProps {
  module: string;
  startDate: string;
  endDate: string;
  extra?: React.ReactNode;
}

const DataVisbilityControl: React.FC<
  React.PropsWithChildren<DurationCheckProps>
> = ({ children, module, startDate, endDate, extra }) => {
  const { formatMessage } = useIntl();
  const { accessControl } = useContext(PlanContext);
  const previous = get(accessControl, `${module}.dataVisibility.prev`);
  const next = get(accessControl, `${module}.dataVisibility.next`);
  const prevMonth = dayjs()
    .startOf("month")
    .diff(dayjs(startDate).startOf("month"), "month");
  const nextMonth = dayjs(endDate)
    .startOf("month")
    .diff(dayjs().startOf("month"), "month");

  if (previous < prevMonth || next < nextMonth) {
    return (
      <div className="position-relative" style={{ minHeight: "290px" }}>
        <div className={styles.fixedContainer}>
          <Card className={styles.container}>
            <div className={styles.mainContiner}>
              <Icon
                icon={PremiumCrown}
                alt="premium-crown"
                className={styles.logo}
              />
              <h2>
                {formatMessage({
                  id: "planLimitations.dataVisibility.title",
                })}
              </h2>
              <Link to="/plans">
                <Button type="primary" className={styles.upgradeBtn}>
                  {formatMessage({
                    id: "generic.upgradePlan",
                  })}
                </Button>
              </Link>
            </div>
            {extra}
          </Card>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default DataVisbilityControl;
