import { PlanContext } from "@/Auth";
import { LockOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import get from "lodash/get";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

interface AddActionProps {
  module: string;
  tooltipTitle: React.ReactNode;
  totalRecords: Number;
}
const AddAction: React.FC<React.PropsWithChildren<AddActionProps>> = ({
  children,
  module,
  tooltipTitle,
  totalRecords,
}) => {
  const { formatMessage } = useIntl();
  const { accessControl } = useContext(PlanContext);
  const allowedItems = get(accessControl, `${module}.count`);

  if (allowedItems > totalRecords) {
    return <>{children}</>;
  }
  return (
    <Tooltip title={tooltipTitle}>
      <Button type="primary" icon={<LockOutlined />}>
        {formatMessage({
          id: "generic.add",
        })}
      </Button>
    </Tooltip>
  );
};

export default AddAction;
