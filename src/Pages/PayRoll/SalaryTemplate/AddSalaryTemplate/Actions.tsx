import { Tooltip } from "antd";
import React from "react";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useIntl } from "react-intl";
import styles from "./styles.module.less";

interface ActionProps {
  length: number;
  name: number;
  actions: {
    add: () => void;
    remove: (index: number) => void;
  };
}

const Actions = ({ length, name, actions }: ActionProps) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <Tooltip
        title={formatMessage({
          id: "generic.add",
        })}
      >
        <div className={styles.addIcon}>
          <PlusCircleOutlined
            onClick={() => actions.add()}
            id={`add_${length}`}
          />
        </div>
      </Tooltip>
      {length > 1 && (
        <Tooltip
          title={formatMessage({
            id: "generic.delete",
          })}
        >
          <div className={styles.removeIcon}>
            <MinusCircleOutlined
              onClick={() => actions.remove(name)}
              id={`remove_${length}`}
            />
          </div>
        </Tooltip>
      )}
    </>
  );
};

export default Actions;
