import DatePicker from "@/Components/DatePicker";
import { Input } from "@/Components/InputField";
import { DATE_FORMATS } from "@/Constant";
import { EmployeeDetailsContext } from "@/Layouts/AddEmployeeLayout";
import FormWrapper from "@/Pages/Employee/EmployeeForm/FormWrapper";
import { Checkbox, Col, Form, Row } from "antd";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

const { YEAR_MONTH_DAY } = DATE_FORMATS;

const PersonalDetails = () => {
  const { formatMessage } = useIntl();
  const { employeeId } = useParams();
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const details = useContext(EmployeeDetailsContext);
  const [form] = Form.useForm();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const localAddress = form.getFieldValue("localAddress");
      const permanentAddress = form.getFieldValue("permanentAddress");
      if (localAddress && permanentAddress) {
        setIsCheckboxChecked(localAddress === permanentAddress);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [form]);

  const setInitialValues = () => {
    if (!details) {
      return;
    }
    if (employeeId && details) {
      const {
        fatherName,
        panCard,
        gender,
        dob,
        maritialStatus,
        localAddress,
        permanentAddress,
      } = details;
      form.setFieldsValue({
        gender,
        dob: dob ? dayjs(dob) : undefined,
        fatherName,
        localAddress,
        permanentAddress,
        maritialStatus,
        panCard,
      });
    }
  };

  useEffect(() => {
    setInitialValues();
  }, [employeeId, details]);

  return (
    <FormWrapper
      form={form}
      previousStep={`/employees/${employeeId}/employee-details`}
      nextStep={`/employees/${employeeId}/employment-details`}
      showSkipButton
    >
      <Row gutter={16}>
        <Col lg={8} xs={24}>
          <Form.Item
            label={formatMessage({
              id: "employee.form.fatherName.label",
            })}
            name="fatherName"
          >
            <Input
              id="register_father_name"
              type="text"
              placeholder={formatMessage({
                id: "employee.form.fatherName.placeholder",
              })}
            />
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            label={formatMessage({
              id: "employee.form.panCard.label",
            })}
            name="panCard"
          >
            <Input
              placeholder={formatMessage({
                id: "employee.form.panCard.placeholder",
              })}
              id="pan_card"
            />
          </Form.Item>
        </Col>

        <Col lg={8} xs={24}>
          <Form.Item
            name="gender"
            label={formatMessage({
              id: "employee.form.gender.label",
            })}
          >
            <Input
              type="select"
              placeholder={formatMessage({
                id: "employee.form.gender.placeholder",
              })}
              id="register_gender"
              options={[
                {
                  label: formatMessage({
                    id: "employee.form.gender.options.male",
                  }),
                  value: "male",
                },
                {
                  label: formatMessage({
                    id: "employee.form.gender.options.female",
                  }),
                  value: "female",
                },
                {
                  label: formatMessage({
                    id: "employee.form.gender.options.other",
                  }),
                  value: "other",
                },
              ]}
            />
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            name="dob"
            label={formatMessage({
              id: "employee.form.dob.label",
            })}
          >
            <DatePicker
              id="register_dob"
              placeholder={formatMessage({
                id: "employee.form.dob.placeholder",
              })}
              format="DD-MM-YYYY"
              disabledDate={(d) =>
                !d ||
                d.isAfter(
                  dayjs().subtract(18, "year").format(YEAR_MONTH_DAY)
                ) ||
                d.isSame(dayjs().subtract(60, "year").format(YEAR_MONTH_DAY)) ||
                d.isBefore(dayjs().subtract(60, "year").format(YEAR_MONTH_DAY))
              }
              defaultPickerValue={dayjs().subtract(18, "years")}
            />
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            name="maritialStatus"
            label={formatMessage({
              id: "employee.form.maritialStatus.label",
            })}
          >
            <Input
              type="select"
              id="marital_status"
              placeholder={formatMessage({
                id: "employee.form.maritialStatus.placeholder",
              })}
              options={[
                {
                  label: formatMessage({
                    id: "employee.form.maritialStatus.options.unmarried",
                  }),
                  value: "unmarried",
                },
                {
                  label: formatMessage({
                    id: "employee.form.maritialStatus.options.married",
                  }),
                  value: "married",
                },
              ]}
            />
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            label={formatMessage({
              id: "employee.form.localAddress.label",
            })}
            name="localAddress"
          >
            <Input
              type="textArea"
              id="local_address"
              placeholder={formatMessage({
                id: "employee.form.localAddress.placeholder",
              })}
              onChange={() => setIsCheckboxChecked(false)}
            />
          </Form.Item>
        </Col>
        <Col lg={8} xs={24}>
          <Form.Item
            label={
              <span>
                <Checkbox
                  id="address_checkbox"
                  checked={isCheckboxChecked}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsCheckboxChecked(checked);

                    if (checked) {
                      const localAddress = form.getFieldValue("localAddress");
                      form.setFieldsValue({
                        permanentAddress: localAddress,
                      });
                    }
                  }}
                >
                  {formatMessage({
                    id: "employee.form.permanentAddress.label",
                  })}
                </Checkbox>
              </span>
            }
            name="permanentAddress"
          >
            <Input
              type="textArea"
              id="permanent_address"
              placeholder={formatMessage({
                id: "employee.form.permanentAddress.placeholder",
              })}
              onChange={() => setIsCheckboxChecked(false)}
            />
          </Form.Item>
        </Col>
      </Row>
    </FormWrapper>
  );
};

export default PersonalDetails;
