import { Input } from "@/Components/InputField";
import FormWrapper from "@/Pages/Employee/EmployeeForm/FormWrapper";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Col, Form, Row } from "antd";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import styles from "./styles.module.less";

const EducationalDetails = () => {
  const { employeeId } = useParams();
  const { formatMessage } = useIntl();

  return (
    <FormWrapper
      previousStep={`/employees/${employeeId}/employment-details`}
      nextStep={`/employees/${employeeId}/salary-details`}
      initialValues={{ educationDetails: [{}] }}
      showSkipButton
    >
      <Form.List name="educationDetails">
        {(fields, { add, remove }) => (
          <div>
            {fields.map(({ key, name }, index) => (
              <Row key={key} gutter={16}>
                <Col lg={7}>
                  <Form.Item
                    label={formatMessage({
                      id: "employee.form.education.institution.label",
                    })}
                    name={[name, "institutionName"]}
                  >
                    <Input
                      placeholder={formatMessage({
                        id: "employee.form.education.institution.placeholder",
                      })}
                    />
                  </Form.Item>
                </Col>
                <Col lg={7}>
                  <Form.Item
                    label={formatMessage({
                      id: "employee.form.education.course.label",
                    })}
                    name={[name, "courseName"]}
                  >
                    <Input
                      placeholder={formatMessage({
                        id: "employee.form.education.course.placeholder",
                      })}
                    />
                  </Form.Item>
                </Col>
                <Col lg={7}>
                  <Form.Item
                    label={formatMessage({
                      id: "employee.form.education.year.label",
                    })}
                    name={[name, "passingYear"]}
                  >
                    <Input
                      placeholder={formatMessage({
                        id: "employee.form.education.year.placeholder",
                      })}
                    />
                  </Form.Item>
                </Col>
                <Col lg={3} className={styles.buttonSection}>
                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      id={`remove_${index}`}
                      className={styles.removeIcon}
                    />
                  )}
                  {fields.length === index + 1 && (
                    <PlusCircleOutlined
                      onClick={() => add()}
                      className={styles.addIcon}
                      id={`add_${index}`}
                    />
                  )}
                </Col>
                <Col lg={7}>
                  <Form.Item
                    label={formatMessage({
                      id: "employee.form.education.specialization.label",
                    })}
                    name={[name, "specialization"]}
                  >
                    <Input
                      placeholder={formatMessage({
                        id: "employee.form.education.specialization.placeholder",
                      })}
                    />
                  </Form.Item>
                </Col>
                <Col lg={7}>
                  <Form.Item
                    label={formatMessage({
                      id: "employee.form.education.grade.label",
                    })}
                    name={[name, "grade"]}
                  >
                    <Input
                      placeholder={formatMessage({
                        id: "employee.form.education.grade.placeholder",
                      })}
                    />
                  </Form.Item>
                </Col>
              </Row>
            ))}
            <br />
          </div>
        )}
      </Form.List>
    </FormWrapper>
  );
};

export default EducationalDetails;
