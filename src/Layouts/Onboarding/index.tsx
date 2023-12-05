import logo from "@/Assets/Images/earning-icons.png";
import { Col, Image, Row } from "antd";
import { Outlet } from "react-router-dom";
import styles from "./styles.module.less";
import { useIntl } from "react-intl";
import React from "react";
import { Loader } from "@/Components/Loader";

const Onboarding = () => {
  const { formatMessage } = useIntl();

  return (
    <section className={styles.mainSection}>
      <div className={styles.containerSection}>
        <Row gutter={16} className={styles.rowSection}>
          <Col
            xs={24}
            sm={20}
            md={11}
            lg={10}
            xl={8}
            className={styles.centerSection}
          >
            <div className={styles.content}>
              <Image className={styles.logo} src={logo} preview={false} />
              <h2 className={styles.leftHeading}>
                <span className={styles.headingPara}>
                  "Welcome to POST EARN -
                </span>
              </h2>
              <h2>
                <p className={styles.content_para}>
                  Where your time is valued! Unlock earning opportunities by
                  engaging with <b>POST EARN</b>. Every interaction puts money
                  in your pocket. Join us in the journey of turning your time
                  online into real rewards. Login now and start earning!"
                </p>
              </h2>
            </div>
          </Col>
          <Col xs={24} sm={20} md={11} lg={10} xl={8}>
            <div className={styles.container}>
              <div className={styles.formContainer}>
                <React.Suspense
                  fallback={<Loader isLoading centered size="large" />}
                >
                  <Outlet />
                </React.Suspense>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Onboarding;
