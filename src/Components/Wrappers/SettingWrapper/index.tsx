import { SecurityScanOutlined, SettingOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PageLayoutWrapper from "../PageLayoutWrapper";
import { useIntl } from "react-intl";

interface PageLayoutWrapperProps {
  breadcurmbs?: Route[];
}
const SettingDetailsWrapper: React.FC<
  React.PropsWithChildren<PageLayoutWrapperProps>
> = ({ children, breadcurmbs }) => {
  const { pathname } = useLocation();
  const [current, setCurrent] = useState("employee");
  const { formatMessage } = useIntl();
  useEffect(() => {
    if (pathname.includes("/employee")) {
      setCurrent("employee");
    } else if (pathname.includes("/security")) {
      setCurrent("security");
    }
  }, [current]);

  const settingTabs = [
    {
      label: (
        <Link to={"/settings/employee"} id="general">
          <SettingOutlined />
          {formatMessage({ id: "settings.tabs.organization.general" })}
        </Link>
      ),
      key: "employee",
    },
    {
      label: (
        <Link to={"/settings/security"} id="security">
          <SecurityScanOutlined />
          {formatMessage({ id: "settings.tabs.Profile.security" })}
        </Link>
      ),
      key: "security",
    },
  ];

  return (
    <PageLayoutWrapper breadcurmbs={breadcurmbs}>
      <Tabs items={settingTabs} activeKey={current} type="card" />
      {children}
    </PageLayoutWrapper>
  );
};

export default SettingDetailsWrapper;
