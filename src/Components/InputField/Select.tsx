import { Select as NativeSelect, SelectProps } from "antd";
import React from "react";
import { Loader } from "../Loader";
import styles from "./styles.module.less";

const Select: React.FC<React.PropsWithChildren<SelectProps>> = ({
  ...props
}) => {
  return (
    <NativeSelect
      notFoundContent={props.loading ? <Loader isLoading /> : null}
      getPopupContainer={(node) => node.parentElement as HTMLElement}
      placement="bottomLeft"
      listHeight={200}
      className={styles.InputField}
      {...props}
    />
  );
};

export default Select;
