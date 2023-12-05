import { SelectLanguageContext } from "@/App";
import logo from "@/Assets/Images/earning-icons.png";
import { PermissionContext, UserContext } from "@/Auth";
import { formatName } from "@/Components/Formats";
import { Loader } from "@/Components/Loader";
import { MyTag } from "@/Components/Tag";
import { useOrganization } from "@/Hooks/organization";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import { SUPPORTED_LAGUAGES as SUPPORTED_LANGUAGES } from "@/Languages/constants";
import {
  LogoutOutlined,
  PoweroffOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Image,
  Layout,
  MenuProps,
  Select,
  notification,
} from "antd";
import classNames from "classnames";
import dayjs from "dayjs";
import get from "lodash/get";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import styles from "./styles.module.less";

const { ENGLISH } = SUPPORTED_LANGUAGES;

const Layouts: React.FC = () => {
  const { name, email, roles, contactNumber, _id, profilePicture } =
    useContext(UserContext);
  const { payments } = useContext(PermissionContext);
  const { getLanguage } = useContext(SelectLanguageContext);
  const [, contextHolder] = notification.useNotification();
  const { data: organizationResponse } = useOrganization();
  const { isMobile } = useWindowDimensions();

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const isFreeTrial =
    get(organizationResponse, "data.data.freeTrial", false) &&
    (payments || []).includes("canPay");
  const endDate = get(organizationResponse, "data.data.endDate");
  const expireDate = dayjs(endDate).diff(dayjs(), "day");

  const baseURL = process.env.REACT_APP_BASE_API;
  const navigate = useNavigate();

  const notificationRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const { Header } = Layout;
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userDetails");
    navigate("/dashboard");
  };
  const [collapsed, setCollapsed] = useState(isMobile || false);

  const profilePic = `${baseURL}${profilePicture}`;

  const languageOptions = [{ value: ENGLISH, label: "English" }];

  const handleLanguageChnage = (value: string) => {
    localStorage.setItem("language", value);
    getLanguage(value);
  };

  const tokenRemove = () => {
    localStorage.removeItem("authToken");
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className={styles.menu}>
          {profilePicture ? (
            <img
              src={profilePic}
              alt="profileImage"
              className={styles.imgProfile}
            />
          ) : (
            <Avatar
              className={styles.avatar}
              size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            >
              <span>{name?.trim().charAt(0).toUpperCase()}</span>
            </Avatar>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <Link
          to={`/employees/${_id}/overview`}
          className="text-center"
          id="employee_name"
        >
          <h2>{name ? name : "No user logedIn"}</h2>
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <>
          {roles?.map((item: any) => {
            return (
              <MyTag color="blue" key={item.name}>
                {formatName(item?.name)}
              </MyTag>
            );
          })}
        </>
      ),
    },
    { key: "4", label: <h3 className="text-center">{email}</h3> },
    {
      key: "5",
      label: <h3 className="text-center">{contactNumber}</h3>,
    },
    {
      key: "6",
      label: (
        <>
          <hr />
          <div className={classNames(styles.buttonProfile, "mt-3")}>
            <Link to={`/settings/employee`}>
              <Button type="primary" id="profile" className={styles.btnProfile}>
                <ProfileOutlined /> Profile
              </Button>
            </Link>
            <Link to="/login" onClick={logout}>
              <Button id="logout">
                <LogoutOutlined /> Logout
              </Button>
            </Link>
          </div>
        </>
      ),
    },
  ];

  const showUpgradeMessage = isFreeTrial && expireDate < 16;

  const top = notificationRef.current?.clientHeight ?? 0;
  const dividerHeight = (headerRef.current?.clientHeight ?? 0) + top + 10;
  return (
    <>
      {contextHolder}
      {showUpgradeMessage && (
        <div className={styles.expireAlert} ref={notificationRef}>
          <h3>
            Your free trial will expire within <b>{expireDate} days</b>. To
            continue using our services, please upgrade your plan. Click on the
            'Upgrade' button to upgrade the plan.
          </h3>
          <Link to="/plans">
            <Button type="primary">UPGRADE</Button>
          </Link>
        </div>
      )}
      <Layout>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} top={top} />
        <Layout
          className={`${styles.containerOpen} ${
            collapsed && styles.containerClose
          }`}
          onClick={() => {
            if (isMobile && !collapsed) {
              setCollapsed(true);
            }
          }}
        >
          <div className={styles.main}>
            <Header
              className={classNames(styles.header, {
                [styles.tabHeaderClose]: collapsed,
              })}
              style={{
                top,
              }}
              ref={headerRef}
            >
              <div>
                <Link to="/">
                  <Image
                    className={styles.imageLogo}
                    src={logo}
                    preview={false}
                  />
                  <span
                    style={{
                      color: "white",
                      fontWeight: 900,
                      fontSize: "15px",
                      marginLeft: "12px",
                      fontFamily: "cursive",
                      backgroundImage:
                        "linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1))",
                    }}
                  >
                    POST EARN
                  </span>
                </Link>
              </div>
              <div className={styles.userIcon}>
                <div>
                  <Button
                    type="ghost"
                    style={{ color: "red", fontWeight: 900 }}
                    onClick={tokenRemove}
                    icon={<PoweroffOutlined />}
                  >
                    Log out
                  </Button>
                </div>
              </div>
            </Header>
          </div>
          <div style={{ height: dividerHeight }} />
          <React.Suspense fallback={<Loader isLoading centered />}>
            <Outlet />
          </React.Suspense>
        </Layout>
      </Layout>
    </>
  );
};
export default Layouts;
