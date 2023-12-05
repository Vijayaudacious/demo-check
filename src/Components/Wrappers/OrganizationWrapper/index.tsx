import { Tabs } from "antd";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageLayoutWrapper from "../PageLayoutWrapper";
import { useIntl } from "react-intl";

interface PageLayoutWrapperProps {
  breadcurmbs?: Route[];
}

const OrganizationWrapper: React.FC<
  React.PropsWithChildren<PageLayoutWrapperProps>
> = ({ children, breadcurmbs }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (pathname.includes("/working-hours")) {
      setCurrent("working-hours");
    } else if (pathname.includes("/holidays")) {
      setCurrent("holidays");
    } else {
      setCurrent("");
    }
  }, [pathname]);

  const organizationTabs = [
    {
      label: formatMessage({ id: "settings.tabs.organization.general" }),
      key: "",
    },
    {
      label: formatMessage({ id: "settings.tabs.organization.workingHours" }),
      key: "working-hours",
    },
    {
      label: formatMessage({ id: "settings.tabs.organization.holidays" }),
      key: "holidays",
    },
  ];

  const onTabChange = (selectedTab: string) => {
    navigate(`/settings/organization/${selectedTab}`);
  };

  return (
    <PageLayoutWrapper breadcurmbs={breadcurmbs}>
      <Tabs
        type="card"
        items={organizationTabs}
        activeKey={current}
        onChange={onTabChange}
      />
      {children}
    </PageLayoutWrapper>
  );
};

export default OrganizationWrapper;
