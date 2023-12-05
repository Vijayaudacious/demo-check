import Icon, {
  DashboardIcon,
  EmployeeIcon,
  LeaveIcon,
  PayrollIcon,
  ProjectIcon,
  RoleIcon,
  SettingIcon,
  Starticon,
} from "@/Assets/Images";
import logo from "@/Assets/Images/logo.png";
import { PermissionContext } from "@/Auth";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import { MenuItem } from "@/Types/Sidebar";
import { CloseOutlined } from "@ant-design/icons";
import { Image, Layout, Menu, Tooltip } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useLocation, useNavigate } from "react-router-dom";
import MobileNavigation from "./MobileNavigations";
import styles from "./styles.module.less";

import "antd-css-utilities/utility.min.css";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  top: number;
}

const getCurrentTab = (pathname: string) => {
  let path = "/";
  if (pathname.includes("/employees")) {
    path = "/employees";
  } else if (pathname.includes("/roles")) {
    path = "/roles";
  } else if (pathname.includes("/attendance")) {
    path = "/attendance";
  } else if (pathname.includes("/leaves")) {
    path = "/leaves/calender";
  } else if (pathname.includes("/projects")) {
    path = "/projects";
  } else if (pathname.includes("/reports")) {
    path = "/reports";
  } else if (pathname.includes("/payroll/salary-templates")) {
    path = "/payroll/salary-templates";
  } else if (pathname.includes("/payroll/my-expenses")) {
    path = "/payroll/my-expenses";
  } else if (pathname.includes("/payroll/processing")) {
    path = "/payroll/processing";
  } else if (pathname.includes("/money-manager/categories")) {
    path = "/money-manager/categories";
  } else if (pathname.includes("/money-manager/incomes")) {
    path = "/money-manager/incomes";
  } else if (pathname.includes("/money-manager/expenses")) {
    path = "/money-manager/expenses";
  } else if (pathname.includes("/money-manager/report")) {
    path = "/money-manager/report";
  } else if (pathname.includes("/settings/organization")) {
    path = "/settings/organization";
  } else if (
    pathname.includes("/settings") ||
    pathname.includes("/organizations")
  ) {
    path = "/settings/employee";
  }
  return path;
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, top }) => {
  const { pathname } = useLocation();
  const { leaves, users, roles, projects, reports } =
    useContext(PermissionContext);
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [current, setCurrent] = useState(pathname);
  const { isMobile } = useWindowDimensions();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    setCurrent(getCurrentTab(pathname));
  }, [pathname]);

  const items: MenuItem[] = [
    {
      label: (
        <Tooltip
          placement="right"
          title={formatMessage({ id: "sidebar.menu.dashboard" })}
        >
          {formatMessage({ id: "sidebar.menu.dashboard" })}
        </Tooltip>
      ),
      key: "/",
      icon: <Icon id="dashboard" icon={DashboardIcon} />,
      id: "dashboard",
    },
    {
      label: (
        <Tooltip
          placement="right"
          title={formatMessage({ id: "sidebar.menu.users" })}
        >
          {formatMessage({ id: "sidebar.menu.users" })}
        </Tooltip>
      ),
      icon: <Icon icon={EmployeeIcon} />,
      key: "users",
      id: "users",
      children: [
        (users || []).length && {
          key: "/employees",
          label: formatMessage({ id: "sidebar.menu.employees" }),
          id: "employee",
        },
        (roles || []).length && {
          key: "/roles",
          label: formatMessage({ id: "sidebar.menu.roles" }),
          id: "roles",
        },
      ],
    },
    {
      label: (
        <>
          <Tooltip
            placement="right"
            title={formatMessage({ id: "sidebar.menu.attendance" })}
          >
            {formatMessage({ id: "sidebar.menu.attendance" })}{" "}
          </Tooltip>
          <span title="Preview" className={styles.previewTitle}>
            <Icon icon={Starticon} width={"10px"} />
            {formatMessage({
              id: "generic.preview",
            })}
          </span>
        </>
      ),
      id: "attendance",
      key: "attendance",
      icon: <Icon icon={LeaveIcon} id="leaves" />,
      children: [
        {
          key: "/attendance",
          label: formatMessage({ id: "sidebar.menu.attendance" }),
          id: "attendance",
        },
        (leaves || []).length && {
          key: "/leaves/calender",
          label: formatMessage({ id: "sidebar.menu.leaves" }),
          id: "leaves",
        },
      ],
    },
    {
      label: (
        <Tooltip
          placement="right"
          title={formatMessage({ id: "sidebar.menu.reports" })}
        >
          {formatMessage({ id: "sidebar.menu.reports" })}
        </Tooltip>
      ),
      id: "reports",
      key: "reports",
      icon: <Icon icon={ProjectIcon} id="projects" />,
      children: [
        (projects || []).length && {
          key: "/projects",
          label: formatMessage({ id: "sidebar.menu.projects" }),
          id: "projects",
        },
        (reports || []).length && {
          key: "/reports",
          label: formatMessage({ id: "sidebar.menu.dailyReporting" }),
          id: "daily_reporting",
        },
      ],
    },
    {
      label: (
        <>
          <Tooltip
            placement="right"
            title={formatMessage({ id: "sidebar.menu.payroll" })}
          >
            {formatMessage({ id: "sidebar.menu.payroll" })}
          </Tooltip>

          <span title="Preview" className={styles.previewTitle}>
            <Icon icon={Starticon} width={"10px"} />
            {formatMessage({
              id: "generic.preview",
            })}
          </span>
        </>
      ),
      id: "payroll",
      key: "payroll",
      icon: <Icon icon={PayrollIcon} id="payroll" />,
      children: [
        {
          key: "/payroll/my-expenses",
          label: (
            <>
              {formatMessage({ id: "sidebar.menu.myExpenses" })}
              <span className={styles.previewSubTitle}>
                <Icon icon={Starticon} width={"10px"} />
                {formatMessage({
                  id: "generic.preview",
                })}
              </span>
            </>
          ),
          id: "my_expenses",
        },
        {
          key: "/payroll/salary-templates",
          label: (
            <>
              {formatMessage({ id: "sidebar.menu.salaryTemplates" })}
              <span className={styles.previewSubTitle}>
                <Icon icon={Starticon} width={"10px"} />
                {formatMessage({
                  id: "generic.preview",
                })}
              </span>
            </>
          ),
          id: "salary_templates",
        },
        {
          key: "/payroll/processing",
          label: (
            <>
              {formatMessage({ id: "sidebar.menu.processing" })}
              <span className={styles.previewSubTitle}>
                <Icon icon={Starticon} width={"10px"} />
                {formatMessage({
                  id: "generic.preview",
                })}
              </span>
            </>
          ),
          id: "processing",
        },
      ],
    },
    {
      label: (
        <Tooltip
          placement="right"
          title={formatMessage({ id: "sidebar.menu.moneyManager" })}
        >
          {formatMessage({ id: "sidebar.menu.moneyManager" })}
        </Tooltip>
      ),
      icon: <Icon icon={RoleIcon} />,
      key: "money-manager",
      id: "money-manager",
      children: [
        {
          key: "/money-manager/report",
          label: (
            <>
              {formatMessage({ id: "sidebar.menu.report" })}
              <span className={styles.SubTitle}>
                <Icon icon={Starticon} width={"10px"} />
                {formatMessage({
                  id: "generic.preview",
                })}
              </span>
            </>
          ),
          id: "categories",
        },
        {
          key: "/money-manager/incomes",
          label: (
            <>
              {formatMessage({ id: "sidebar.menu.incomes" })}
              <span className={styles.SubTitle}>
                <Icon icon={Starticon} width={"10px"} />
                {formatMessage({
                  id: "generic.preview",
                })}
              </span>
            </>
          ),
          id: "incomes",
        },
        {
          key: "/money-manager/expenses",
          label: (
            <>
              {formatMessage({ id: "sidebar.menu.expenses" })}
              <span className={styles.SubTitle}>
                <Icon icon={Starticon} width={"10px"} />
                {formatMessage({
                  id: "generic.preview",
                })}
              </span>
            </>
          ),
          id: "expenses",
        },
        {
          key: "/money-manager/categories",
          label: (
            <>
              {formatMessage({ id: "sidebar.menu.categories" })}
              <span className={styles.SubTitle}>
                <Icon icon={Starticon} width={"10px"} />
                {formatMessage({
                  id: "generic.preview",
                })}
              </span>
            </>
          ),
          id: "categories",
        },
      ],
    },
    {
      label: (
        <Tooltip
          placement="right"
          title={formatMessage({ id: "sidebar.menu.settings" })}
        >
          {formatMessage({ id: "sidebar.menu.settings" })}
        </Tooltip>
      ),
      id: "settings",
      key: "settings",
      icon: <Icon icon={SettingIcon} id="settings" />,
      children: [
        {
          key: "/settings/employee",
          label: formatMessage({ id: "sidebar.menu.profile" }),
          id: "Profile",
        },
        {
          key: "/settings/organization",
          label: formatMessage({ id: "sidebar.menu.organization" }),
          id: "Organization",
        },
      ],
    },
  ];

  return isMobile ? <MobileNavigation menus={items} /> : "";
};
export default Sidebar;
