import { ATTENDANCE_STATUS } from "@/Constant";
import { Row, Space } from "antd";
import Indicator from "./Indicators";

const { ABSENT, HALFDAY, HOLIDAY, PAIDLEAVE, PRESENT, WEEKOFF } =
  ATTENDANCE_STATUS;

const ListFooter = () => {
  return (
    <Row>
      <Indicator fullName="Present" sortName={PRESENT} />
      <Indicator fullName="Absent" sortName={ABSENT} />
      <Indicator fullName="Half day" sortName={HALFDAY} />
      <Indicator fullName="Week Off" sortName={WEEKOFF} />
      <Indicator fullName="Holiday" sortName={HOLIDAY} />
      <Indicator fullName="Paid Leave" sortName={PAIDLEAVE} />
    </Row>
  );
};

export default ListFooter;
