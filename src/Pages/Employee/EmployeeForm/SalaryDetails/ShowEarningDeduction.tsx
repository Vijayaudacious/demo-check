import { Deduction, Earning, SalaryTemplate } from "@/Types/SalaryTemplate";
import { titleCase } from "@/Utils/generic";
import { Button } from "antd";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import styles from "./styles.module.less";

interface ShowEarningDeductionProps {
  template: SalaryTemplate;
  type: "deductions" | "earnings";
  max?: number;
}
const ShowEarningDeduction: React.FC<ShowEarningDeductionProps> = ({
  template,
  type,
  max = 1,
}) => {
  const { formatMessage } = useIntl();
  const [showAll, setShowAll] = useState(false);
  const templateData = template[type];

  const hasTasks = templateData.length > 0;
  const shouldshowReadButton = templateData.length > max;

  return (
    <>
      <b className={styles.textContent}>{titleCase(type)}</b>
      {!hasTasks && <span>{formatMessage({ id: "generic.noData" })}</span>}
      {(showAll ? templateData : templateData.slice(0, max)).map(
        (data: Deduction | Earning, index: number) => (
          <div key={index} className={styles.textContent}>
            <p>{index + 1}.</p>
            <p>{titleCase(data.title)}</p>
            <p>{titleCase(data.type)}</p>
            <p>{data.amount}</p>
          </div>
        )
      )}
      {shouldshowReadButton && (
        <div className={styles.positionEnd}>
          <Button
            type="link"
            id="more_less"
            onClick={() => setShowAll(!showAll)}
          >
            <p className={styles.toggleButton}>
              {formatMessage({ id: showAll ? "generic.less" : "generic.more" })}
            </p>
          </Button>
        </div>
      )}
    </>
  );
};

export default ShowEarningDeduction;
