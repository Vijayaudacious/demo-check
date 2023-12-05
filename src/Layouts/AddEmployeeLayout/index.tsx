import { Loader } from "@/Components/Loader";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { useUser } from "@/Hooks/emloyee";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import { isUUID } from "@/Utils/generic";
import { Col, Row, Steps } from "antd";
import get from "lodash/get";
import React, { createContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.less";

export const EmployeeDetailsContext = createContext<Record<string, any>>({});

const AddEmployeeLayout = () => {
  const { employeeId } = useParams();
  const { pathname } = useLocation();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { isMobile } = useWindowDimensions();
  const [activeStep, setActiveStep] = useState(0);
  const { data: employeeeResponse } = useUser(employeeId || "");
  const details = get(employeeeResponse, "data.data", {});
  useEffect(() => {
    if (employeeId && !isUUID(employeeId)) {
      navigate("/employees");
    }
  }, [employeeId]);

  const getActiveStep = (pathname: string) => {
    if (pathname.includes("/personal-details")) {
      return 1;
    } else if (pathname.includes("/employment-details")) {
      return 2;
    } else if (pathname.includes("/educational-details")) {
      return 3;
    }else if (pathname.includes("/salary-details")) {
      return 4;
    } else if (pathname.includes("/documents")) {
      return 5;
    }
    return 0;
  };

  useEffect(() => {
    setActiveStep(getActiveStep(pathname));
  }, [pathname]);

  return (
    <PageLayoutWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({ id: "breadcrumbs.employees" }),
          path: "/employees",
        },
        ...(!employeeId
          ? [
              {
                breadcrumbName: formatMessage({ id: "breadcrumbs.new" }),
                path: "/employees/new/employee-details",
              },
            ]
          : []),
        ...(employeeId && details.name
          ? [
              {
                breadcrumbName: details.name,
                path: `/employees/${employeeId}/overview`,
              },
            ]
          : []),
      ]}
    >
      <Row>
        <Col lg={4} sm={24}>
          <Steps
            direction={!isMobile ? "vertical" : "horizontal"}
            current={activeStep}
            className={styles.steps}
            items={[
              {
                title: formatMessage({
                  id: "employee.steps.employeeDetails.title",
                }),
                description: formatMessage({
                  id: "employee.steps.employeeDetails.description",
                }),
              },
              {
                title: formatMessage({
                  id: "employee.steps.personalDetails.title",
                }),
                description: formatMessage({
                  id: "employee.steps.personalDetails.description",
                }),
              },
              {
                title: formatMessage({
                  id: "employee.steps.employeementDetails.title",
                }),
                description: formatMessage({
                  id: "employee.steps.employeementDetails.description",
                }),
              },
              {
                title: formatMessage({
                  id: "employee.steps.educationDetails.title",
                }),
                description: formatMessage({
                  id: "employee.steps.educationDetails.description",
                }),
              },
              {
                title: formatMessage({
                  id: "employee.steps.salary.title",
                }),
                description: formatMessage({
                  id: "employee.steps.salary.description",
                }),
              },
              {
                title: formatMessage({
                  id: "employee.steps.documents.title",
                }),
                description: formatMessage({
                  id: "employee.steps.documents.description",
                }),
              },
            ]}
          />
        </Col>
        <Col lg={20} sm={24}>
          <EmployeeDetailsContext.Provider value={details}>
              <React.Suspense fallback={<Loader isLoading />}>
                <Outlet />
              </React.Suspense>
          </EmployeeDetailsContext.Provider>
        </Col>
      </Row>
    </PageLayoutWrapper>
  );
};

export default AddEmployeeLayout;
