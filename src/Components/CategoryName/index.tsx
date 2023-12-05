import { Skeleton } from "antd";
import get from "lodash/get";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.less";
import { isUUID } from "@/Utils/generic";
import { snakeCase } from "lodash";
import { useCategory } from "@/Hooks/categories";
import { useIntl } from "react-intl";

interface CategoryNameProps {
  id: string;
  type?: "link" | "text";
  idAttribute?: string;
}

const Categoryname: React.FC<CategoryNameProps> = ({
  id,
  type = "text",
  idAttribute,
}) => {
  const { formatMessage } = useIntl();
  const { data, isLoading, isError, isSuccess } = useCategory(id);
  const isLink = type === "link";

  const hasError = (isSuccess && !data?.name) || isError || !isUUID(id);
  return (
    <Skeleton active loading={isLoading} paragraph={{ rows: 0 }}>
      {hasError && (
        <i>
          {formatMessage({
            id: "incomesExpenses.list.columns.category.notFound",
          })}
        </i>
      )}
      {isSuccess && (
        <>
          {!isLink && (
            <span id={idAttribute || `${snakeCase(data?.name)}Category`}>
              {data?.name}
            </span>
          )}
          {isLink && (
            <Link
              to={`/employees/${id}/overview`}
              className={styles.nameLink}
              id={idAttribute || `${snakeCase(data?.name)}Category`}
            >
              {data?.name}
            </Link>
          )}
        </>
      )}
    </Skeleton>
  );
};
export default Categoryname;
