import React from "react";
import { Input } from "antd";
import { CommonFormComponentProps } from ".";
import styles from "./styles.module.less";

interface NumericInputProps extends CommonFormComponentProps {
  inputValue: string;
  onInputChange: (value: string) => void;
}

const NumericInput: React.FC<NumericInputProps> = ({
  inputValue,
  onInputChange,
  ...props
}) => {
  const pattern = /^[0-9+.\b]+$/;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue.match(pattern) || inputValue === "") {
      onInputChange(inputValue);
    }
  };

  return (
    <Input
      value={inputValue}
      onChange={handleInputChange}
      className={styles.InputField}
      {...props}
    />
  );
};

export default NumericInput;
