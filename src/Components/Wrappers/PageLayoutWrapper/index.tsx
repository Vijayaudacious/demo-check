import { Breadcrumb } from "antd";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import React, { useMemo } from "react";
import styles from "./styles.module.less";
import { Link } from "react-router-dom";
import { titleCase } from "@/Utils/generic";
import classNames from "classnames";
import snakeCase from "lodash/snakeCase";
import { HomeOutlined } from "@ant-design/icons";

interface PageLayoutWrapperProps {
  breadcurmbs?: Route[];
  noBreadcrum?: boolean;
}
const PageLayoutWrapper: React.FC<
  React.PropsWithChildren<PageLayoutWrapperProps>
> = ({
  children,
  noBreadcrum = false,
  breadcurmbs = [{ breadcrumbName: "dashboard", path: "/" }],
}) => {
  const itemRender = (route: Route) => {
    if (route.path) {
      return (
        <Link
          to={route.path}
          id={`breadcrum_${snakeCase(route.breadcrumbName)}`}
        >
          {route.path === "/" ? (
            <HomeOutlined className={styles.homeIcon} />
          ) : (
            titleCase(route.breadcrumbName)
          )}
        </Link>
      );
    }
    return (
      <span className={styles.withoutLink}>
        {titleCase(route.breadcrumbName)}
      </span>
    );
  };
  const breadcrumbs = useMemo(() => {
    if (breadcurmbs.some(({ path }) => path === "/")) {
      return breadcurmbs;
    }
    breadcurmbs.unshift({
      breadcrumbName: "dashboard",
      path: "/",
    });
    return breadcurmbs;
  }, [breadcurmbs]);

  return (
    <>
      {!noBreadcrum && (
        <div className={styles.breadcrum}>
          <Breadcrumb routes={breadcrumbs} itemRender={itemRender} />
        </div>
      )}
      <div className={classNames({ [styles.childrenContainer]: !noBreadcrum })}>
        {children}
      </div>
    </>
  );
};

export default PageLayoutWrapper;
