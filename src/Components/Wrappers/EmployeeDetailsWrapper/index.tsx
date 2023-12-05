import { UserContext } from "@/Auth";
import {
  CalendarOutlined,
  FormOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Tabs } from "antd";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import React, { useContext } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PageLayoutWrapper from "../PageLayoutWrapper";
import { useIntl } from "react-intl";

interface PageLayoutWrapperProps {
  breadcurmbs?: Route[];
}
const EmployeeDetailsWrapper: React.FC<
  React.PropsWithChildren<PageLayoutWrapperProps>
> = ({ children, breadcurmbs }) => {
  const { formatMessage } = useIntl();
  const { id } = useParams();
  const { pathname } = useLocation();
  const { _id: currentUserId } = useContext(UserContext);
  const employeeTabs = [
    {
      label: (
        <Link to={`/employees/${id}/overview`} id={`${id}_overview`}>
          <UserOutlined />
          {formatMessage({
            id: "employee.employeeTabs.profileOverview",
          })}
        </Link>
      ),
      key: `overview`,
    },
    {
      label: currentUserId !== id && (
        <Link to={`/employees/${id}/leaves`} id={`${id}_leaves`}>
          <CalendarOutlined />
          {formatMessage({
            id: "employee.employeeTabs.leaves",
          })}
        </Link>
      ),
      key: `leaves`,
    },
    {
      label: currentUserId !== id && (
        <Link to={`/employees/${id}/feedback`} id={`${id}_feedback`}>
          <FormOutlined />
          {formatMessage({
            id: "employee.employeeTabs.feedback",
          })}
        </Link>
      ),
      key: `feedback`,
    },
  ];

  return (
    <PageLayoutWrapper breadcurmbs={breadcurmbs}>
      <Tabs
        activeKey={pathname.split("/")[3]}
        items={employeeTabs}
        type="card"
      />
      {children}
    </PageLayoutWrapper>
  );
};

export default EmployeeDetailsWrapper;
