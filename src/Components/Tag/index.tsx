import { Tag } from "antd";
import React, { ReactNode } from "react";
import styles from "./styles.module.less";
import classNames from "classnames";

interface MyTagProps {
  color: string;
  children: ReactNode;
}

export const MyTag: React.FC<MyTagProps> = ({
  children,
  color,
  ...restProps
}) => {
  return (
    <Tag
      color={color}
      {...restProps}
      className={classNames(styles.tagName, "text-center")}
    >
      {children}
    </Tag>
  );
};
