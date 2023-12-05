import { Col, Row } from "antd";
import ComingSoon from "@/Components/ComingSoon";
import styles from "./styles.module.less";

const Notification = () => {
  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  return (
    <>
      <Row gutter={32} className={styles.employeeDetailsection}>
        <Col xl={9} lg={8} xs={24}>
          {/*this code is on hold that's why commented here
          <div className={styles.mainSection}>
            <h2 className={styles.mainHeader}>Email Notification</h2>
            <div className={styles.detailBox}>
              <h3 className={styles.empDsc}>
                Email notifications:&nbsp;
                <Switch
                  defaultChecked
                  checkedChildren="OFF"
                  unCheckedChildren="ON"
                  onChange={onChange}
                />
              </h3>
          </div>
            </div> */}
          <ComingSoon />
        </Col>
      </Row>
    </>
  );
};

export default Notification;
