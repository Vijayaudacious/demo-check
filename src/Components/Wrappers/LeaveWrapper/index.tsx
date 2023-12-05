import { Col, Radio, RadioChangeEvent, Row } from "antd";
import { Route } from "antd/lib/breadcrumb/Breadcrumb";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageLayoutWrapper from "../PageLayoutWrapper";
import styles from "./styles.module.less";

interface PageLayoutWrapperProps {
  breadcurmbs?: Route[];
  noBreadcrum?: boolean;
  isEmployeeDetails?: boolean;
}
const LeavesWrapper: React.FC<
  React.PropsWithChildren<PageLayoutWrapperProps>
> = ({ children, breadcurmbs, noBreadcrum, isEmployeeDetails }) => {
  const { pathname } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const onChangeToggle = ({ target: { value } }: RadioChangeEvent) => {
    navigate(`/leaves/${value}`);
  };
  const onEmployeeDetailsToggele = ({
    target: { value },
  }: RadioChangeEvent) => {
    if (value === "leaves") {
      navigate(`/employees/${id}/leaves`);
    } else {
      navigate(`/employees/${id}/leaves/${value}`);
    }
  };

  const pathArray = pathname.split("/");
  const activeKeyValue = pathArray[pathArray.length - 1];

  return (
    <PageLayoutWrapper breadcurmbs={breadcurmbs} noBreadcrum={noBreadcrum}>
      <div className={styles.mainSection}>
        <Row align="bottom">
          <Col lg={24} xs={24}>
            <Radio.Group
              onChange={
                isEmployeeDetails ? onEmployeeDetailsToggele : onChangeToggle
              }
              value={activeKeyValue}
              optionType="button"
              buttonStyle="solid"
              className={styles.toggleButton}
            >
              {isEmployeeDetails ? (
                <>
                  <Radio.Button value={"leaves"} id="calender_view">
                    Calender view
                  </Radio.Button>
                  <Radio.Button value={"list"} id="list_view">
                    List view
                  </Radio.Button>
                </>
              ) : (
                <>
                  <Radio.Button value={"calender"} id="calender_view">
                    Calender view
                  </Radio.Button>
                  <Radio.Button value={"list"} id="list_view">
                    List view
                  </Radio.Button>
                </>
              )}
            </Radio.Group>
          </Col>
        </Row>
        {children}
      </div>
    </PageLayoutWrapper>
  );
};

export default LeavesWrapper;
