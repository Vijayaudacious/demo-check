import { titleCase } from "@/Utils/generic";
import { Button, Tooltip } from "antd";
import React from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

interface RemainingTimeProps {
  hours: number;
  setWorkingHour: string | boolean;
}

const RemainingTime: React.FC<RemainingTimeProps> = ({
  hours,
  setWorkingHour,
}) => {
  const { formatMessage } = useIntl();

  return (
    <div>
      {!setWorkingHour ? (
        <span>
          {formatMessage(
            {
              id: "attendance.timeSheet.header.hours",
            },
            {
              hours: hours,
            }
          )}
        </span>
      ) : (
        <Tooltip
          title={formatMessage(
            {
              id: "attendance.timeSheet.tooltip.updateWorkingDay",
            },
            {
              weekname: titleCase(String(setWorkingHour)),
            }
          )}
        >
          <Link to="/settings/organization/working-hours">
            <Button type="primary">
              {formatMessage({
                id: "generic.update",
              })}
            </Button>
          </Link>
        </Tooltip>
      )}
    </div>
  );
};

export default RemainingTime;
