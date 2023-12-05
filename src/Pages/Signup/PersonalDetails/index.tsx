import Icon, { PrevArrowBlack } from "@/Assets/Images";
import DatePicker from "@/Components/DatePicker";
import { Input } from "@/Components/InputField";
import SelectDialCode from "@/Components/SelectCountryInput/SelectDialCode";
import { DATE_FORMATS, VALIDATION_FORMATS } from "@/Constant";
import { useSignupMutation } from "@/Hooks/auth";
import {
  OrganisationDetails,
  PersonalDetails as PersonalDetailsType,
} from "@/Types/Signup";
import { showErrorMessage } from "@/Utils/generic";
import { Alert, Button, Checkbox, Col, Form, Row, Tooltip } from "antd";
import classNames from "classnames";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import { HandleChnageStep } from "..";
import styles from "../styles.module.less";

const { YEAR_MONTH_DAY, DAY_MONTH_YEAR } = DATE_FORMATS;
const { EMAIL } = VALIDATION_FORMATS;

interface PersonalDetailsProps {
  handleChnageForm: HandleChnageStep;
  orgDetails: OrganisationDetails;
  handleSuccess: () => void;
  getPersonalDetails: (details: PersonalDetailsType) => void;
  initialValues?: PersonalDetailsType;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  handleChnageForm,
  orgDetails,
  handleSuccess,
  getPersonalDetails,
  initialValues,
}) => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const values = Form.useWatch([], form);

  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";
  const paramString = returnUrl.split("?")[1];
  const paramURL = new URLSearchParams(paramString);
  const planId = paramURL.get("plan");

  useEffect(() => {
    getPersonalDetails(values);
  }, [values]);

  const { mutateAsync: signupMutation, isLoading } = useSignupMutation();

  const getDetails = (details: Record<string, any>) => {
    const obj: any = {};
    Object.keys(details).forEach((key: string) => {
      const value = details[key];
      if (key === "dob") {
        obj[key] = dayjs(value).format(YEAR_MONTH_DAY);
      } else if (key === "terms" || key === "prefix") {
        return;
      } else if (key === "mobileNo") {
        obj[key] = details.prefix + value.number;
      } else {
        obj[key] = value;
      }
    });
    return obj;
  };

  const handleSubmit = async (personalDetails: PersonalDetailsType) => {
    try {
      await signupMutation({
        personalDetails: getDetails(personalDetails),
        organisationDetails: getDetails(orgDetails),
        planId: planId || "",
      });
      handleSuccess();
    } catch (error) {
      showErrorMessage(error, "response.data.message");
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <SelectDialCode />
    </Form.Item>
  );
  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
      form={form}
    >
      <Row gutter={16}>
        <Tooltip title={formatMessage({ id: "signup.alert.tooltip" })}>
          <Alert
            message={formatMessage({ id: "signup.alert.message" })}
            type="success"
            className={styles.alert}
          />
        </Tooltip>
        <Col sm={12} xs={24}>
          <Form.Item
            label={formatMessage({ id: "signup.form.name.label" })}
            name={["name"]}
            rules={[
              {
                required: true,
                message: formatMessage({ id: "signup.form.name.required" }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: "signup.form.name.placeholder",
              })}
            />
          </Form.Item>
        </Col>
        <Col sm={12} xs={24}>
          <Form.Item
            label={formatMessage({ id: "signup.form.email.label" })}
            name={["email"]}
            rules={[
              {
                required: true,
                message: formatMessage({ id: "signup.form.email.required" }),
              },
              {
                pattern: new RegExp(EMAIL),
                message: formatMessage({
                  id: "signup.form.email.invalid",
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: "signup.form.email.placeholder",
              })}
            />
          </Form.Item>
        </Col>
        <Col sm={12} xs={24}>
          <Form.Item
            label={formatMessage({ id: "signup.form.mobileNo.label" })}
            name={["mobileNo", "number"]}
            rules={[
              {
                required: true,
                message: formatMessage({ id: "signup.form.mobileNo.required" }),
              },
            ]}
            className={styles.mobileNumber}
          >
            <Input
              placeholder={formatMessage({
                id: "signup.form.mobileNo.placeholder",
              })}
              type="number"
              addonBefore={prefixSelector}
            />
          </Form.Item>
        </Col>
        <Col sm={12} xs={24}>
          <Form.Item
            label={formatMessage({ id: "signup.form.dob.label" })}
            name={["dob"]}
          >
            <DatePicker
              placeholder={formatMessage({ id: "signup.form.dob.placeholder" })}
              format={DAY_MONTH_YEAR}
              disabledDate={(d) =>
                !d ||
                d.isAfter(
                  dayjs().subtract(18, "year").format(YEAR_MONTH_DAY)
                ) ||
                d.isSame(dayjs().subtract(60, "year").format(YEAR_MONTH_DAY)) ||
                d.isBefore(dayjs().subtract(60, "year").format(YEAR_MONTH_DAY))
              }
            />
          </Form.Item>
        </Col>
        <Col sm={24} xs={24}>
          <Form.Item
            label={formatMessage({ id: "signup.form.streetAddress.label" })}
            name={["address", "streetAddress"]}
          >
            <Input
              placeholder={formatMessage({
                id: "signup.form.streetAddress.placeholder",
              })}
              type="textArea"
            />
          </Form.Item>
        </Col>
        <Col sm={12} xs={24}>
          <Form.Item
            label={formatMessage({ id: "signup.form.city.label" })}
            name={["address", "city"]}
          >
            <Input
              placeholder={formatMessage({
                id: "signup.form.city.placeholder",
              })}
            />
          </Form.Item>
        </Col>
        <Col sm={12} xs={24}>
          <Form.Item
            label={formatMessage({ id: "signup.form.state.label" })}
            name={["address", "state"]}
          >
            <Input
              placeholder={formatMessage({
                id: "signup.form.state.placeholder",
              })}
            />
          </Form.Item>
        </Col>
        <Col sm={12} xs={24}>
          <Form.Item
            label={formatMessage({ id: "signup.form.zipCode.label" })}
            name={["address", "zipCode"]}
          >
            <Input
              placeholder={formatMessage({
                id: "signup.form.zipCode.placeholder",
              })}
            />
          </Form.Item>
        </Col>
        <Col sm={24} xs={24}>
          <Form.Item
            name={["terms"]}
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          formatMessage({ id: "signup.form.terms.required" })
                        )
                      ),
              },
            ]}
          >
            <Checkbox>
              {formatMessage({ id: "signup.form.terms.label" })}
              <a
                href="https://www.zesthrm.com/terms/"
                target="_blank"
                className={styles.termsLink}
              >
                {formatMessage({ id: "signup.form.terms.link" })}
              </a>
            </Checkbox>
          </Form.Item>
        </Col>
        <Col sm={4} xs={4}>
          <Tooltip title={formatMessage({ id: "signup.form.button.previous" })}>
            <Button
              type="ghost"
              icon={<Icon icon={PrevArrowBlack} />}
              className={classNames(styles.submitButton, styles.prevButton)}
              onClick={() => handleChnageForm("organization")}
            />
          </Tooltip>
        </Col>
        <Col sm={20} xs={20}>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.submitButton}
            loading={isLoading}
            disabled={isLoading}
          >
            {formatMessage({ id: "signup.form.button.submit" })}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default PersonalDetails;
