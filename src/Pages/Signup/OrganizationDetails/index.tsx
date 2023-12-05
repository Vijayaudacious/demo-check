import { Input } from "@/Components/InputField";
import SelectDialCode from "@/Components/SelectCountryInput/SelectDialCode";
import { VALIDATION_FORMATS } from "@/Constant";
import { OrganisationDetails } from "@/Types/Signup";
import { Button, Col, Form, Row } from "antd";
import { useIntl } from "react-intl";
import { HandleChnageStep } from "..";
import styles from "../styles.module.less";

const { GST_NO, PAN_NO, EMAIL } = VALIDATION_FORMATS;
interface OrganizationDetailsProps {
  handleChnageForm: HandleChnageStep;
  getOrganizationDetails: (data: OrganisationDetails) => void;
  initialValues?: OrganisationDetails;
}

const OrganizationDetails: React.FC<OrganizationDetailsProps> = ({
  handleChnageForm,
  getOrganizationDetails,
  initialValues,
}) => {
  const { formatMessage } = useIntl();

  const prefixSelector = (
    <Form.Item name={["prefix"]} noStyle>
      <SelectDialCode />
    </Form.Item>
  );
  return (
    <Form
      layout="vertical"
      onFinish={(data) => {
        getOrganizationDetails(data);
        handleChnageForm("personal");
      }}
      initialValues={initialValues}
    >
      <Row gutter={16}>
        <Col sm={12} xs={24}>
          <Form.Item
            label={formatMessage({ id: "signup.form.orgName.label" })}
            name={["name"]}
            rules={[
              {
                required: true,
                message: formatMessage({ id: "signup.form.orgName.required" }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: "signup.form.orgName.placeholder",
              })}
            />
          </Form.Item>
        </Col>
        <Col sm={12} xs={24}>
          <Form.Item
            label={formatMessage({ id: "signup.form.orgEmail.label" })}
            name={["email"]}
            rules={[
              {
                required: true,
                message: formatMessage({ id: "signup.form.orgEmail.required" }),
              },
              {
                pattern: new RegExp(EMAIL),
                message: formatMessage({
                  id: "signup.form.orgEmail.invalid",
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: "signup.form.orgEmail.placeholder",
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
            />
          </Form.Item>
        </Col>
        <Col sm={12} xs={24}>
          <Form.Item
            label="Password"
            name={["industryType"]}
            rules={[
              {
                required: true,
                message: "Please enter password",
              },
            ]}
          >
            <Input placeholder="Password" />
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
        <Button
          type="primary"
          className={styles.submitButton}
          htmlType="submit"
        >
          {formatMessage({ id: "signup.form.button.next" })}
        </Button>
      </Row>
    </Form>
  );
};

export default OrganizationDetails;
