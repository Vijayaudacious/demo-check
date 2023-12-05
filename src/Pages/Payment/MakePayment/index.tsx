import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import Modal from "@/Components/Modal";

interface PaymentProps {
  isOpen: boolean;
  handeClose: () => void;
  sortUrl: string;
}
const MakePayment: React.FC<PaymentProps> = ({
  isOpen,
  handeClose,
  sortUrl,
}) => {
  return (
    <Modal
      centered
      open={isOpen}
      onCancel={handeClose}
      width={1100}
      footer={false}
      bodyStyle={{ minHeight: "700px", margin: "0px", padding: "0px" }}
      closable={true}
      maskClosable={false}
      closeIcon={
        <CloseOutlined
          style={{ color: "white", fontSize: "35px", margin: "20px 20px 0 0" }}
        />
      }
    >
      <iframe src={sortUrl} style={{ height: "700px" }} width={"100%"} />
    </Modal>
  );
};

export default MakePayment;
