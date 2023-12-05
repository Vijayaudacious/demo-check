import { Spin } from "antd";
import React from "react";
import styles from "./styles.module.less";

interface LoadingProps {
  isLoading: boolean;
  size?: "small" | "default" | "large";
  centered?: boolean;
}
export const Loader: React.FC<React.PropsWithChildren<LoadingProps>> = ({
  isLoading,
  centered = false,
  ...props
}) => {
  return (
    <>
      {isLoading && (
        <Spin className={`${centered && styles.center}`} {...props} />
      )}
    </>
  );
};
