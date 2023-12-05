import { formatName } from "@/Components/Formats";
import { Input } from "@/Components/InputField";
import { useApproveRejectLeave, useRemoveLeaveMutation } from "@/Hooks/Leaves";
import { Button, Form, message } from "antd";
import get from "lodash/get";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles.module.less";
import Modal from "@/Components/Modal";

interface ActionProps {
  isModalVisible: boolean;
  handleClose: () => void;
  leaveEmployeeDetails: Record<string, string>;
}
const LeaveActionModal: React.FC<ActionProps> = ({
  isModalVisible,
  handleClose,
  leaveEmployeeDetails,
}) => {
  const [form] = Form.useForm();
  const [deleteForm] = Form.useForm();
  const { isLoading: isApproving, mutateAsync: leaveApproved } =
    useApproveRejectLeave();

  const { isLoading: isRejecting, mutateAsync: leaveRejected } =
    useApproveRejectLeave();
  const { mutateAsync: removeLeaveMutation, isLoading: isRemoving } =
    useRemoveLeaveMutation();
  const id = get(leaveEmployeeDetails, "requestedBy._id", "-");

  const reason = get(leaveEmployeeDetails, "reason", "-");
  const description = get(leaveEmployeeDetails, "description", "");
  const name = get(
    leaveEmployeeDetails,
    "requestedBy.name",
    "User has been deleted"
  );
  const employeeId = get(leaveEmployeeDetails, "_id");
  const employeeLeaveStatus = get(leaveEmployeeDetails, "status", "");

  const [isOpenRejectModal, setIsOpenRejectModal] = useState(false);
  const [isOpenRemoveModal, setIsOpenRemoveModal] = useState(false);

  const handleApproveLeave = async () => {
    try {
      await leaveApproved({
        employeeId: employeeId,
        data: {
          status: "approved",
          leaveStatusDescription: "",
        },
      });
      handleClose();
      message.success("Leave approved successfully");
    } catch (error: any) {
      message.error(error.message || "Unable to process");
    }
    form.resetFields();
  };

  const handleRejectLeave = async ({ description }: any) => {
    try {
      await leaveRejected({
        employeeId: employeeId,
        data: {
          status: "rejected",
          leaveStatusDescription: description,
        },
      });
      form.resetFields();
      setIsOpenRejectModal(false);
      handleClose();
      message.success("Leave rejected successfully");
    } catch (error: any) {
      message.error(error.message || "Unable to process");
    }
    form.resetFields();
  };

  const handleDeleteLeave = async () => {
    try {
      await removeLeaveMutation(employeeId);
      setIsOpenRemoveModal(false);
      handleClose();
      message.success("Leave deleted successfully");
    } catch (error: any) {
      message.error(error.message || "Unable to process");
    }
    deleteForm.resetFields();
  };
  return (
    <>
      <Modal
        title="Leave Action"
        centered
        onCancel={handleClose}
        open={isModalVisible}
        footer={[
          <Button
            id="leave_approve"
            type="primary"
            loading={isApproving}
            onClick={handleApproveLeave}
            key="1"
          >
            Approve
          </Button>,
          <Button
            type="primary"
            onClick={() => setIsOpenRejectModal(true)}
            loading={isRejecting}
            id="leave_reject"
            danger
            key="2"
          >
            Reject
          </Button>,
          <Button
            type="primary"
            onClick={() => setIsOpenRemoveModal(true)}
            loading={isRemoving}
            id="leave_delete"
            danger
            key="3"
          >
            Delete
          </Button>,
          <Button onClick={handleClose} id="leave_cancel" key="4">
            Cancel
          </Button>,
        ]}
      >
        <div className="my-5">
          Name:
          <Link to={`/employees/${id}/overview`} className={styles.nameLink}>
            <span className="mx-5">{name}</span>
          </Link>
        </div>
        <div className="my-5">
          Title: <span className="mx-5">{formatName(reason)}</span>
        </div>
        <div className="my-5">
          Description: <span className="mx-5">{formatName(description)}</span>
        </div>
      </Modal>
      <Modal
        title="Reason of reject leave"
        open={isOpenRejectModal}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsOpenRejectModal(false);
          form.resetFields();
        }}
        confirmLoading={isRejecting}
        okButtonProps={{ id: "ok" }}
        cancelButtonProps={{ id: "cancel" }}
      >
        <div>
          <Form form={form} onFinish={handleRejectLeave}>
            <Form.Item
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please enter reason of reject leave",
                },
              ]}
            >
              <Input type="textArea" id="reject_leave" rows={4} />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        title="Reason of delete leave"
        centered
        open={isOpenRemoveModal}
        onOk={() => deleteForm.submit()}
        onCancel={() => {
          setIsOpenRemoveModal(false);
          deleteForm.resetFields();
        }}
        confirmLoading={isRemoving}
      >
        <div>
          <Form form={deleteForm} onFinish={handleDeleteLeave}>
            <Form.Item
              name="reason"
              rules={[
                {
                  required: true,
                  message: "Please enter the reason of delete leave",
                },
              ]}
            >
              <Input type="textArea" id="delete_leave" rows={4} />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default LeaveActionModal;
