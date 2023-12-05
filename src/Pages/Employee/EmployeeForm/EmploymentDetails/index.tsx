import DatePicker from "@/Components/DatePicker";
import { Input } from "@/Components/InputField";
import FormWrapper from "@/Pages/Employee/EmployeeForm/FormWrapper";
import { Col, Form, Row } from "antd";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

const EmploymentDetails = () => {
  const { formatMessage } = useIntl();
  const { employeeId } = useParams();

  return (
    <FormWrapper
      previousStep={`/employees/${employeeId}/personal-details`}
      nextStep={`/employees/${employeeId}/educational-details`}
      showSkipButton
    >
      <Row gutter={16}>
        <Col lg={8} xs={24}>
          <Form.Item
            label={formatMessage({
              id: "employee.form.previousOrg.name.label",
            })}
            name={["previousOrgDetails", "name"]}
          >
            <Input
              id="previous_org_name"
              type="text"
              placeholder={formatMessage({
                id: "employee.form.previousOrg.name.placeholder",
              })}
            />
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            label={formatMessage({
              id: "employee.form.previousOrg.startDate.label",
            })}
            name={["previousOrgDetails", "startDate"]}
          >
            <DatePicker
              id="start_date"
              placeholder={formatMessage({
                id: "employee.form.previousOrg.startDate.placeholder",
              })}
            />
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            label={formatMessage({
              id: "employee.form.previousOrg.endDate.label",
            })}
            name={["previousOrgDetails", "endDate"]}
          >
            <DatePicker
              id="end_date"
              placeholder={formatMessage({
                id: "employee.form.previousOrg.endDate.placeholder",
              })}
            />
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            label={formatMessage({
              id: "employee.form.previousOrg.salary.label",
            })}
            name={["previousOrgDetails", "salary"]}
          >
            <Input
              id="last_withdrawn_salary"
              type="number"
              placeholder={formatMessage({
                id: "employee.form.previousOrg.salary.placeholder",
              })}
            />
          </Form.Item>
        </Col>
      </Row>
    </FormWrapper>
  );
};

export default EmploymentDetails;
