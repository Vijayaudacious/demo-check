import { LEAVE_STATUS } from "@/Constant";
import { Row } from "antd";
import Indicator from "./Indicator";

const { APPROVE, REJECT, WITHDRAWAl, PENDING } = LEAVE_STATUS;

const LeaveIndicators = () => {
  return (
    <Row>
      <Indicator fullName={"Reject"} sortName={REJECT} />
      <Indicator fullName={"Approve"} sortName={APPROVE} />
      <Indicator fullName={"Pending"} sortName={PENDING} />
      <Indicator fullName={"Withdrawal"} sortName={WITHDRAWAl} />
    </Row>
  );
};

export default LeaveIndicators;
