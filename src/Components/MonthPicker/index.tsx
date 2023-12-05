import Icon, {
  ArrowNext,
  ArrowPre,
  NextArrowBlack,
  PrevArrowBlack,
} from "@/Assets/Images";
import { DATE_FORMATS } from "@/Constant";
import { Button, Tooltip } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import DatePicker, { DatePickerProps } from "../DatePicker";
import styles from "./styles.module.less";

const { YEAR_MONTH, MONTH_YEAR } = DATE_FORMATS;

interface MonthPickerProps extends DatePickerProps {
  value?: Dayjs;
  blackButton?: boolean;
  handleChange?: (date: string) => void;
  disabled?: boolean;
  label?: React.ReactNode | false;
}

const MonthPicker: React.FC<MonthPickerProps> = ({
  value,
  blackButton = false,
  handleChange,
  disabled = false,
  label = false,
  ...props
}) => {
  const { formatMessage } = useIntl();

  const initialValue = value
    ? value.format(YEAR_MONTH)
    : dayjs().format(YEAR_MONTH);
  const [showMonth, setShowMonth] = useState(initialValue);

  const changeMonth = (offset: number) => {
    const changedDate = dayjs(showMonth)
      .add(offset, "month")
      .format(YEAR_MONTH)
      .toString();
    setShowMonth(changedDate);
    if (handleChange) {
      handleChange(changedDate);
    }
  };

  const labelText =
    typeof label !== "boolean" ? (
      label
    ) : (
      <FormattedMessage id="generic.selectMonth" />
    );

  return (
    <>
      {Boolean(label) && <h4 className={styles.label}>{labelText}</h4>}
      <div className={styles.container}>
        <Tooltip title={formatMessage({ id: "generic.previous" })}>
          <Button
            icon={<Icon icon={blackButton ? PrevArrowBlack : ArrowPre} />}
            type="ghost"
            className={blackButton ? styles.blackBorder : styles.whiteBorder}
            onClick={() => changeMonth(-1)}
            disabled={disabled}
          />
        </Tooltip>
        <DatePicker
          picker="month"
          format={MONTH_YEAR}
          onChange={(_, dateString: string) => {
            setShowMonth(dateString);
            if (handleChange) {
              handleChange(dateString);
            }
          }}
          value={dayjs(showMonth)}
          allowClear={false}
          disabled={disabled}
          {...props}
        />
        <Tooltip title={formatMessage({ id: "generic.next" })}>
          <Button
            icon={<Icon icon={blackButton ? NextArrowBlack : ArrowNext} />}
            type="ghost"
            className={blackButton ? styles.blackBorder : styles.whiteBorder}
            onClick={() => changeMonth(1)}
            disabled={disabled}
          />
        </Tooltip>
      </div>
    </>
  );
};

export default MonthPicker;
