import { APPROVED } from "@/Constant";
import { useUpdateReportStatus } from "@/Hooks/report";
import { showErrorMessage } from "@/Utils/generic";
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Button, Form, Space, Tooltip, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import styles from "./styles.module.less";
import Modal from "@/Components/Modal";
import confirm from "antd/lib/modal/confirm";

interface StatusProps {
  reportId: string;
}
const UpdateStatus: React.FC<StatusProps> = ({ reportId }) => {
  const { isLoading: isUpdating, mutateAsync: updateReportStatusMutation } =
    useUpdateReportStatus();
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const updateReportStatus = async (status: "APPROVED") => {
    confirm({
      title: formatMessage({
        id: "reports.updateStatus.approve.title",
      }),
      centered: true,
      icon: <ExclamationCircleFilled />,
      okText: formatMessage({
        id: "generic.yes",
      }),
      cancelText: formatMessage({
        id: "generic.no",
      }),
      okButtonProps: {
        id: "yes",
      },
      cancelButtonProps: {
        id: "no",
      },
      onOk: async () => {
        try {
          await updateReportStatusMutation({ id: reportId, status });
          message.success(
            formatMessage({
              id: "reports.updateStatus.approve.success",
            })
          );
        } catch (error) {
          showErrorMessage(error);
        }
      },
    });
  };

  const onFinish = async (values: { describtion: string }) => {
    try {
      await updateReportStatusMutation({
        id: reportId,
        status: "REJECTED",
        reason: values.describtion,
      });
      message.success(
        formatMessage({
          id: "reports.updateStatus.reject.success",
        })
      );
    } catch (error) {
      showErrorMessage(error);
    }
    setIsModalVisible(false);
  };

  return (
    <div className={styles.container}>
      <Space size={"middle"}>
        <Tooltip
          title={formatMessage({
            id: "reports.updateStatus.approve.tooltip",
          })}
        >
          <Button
            loading={isUpdating}
            onClick={() => updateReportStatus(APPROVED)}
            id={`${reportId}_approve`}
            icon={<CheckOutlined />}
            className={styles.approve}
          />
        </Tooltip>
        <Tooltip
          title={formatMessage({
            id: "reports.updateStatus.reject.tooltip",
          })}
        >
          <Button
            onClick={() => setIsModalVisible(true)}
            loading={isUpdating}
            id={`${reportId}_reject`}
            icon={<CloseOutlined />}
            className={styles.reject}
          />
        </Tooltip>
      </Space>

      <Modal
        title={formatMessage({
          id: "reports.updateStatus.reject.title",
        })}
        className={styles.rejectModal}
        open={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        okButtonProps={{ loading: isUpdating }}
        centered
      >
        <Form
          form={form}
          name="register"
          id="reject_reason_describtion_form"
          onFinish={onFinish}
          initialValues={{ describtion: "" }}
        >
          <Form.Item
            name="describtion"
            rules={[
              {
                required: true,
                whitespace: true,
                message: formatMessage({
                  id: "reports.updateStatus.reject.reason",
                }),
              },
            ]}
          >
            <TextArea id="describtion" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateStatus;
