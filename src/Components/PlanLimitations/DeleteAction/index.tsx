import { PlanContext } from "@/Auth";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import get from "lodash/get";
import React, { useContext } from "react";
import { Link } from "react-router-dom";

interface DeleteActionProps {
  module: string;
  tooltipTitle: React.ReactNode;
}
const DeleteAction: React.FC<React.PropsWithChildren<DeleteActionProps>> = ({
  children,
  module,
  tooltipTitle,
}) => {
  const { accessControl } = useContext(PlanContext);
  const isDeleteable = get(accessControl, `${module}.deletable`);
  const deletable = isDeleteable !== undefined ? isDeleteable : true;

  if (deletable) {
    return <>{children}</>;
  }
  return (
    <Tooltip title={tooltipTitle}>
      <Button danger icon={<DeleteOutlined />} />
    </Tooltip>
  );
};

export default DeleteAction;
