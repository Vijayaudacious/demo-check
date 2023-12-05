import { InputProps, Input as NativeInput, Select } from "antd";
import React, { useState } from "react";
import styles from "./styles.module.less";
import NumericInput from "./NumericInput";

const { Option } = Select;

export interface CommonFormComponentProps
  extends Pick<InputProps, "allowClear"> {
  name?: string;
  type?:
    | "text"
    | "number"
    | "textArea"
    | "select"
    | "multiselect"
    | "password"
    | "email";
  label?: string;
  placeholder?: string;
  options?: any;
  isPassword?: boolean;
  isMultiselect?: boolean;
  id?: string;
  disabled?: boolean;
  onChange?: (
    value: React.ChangeEvent<any> | string[] | string
  ) => void | undefined;
  className?: string;
  value?: any;
  rows?: number;
  maxTagCount?: number;
  showSearch?: string;
  mode?: string;
  onSearch?: (value: string) => void;
  notFoundContent?: any;
  filterOption?: any;
  maxLength?: number;
  defaultValue?: any;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  allowedCharacters?: string[];
}

export const Input: React.FC<CommonFormComponentProps> = ({
  type,
  placeholder,
  options,
  onChange,
  value,
  label,
  id,
  disabled = false,
  defaultValue,
  addonBefore,
  addonAfter,
  allowedCharacters,
  ...props
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const handleChange = (e: React.ChangeEvent<any>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  if (type === "textArea") {
    return (
      <NativeInput.TextArea
        onChange={handleChange}
        value={value}
        id={id}
        placeholder={placeholder}
        className={styles.InputField}
      />
    );
  }

  if (type === "select") {
    return (
      <Select
        placeholder={placeholder}
        value={value}
        id={id}
        onChange={onChange}
        className={styles.InputField}
        defaultValue={defaultValue}
        getPopupContainer={(node) => node.parentElement as HTMLElement}
      >
        {options?.map(
          (option: { label: string; value: string }, index: number) => (
            <Option label={label} key={index} value={option.value}>
              {option.label}
            </Option>
          )
        )}
      </Select>
    );
  }

  if (type === "multiselect") {
    return (
      <Select
        mode="multiple"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.InputField}
        defaultValue={defaultValue}
      >
        {options?.map((option: { label: string; value: string }) => (
          <Option
            key={option.value}
            className={`${styles.InputField} ${styles.scrollableSelect}`}
            value={option.value}
          >
            {option.label}
          </Option>
        ))}
      </Select>
    );
  }

  if (type === "password") {
    return (
      <NativeInput.Password
        placeholder={placeholder}
        value={value}
        id={id}
        onChange={handleChange}
        className={styles.InputField}
      />
    );
  }

  if (type === "number") {
    const handleInputChange = (value: string) => {
      setInputValue(value);
      if (onChange) {
        onChange(value);
      }
    };

    return (
      <NumericInput
        inputValue={inputValue}
        value={value}
        onInputChange={handleInputChange}
        placeholder={placeholder}
        id={id}
        addonBefore={addonBefore}
        addonAfter={addonAfter}
      />
    );
  }

  return (
    <NativeInput
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={handleChange}
      className={styles.InputField}
      {...props}
    />
  );
};
