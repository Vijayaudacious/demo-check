import { useUser } from "@/Hooks/emloyee";
import { Skeleton } from "antd";
import get from "lodash/get";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.less";
import { isUUID } from "@/Utils/generic";
import { snakeCase } from "lodash";
interface UsernameProps {
  id: string;
  type?: "link" | "text";
  idAttribute?: string;
}

const Username: React.FC<UsernameProps> = ({
  id,
  type = "text",
  idAttribute,
}) => {
  const { data, isLoading, isError, isSuccess } = useUser(id);
  const name = get(data, "data.data.name");
  const isLink = type === "link";

  const hasError = (isSuccess && !name) || isError || !isUUID(id);
  return (
    <Skeleton active loading={isLoading} paragraph={{ rows: 0 }}>
      {hasError && <i>User not found.</i>}
      {isSuccess && (
        <>
          {!isLink && (
            <span id={idAttribute || `${snakeCase(name)}_employee`}>
              {name}
            </span>
          )}
          {isLink && (
            <Link
              to={`/employees/${id}/overview`}
              className={styles.nameLink}
              id={idAttribute || `${snakeCase(name)}_employee`}
            >
              {name}
            </Link>
          )}
        </>
      )}
    </Skeleton>
  );
};
export default Username;
