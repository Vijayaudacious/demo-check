import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";
import styles from "./styles.module.less";
const NoPaymentAuthority: React.FC = () => (
  <div className={styles.container}>
    <Result
      status="warning"
      title="Your plan for your organization is expired please contact your administrator."
      extra={
        <Link to="/login">
          <Button type="primary" key="console">
            Go To Login
          </Button>
        </Link>
      }
    />
  </div>
);

export default NoPaymentAuthority;
