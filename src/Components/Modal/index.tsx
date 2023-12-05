import Icon, { CancelIcon } from "@/Assets/Images";
import { ModalProps, Modal as NativeModal } from "antd";
import React from "react";
import { useIntl } from "react-intl";
import styles from "./styles.module.less";
import classNames from "classnames";
import useWindowDimensions from "@/Hooks/useWindowDimensions";

const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({
  children,
  ...props
}) => {
  const { formatMessage } = useIntl();
  const { isMobile } = useWindowDimensions();

  return (
    <NativeModal
      destroyOnClose
      centered
      okText={formatMessage({ id: "generic.ok" })}
      cancelText={formatMessage({ id: "generic.cancel" })}
      transitionName="ant-modal-slide-up"
      style={
        isMobile
          ? {
              bottom: -8,
            }
          : {}
      }
      {...props}
      closeIcon={<Icon width={30} icon={CancelIcon} />}
      className={classNames(styles.customModal, props.className)}
    >
      {children}
    </NativeModal>
  );
};

export default Modal;
