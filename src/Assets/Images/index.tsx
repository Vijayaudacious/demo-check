import React from "react";
import ArchiveLogo from "./Icon/archive.svg";
import CircleCheck from "./Icon/check-circle.svg";
import ZestLogo from "./zestlogoBlue.png";
import DashboardIcon from "./Icon/SidebarIcon/dashboard.svg";
import EmployeeIcon from "./Icon/SidebarIcon/employees.svg";
import LeaveIcon from "./Icon/SidebarIcon/leaves.svg";
import ProjectIcon from "./Icon/SidebarIcon/project.svg";
import RoleIcon from "./Icon/SidebarIcon/roles.svg";
import SettingIcon from "./Icon/SidebarIcon/setting.svg";
import ReportIcon from "./Icon/SidebarIcon/report.svg";
import Dashemp from "./Icon/SidebarIcon/dashemp.svg";
import Dashleave from "./Icon/SidebarIcon/dashleave.svg";
import Dashproject from "./Icon/SidebarIcon/dashproject.svg";
import ArrowPre from "./Icon/arrow-left.svg";
import ArrowNext from "./Icon/arrow-right.svg";
import CopyIcon from "./Icon/copy.svg";
import NextArrowBlack from "./Icon/arrow-blue-right.svg";
import PrevArrowBlack from "./Icon/arrow-blue-left.svg";
import PremiumCrown from "./premiumCrown.png";
import CancelIcon from "./Icon/cancel.svg";
import HolidayIcon from "./Icon/SidebarIcon/holidayIcon.svg";
import PayrollIcon from "./Icon/SidebarIcon/payroll.svg";
import Starticon from "./Icon/SidebarIcon/starticon.svg";
import IncomeIcon from "./Icon/income.svg";
import ExpensesIcon from "./Icon/expenses.svg";
import HomeIcon from "./Icon/SidebarIcon/home.svg";
import SearchIcon from "./Icon/SidebarIcon/search.svg";
import VideoPlayerIcon from "./Icon/SidebarIcon/videoplayer.svg";
import UserProfileIcon from "./Icon/SidebarIcon/userprofile.svg";

interface IconProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  icon: string;
}

const Icon: React.FC<IconProps> = ({ icon, ...props }) => {
  return <img src={icon} alt={props.alt || ""} {...props} />;
};

export {
  ArchiveLogo,
  CircleCheck,
  ZestLogo,
  DashboardIcon,
  EmployeeIcon,
  LeaveIcon,
  ProjectIcon,
  RoleIcon,
  SettingIcon,
  ReportIcon,
  PayrollIcon,
  Dashemp,
  Dashleave,
  Dashproject,
  ArrowPre,
  ArrowNext,
  CopyIcon,
  PrevArrowBlack,
  NextArrowBlack,
  CancelIcon,
  PremiumCrown,
  HolidayIcon,
  Starticon,
  IncomeIcon,
  ExpensesIcon,
  HomeIcon,
  SearchIcon,
  VideoPlayerIcon,
  UserProfileIcon,
};

export default Icon;
