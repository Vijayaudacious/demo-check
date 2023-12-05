import { useSettings } from "@/Hooks/settings";
import { AccessControl, Plan } from "@/Types/Payment";
import { formatCurrency, titleCase } from "@/Utils/generic";
import { Badge, Button, List, Space, Typography } from "antd";
import { get } from "lodash";
import React from "react";
import { Currency } from "./index";
import styles from "./styles.module.less";

type PlanCardProps = {
  plan: Plan;
  currency: Currency;
  onSelect: () => void;
  isSelected?: boolean;
};

type TitleType = "attendance" | "leaves" | "projects" | "reports" | "users";

const isUndefined = (field?: any) => typeof field === "undefined";

const PlanFeatureItem = ({
  features,
  title,
}: {
  title: TitleType;
  features: AccessControl[TitleType];
}) => {
  return (
    <Space direction="vertical">
      <Typography.Title level={4}>{titleCase(title)}</Typography.Title>
      {!isUndefined(features.count) && (
        <Badge
          color={features.count ? "green" : "red"}
          text={`${features.count || "No"} ${titleCase(title)}`}
        />
      )}
      {features.dataVisibility &&
        !isUndefined(features.dataVisibility?.next) && (
          <Badge
            color="blue"
            text={
              <>
                Access future data for Current{" "}
                {features.dataVisibility?.next > 0 && (
                  <>
                    and next <b>{features.dataVisibility?.next}</b>
                  </>
                )}{" "}
                Month
              </>
            }
          />
        )}
      {features.dataVisibility &&
        !isUndefined(features.dataVisibility?.prev) && (
          <Badge
            color="blue"
            text={
              <>
                Access historical data for current{" "}
                {features.dataVisibility?.prev > 0 && (
                  <>
                    and previous <b>{features.dataVisibility?.prev}</b>
                  </>
                )}{" "}
                Month
              </>
            }
          />
        )}
    </Space>
  );
};

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onSelect,
  isSelected,
  currency,
}) => {
  const { data } = useSettings();

  const pricePerAdditionalUser = get(data, "userPerPrice");

  return (
    <div className={styles.cardBox}>
      <span
        className={styles.colorStripGreen}
        style={{
          backgroundColor: "#9facec",
        }}
      ></span>
      <h2>{plan.name || "Plan"}</h2>
      <h1 className={styles.priceHeading}>
        {plan?.amount?.[currency]
          ? `${formatCurrency(plan?.amount?.[currency], currency)}/Month`
          : "Free"}
      </h1>
      <span className={styles.borderBottom}></span>
      <div className={styles.listSection}>
        <List
          className={styles.listStyles}
          itemLayout="horizontal"
          dataSource={Object.keys(plan.accessControl || {}) as TitleType[]}
          renderItem={(item, index) => {
            const features = plan.accessControl[item];
            return (
              <List.Item key={index}>
                <PlanFeatureItem title={item} features={features} />
              </List.Item>
            );
          }}
        />
      </div>
      <div className={styles.cardBottomSection}>
        {pricePerAdditionalUser?.[currency] && (
          <>
            <h4>Additional Users</h4>
            <h2>
              {formatCurrency(pricePerAdditionalUser[currency], currency)}
              /User/Month
            </h2>
          </>
        )}

        <Button
          className={styles.getButton}
          onClick={onSelect}
          type="primary"
          disabled={isSelected}
          size="large"
        >
          {isSelected ? "Current" : "Get Started"}
        </Button>
      </div>
    </div>
  );
};

export default PlanCard;
