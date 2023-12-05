import ShowAttendance from "@/Components/ShowAttendance";
import TimePicker from "@/Components/TimePicker";
import { ATTENDANCE_STATUS, BLANK_DAYS, DATE_FORMATS } from "@/Constant";
import { Col, Form, Row, Select, Tooltip } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.less";
import Modal from "@/Components/Modal";

const { ABSENT, HALFDAY, HOLIDAY, PAIDLEAVE, PRESENT, WEEKOFF } =
  ATTENDANCE_STATUS;
const { HOUR_MINUTE } = DATE_FORMATS;

interface UpdatedData {
  status: string;
  inTime?: string;
  outTime?: string;
  employeecode: string;
  uploadingIndex: number;
}
interface AttandanceStatusProps extends Required<UpdatedData> {
  onUpdate: (updatedData: UpdatedData) => void;
}

const AttandanceStatus: React.FC<AttandanceStatusProps> = ({
  status,
  inTime,
  outTime,
  onUpdate,
  employeecode,
  uploadingIndex,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState(status);
  const [form] = Form.useForm();
  useEffect(() => {
    if (status || inTime || outTime) {
      form.setFieldsValue({
        status,
        ...(!BLANK_DAYS.includes(inTime) && {
          inTime: dayjs(inTime, HOUR_MINUTE),
        }),
        ...(!BLANK_DAYS.includes(outTime) && {
          outTime: dayjs(outTime, HOUR_MINUTE),
        }),
      });
    }
  }, [status, inTime, outTime]);

  const handleSubmit = ({
    status,
    inTime,
    outTime,
  }: Required<Pick<UpdatedData, "status" | "inTime" | "outTime">>) => {
    onUpdate({
      status,
      ...(inTime && { inTime: dayjs(inTime).format(HOUR_MINUTE) }),
      ...(outTime && { outTime: dayjs(outTime).format(HOUR_MINUTE) }),
      employeecode,
      uploadingIndex,
    });
    setShowModal(false);
  };
  const shouldShowTime = [PRESENT, HALFDAY].includes(attendanceStatus);
  return (
    <>
      <Tooltip
        title={
          shouldShowTime && (
            <>
              In time- {inTime}
              <br />
              Out time- {outTime}
            </>
          )
        }
      >
        <div
          onClick={() => setShowModal(true)}
          className={styles.attendanceConatiner}
        >
          <ShowAttendance status={status} />
        </div>
      </Tooltip>
      <Modal
        title="Update Attendance Status"
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => form.submit()}
        centered
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmit}
          initialValues={{ inTime: "", outTime: "" }}
        >
          <Form.Item name="status" label="Attendance Status">
            <Select onChange={setAttendanceStatus}>
              <Select.Option value={PRESENT}>Present</Select.Option>
              <Select.Option value={HALFDAY}>Half Day</Select.Option>
              <Select.Option value={WEEKOFF}>Week Off</Select.Option>
              <Select.Option value={PAIDLEAVE}>Paid Leave</Select.Option>
              <Select.Option value={ABSENT}>Unpaid Leave</Select.Option>
              <Select.Option value={HOLIDAY}>Public Holiday</Select.Option>
            </Select>
          </Form.Item>
          {shouldShowTime && (
            <Row>
              <Col span={12}>
                <Form.Item
                  name="inTime"
                  label="In time"
                  rules={[
                    {
                      required: true,
                      message: "In time is required",
                    },
                  ]}
                >
                  <TimePicker format={HOUR_MINUTE} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="outTime"
                  label="Out time"
                  rules={[
                    {
                      required: true,
                      message: "Out time is required",
                    },
                  ]}
                >
                  <TimePicker format={HOUR_MINUTE} />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default AttandanceStatus;
