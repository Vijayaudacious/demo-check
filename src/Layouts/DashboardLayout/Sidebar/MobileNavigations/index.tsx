import Icon, {
  HomeIcon,
  SearchIcon,
  VideoPlayerIcon,
  UserProfileIcon,
} from "@/Assets/Images";
import styles from "./styles.module.less";
import { MenuOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { Drawer } from "antd";
import React, { useEffect, useState } from "react";
import { MenuItem } from "@/Types/Sidebar";

type MobileNavigationProps = {
  menus: MenuItem[];
};
const MobileNavigation: React.FC<MobileNavigationProps> = ({ menus }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <div className={styles.mobileNav}>
      <Link to="/" className={styles.link}>
        <div className={styles.item}>
          <Icon id="dashboard" className={styles.icon} icon={HomeIcon} /> Home
        </div>
      </Link>
      <Link to="/leaves/calender" className={styles.link}>
        <div className={styles.item}>
          <Icon icon={SearchIcon} className={styles.icon} id="leaves" />
          Search
        </div>
      </Link>
      <Link to="/reports" className={styles.link}>
        <div className={styles.item}>
          <Icon icon={VideoPlayerIcon} className={styles.icon} id="projects" />{" "}
          Video
        </div>
      </Link>
      <Link to="/settings/employee" className={styles.link}>
        <div className={styles.item}>
          <Icon icon={UserProfileIcon} className={styles.icon} id="settings" />{" "}
          Profile
        </div>
      </Link>
      <div className={styles.item} onClick={showDrawer}>
        <MenuOutlined id="mobile_menu_toggle_btn" className={styles.icon} />{" "}
        Others
      </div>
      <Drawer title="All Menus" placement="right" onClose={onClose} open={open}>
        {menus.map((menu) => (
          <div className={styles.drawerItem} key={menu.id}>
            <div className={styles.label}>{menu.label}</div>
            <div className={styles.menuItems}>
              {(menu.children || [menu]).map((item) => (
                <Link
                  to={item.key}
                  className={styles.link}
                  key={item.id}
                  onClick={onClose}
                >
                  {menu.icon} {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </Drawer>
    </div>
  );
};

export default MobileNavigation;
