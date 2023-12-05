import Icon, { CancelIcon } from "@/Assets/Images";
import { DeleteOutlined } from "@ant-design/icons";
import { Button, Form, ModalProps } from "antd";
import React, { ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import { Input } from "../InputField";
import styles from "./styles.module.less";
import Modal from "../Modal";
interface DeleteProp extends ModalProps {
  title: string | React.ReactNode;
  name?: string;
  handleOk?: any;
  isDeleteItem?: boolean;
  isDisable?: boolean;
  customIcon?: ReactNode;
  isMobileDelete?: boolean;
  id?: string;
  className?: string;
  deleteingKey?: string;
  okButtonText?: string;
  cancelButtonText?: string;
  extra?: React.ReactNode;
  isMobile?: boolean;
}
const DeleteModal: React.FC<DeleteProp> = ({
  title,
  handleOk,
  name,
  isDeleteItem,
  isDisable = false,
  customIcon,
  isMobileDelete = false,
  className,
  id,
  okButtonText,
  cancelButtonText,
  deleteingKey = "delete",
  extra,
  isMobile,
  ...props
}) => {
  const [showModal, setShowModal] = useState(false);
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();

  const handleClose = () => {
    setShowModal(false);
    form.resetFields();
  };
  return (
    <>
      {isDeleteItem ? (
        <Button
          key="1"
          className={className}
          onClick={() => setShowModal(true)}
          id={id}
        >
          {name}
        </Button>
      ) : !isMobileDelete ? (
        isMobile ? (
          <a
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            id={id}
            style={{
              color: "red",
            }}
          >
            <DeleteOutlined />
          </a>
        ) : (
          <Button
            danger
            icon={customIcon ? customIcon : <DeleteOutlined />}
            disabled={isDisable ? true : false}
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            id={id}
          />
        )
      ) : (
        <div
          className={`${styles.delete} ${styles.action}`}
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          id={id}
        >
          {customIcon ? customIcon : <DeleteOutlined />}
        </div>
      )}
      <Modal
        open={showModal}
        onCancel={() => handleClose()}
        title={title}
        centered
        onOk={() => {
          form.submit();
        }}
        okText={
          okButtonText ||
          formatMessage({
            id: "generic.delete",
          })
        }
        okType="danger"
        cancelText={
          cancelButtonText ||
          formatMessage({
            id: "generic.cancel",
          })
        }
        closeIcon={<Icon icon={CancelIcon} />}
        className={styles.deleteModal}
        {...props}
      >
        {extra}
        <Form
          onFinish={async () => {
            await handleOk();
            handleClose();
          }}
          form={form}
        >
          <Form.Item
            name="text"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("text") !== deleteingKey) {
                    return Promise.reject(
                      new Error(
                        formatMessage(
                          {
                            id: "generic.deleteModal.placeholder",
                          },
                          { key: deleteingKey }
                        )
                      )
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              allowClear
              placeholder={formatMessage(
                {
                  id: "generic.deleteModal.required",
                },
                { key: deleteingKey }
              )}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DeleteModal;
