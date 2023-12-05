import { List } from "antd";
import React from "react";
import { BreakdownByCategory } from "./BreakdownTable";
import { formatCurrency } from "@/Utils/generic";
import useCurrency from "@/Hooks/useCurrency";
import styles from "./styles.module.less";
import classNames from "classnames";

type BreakdownListProps = {
  isLoading: boolean;
  data: BreakdownByCategory[];
};

const BreakdownList: React.FC<BreakdownListProps> = ({ isLoading, data }) => {
  const currency = useCurrency();

  return (
    <List
      itemLayout="horizontal"
      header={<h3>By Category</h3>}
      dataSource={data}
      loading={isLoading}
      pagination={false}
      renderItem={(item) => {
        const isZero = item.profit === 0;
        const isProfit = item.profit >= 0;

        return (
          <List.Item
            actions={[
              isZero ? (
                "-"
              ) : (
                <span
                  className={classNames({
                    [styles.income]: isProfit,
                    [styles.expense]: !isProfit,
                  })}
                >{`${isProfit ? "+" : "-"}${formatCurrency(
                  item.profit,
                  currency
                )}`}</span>
              ),
            ]}
          >
            <List.Item.Meta
              title={item.name}
              description={
                <div>
                  <div>
                    Income:{" "}
                    <span className={styles.income}>
                      {formatCurrency(item.income, currency)}
                    </span>
                  </div>
                  <div>
                    Expense:{" "}
                    <span className={styles.expense}>
                      {formatCurrency(item.expense, currency)}
                    </span>
                  </div>
                </div>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default BreakdownList;
