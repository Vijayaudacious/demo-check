import DatePicker from "@/Components/DatePicker";
import { Input } from "@/Components/InputField";
import SelectRoles from "@/Components/SelectRoleInput";
import SelectUser from "@/Components/SelectUserInput";
import { DATE_FORMATS } from "@/Constant";
import { Col, Form, Row } from "antd";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import FormWrapper from "../FormWrapper";

const EmployeeDetails = () => {
  const { formatMessage } = useIntl();
  const { employeeId } = useParams();

  return (
    <FormWrapper
      nextStep={employeeId ? `/employees/${employeeId}/personal-details` : ""}
      showSkipButton={Boolean(employeeId)}
    >
      <Row gutter={16}>
        <Col lg={8} xs={24}>
          <Form.Item
            label={formatMessage({
              id: "employee.form.name.label",
            })}
            name="name"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: "employee.form.name.required",
                }),
              },
            ]}
          >
            <Input
              id="register_name"
              type="text"
              placeholder={formatMessage({
                id: "employee.form.name.placeholder",
              })}
            />
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            label={formatMessage({
              id: "employee.form.email.label",
            })}
            name="email"
            rules={[
              {
                type: "email",
                message: formatMessage({
                  id: "employee.form.email.required",
                }),
              },
              {
                required: true,
                message: formatMessage({
                  id: "employee.form.email.validmail",
                }),
              },
            ]}
          >
            <Input
              type="email"
              placeholder={formatMessage({
                id: "employee.form.email.placeholder",
              })}
              id="register_email"
            />
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            label={formatMessage({
              id: "employee.form.contactNumber.label",
            })}
            name="contactNumber"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: "employee.form.contactNumber.required",
                }),
              },
              {
                pattern: new RegExp(
                  /^(?:(?:\+|0{0,2},[a-zA-Z])91(\s*[\-]\s*)?)?[6789]\d{9}$/
                ),
                max: 10,
                message: formatMessage({
                  id: "employee.form.contactNumber.validnumber",
                }),
              },
            ]}
          >
            <Input
              type="number"
              placeholder={formatMessage({
                id: "employee.form.contactNumber.placeholder",
              })}
              id="register_number"
            />
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            name="employeeCode"
            label={formatMessage({
              id: "employee.form.employeeCode.label",
            })}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: "employee.form.employeeCode.required",
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: "employee.form.employeeCode.placeholder",
              })}
              id="employeeCode"
              type="number"
            />
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            label={formatMessage({
              id: "employee.form.roles.label",
            })}
            name="roles"
            rules={[
              {
                type: "array",
              },
            ]}
          >
            <SelectRoles id="register_roles" />
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            label={formatMessage({
              id: "employee.form.manager.label",
            })}
            name="manager"
          >
            <SelectUser id="manager_name" />
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            name="joiningDate"
            label={formatMessage({
              id: "employee.form.joiningDate.label",
            })}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: "employee.form.joiningDate.required",
                }),
              },
            ]}
          >
            <DatePicker
              id="register_joiningdate"
              placeholder={formatMessage({
                id: "employee.form.joiningDate.placeholder",
              })}
              format={DATE_FORMATS.DAY_MONTH_YEAR}
            />
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            label={formatMessage({
              id: "employee.form.allocatedLeaves.label",
            })}
            name="allocatedLeaves"
            rules={[
              {
                required: true,
                message: "Please fill leaves",
              },
            ]}
          >
            <Input
              type="number"
              id="register_leaves"
              placeholder={formatMessage({
                id: "employee.form.allocatedLeaves.label",
              })}
            />
          </Form.Item>
        </Col>
      </Row>
    </FormWrapper>
  );
};

export default EmployeeDetails;
