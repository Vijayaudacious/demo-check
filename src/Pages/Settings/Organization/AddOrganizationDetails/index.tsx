import { Input } from "@/Components/InputField";
import OrganizationWrapper from "@/Components/Wrappers/OrganizationWrapper";
import {
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
} from "@/Hooks/organization";
import { organisationDetail } from "@/Services/Organization";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Row, Upload, message } from "antd";
import get from "lodash/get";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.less";

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
    },
  },
};

const AddOrganizationDetails = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { organizationId } = useParams();
  const [fileList, setFileList] = useState([] as any);
  const logoBaseURL = process.env.REACT_APP_BASE_API || "";
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const { isLoading: isCreating, mutateAsync: CreateOrganizationMutation } =
    useCreateOrganizationMutation();

  const { isLoading: isUpdating, mutateAsync: updateOrganizationMutation } =
    useUpdateOrganizationMutation();

  const { isLoading, data } = useQuery(
    "organization-detail",
    organisationDetail,
    {
      enabled: Boolean(organizationId),
      refetchOnWindowFocus: false,
    }
  );
  const organizationData = get(data, "data", " ");

  useEffect(() => {
    if (organizationId && data) {
      Object.keys(organizationData).forEach((key) => {
        const value = organizationData[key];
        form.setFieldsValue({
          [key]: value,
        });
      });
    }
  }, [organizationId, data]);

  const handleFinish = async (values: any) => {
    const fd: any = new FormData();
    Object.keys(values)?.forEach((key) => {
      const value = values[key];
      if (key === "organizationLogo") {
        fileList[0]?.originFileObj
          ? fd.append("organizationLogo", fileList[0]?.originFileObj)
          : fd.append(
              "organizationLogo",
              organizationData.organizationLogo
                ? organizationData.organizationLogo
                : ""
            );
      } else {
        value && fd.append(key, value);
      }
    });

    try {
      if (organizationId) {
        await updateOrganizationMutation(fd);
        message.success("Updated successfully");
      } else {
        await CreateOrganizationMutation(fd);
        message.success("Created successfully");
      }
      navigate("/settings/organization");
    } catch (error: any) {
      message.error(
        error.response.data.message || "Unable to process. Please try again."
      );
    }
  };

  const onUploadChange = (info: any) => {
    setFileList([...info.fileList]);
  };

  useEffect(() => {
    if (organizationData.organizationLogo) {
      setFileList([
        {
          uid: "1",
          name: organizationData.organizationLogo.slice(
            organizationData.organizationLogo.lastIndexOf("_") + 1
          ),
          status: "done",
          url: `${logoBaseURL}${organizationData.organizationLogo}`,
        },
      ]);
    }
  }, [organizationData.organizationLogo]);

  const uploadProps = useMemo(
    () => ({
      accept: ".doc, .pdf, .jpg, .jpeg, .png",
      beforeUpload: (file: any) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error(`Image must smaller than 2MB!`, 10);
          return false;
        }
        return false;
      },
    }),
    [fileList]
  );

  useEffect(() => {
    const registeredAddress = form.getFieldValue("registeredAddress");
    const businessLocation = form.getFieldValue("BuisnessLocation");
    if (registeredAddress && businessLocation) {
      setIsCheckboxChecked(registeredAddress === businessLocation);
    }
  }, [form]);

  return (
    <OrganizationWrapper
      breadcurmbs={[
        { breadcrumbName: "Settings", path: "/settings/employee" },
        {
          breadcrumbName: "Organization",
          path: `/settings/organization`,
        },
        ...(organizationId
          ? [
              {
                breadcrumbName: "Update",
                path: `/organizations/${organizationId}/update`,
              },
            ]
          : []),
        ...(!organizationId
          ? [{ breadcrumbName: "New", path: "/organizations/new" }]
          : []),
      ]}
    >
      <Col flex="auto" className={styles.addOrganizationSection}>
        <div className={styles.innerSection}>
          <div className={styles.sectionInner}>
            <Form
              form={form}
              name="Organization"
              id="Organization_form"
              onFinish={handleFinish}
              className={styles.loginForm}
              layout="vertical"
              scrollToFirstError
            >
              <Row gutter={16}>
                <Col lg={12} xs={24}>
                  <Form.Item
                    className="w-100"
                    name="organizationName"
                    label="Organization Name"
                    rules={[
                      { required: true, message: "Please enter name" },
                      {
                        whitespace: true,
                        message: "Please enter name",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      id="organization_name"
                      placeholder="Enter name"
                    />
                  </Form.Item>
                </Col>
                <Col lg={12} xs={24}>
                  <Form.Item
                    label="Prefix ID"
                    name="companyPrefix"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please enter Prefix ID",
                      },
                    ]}
                  >
                    <Input id="company_prefix" placeholder="Enter employe Id" />
                  </Form.Item>
                </Col>
                <Col lg={12} xs={24}>
                  <Form.Item
                    label="Organization Email"
                    name="organizationEmail"
                    rules={[
                      {
                        type: "email",
                        message: "Please enter valid email address",
                      },
                      {
                        required: true,
                        message: "Please enter email address",
                      },
                    ]}
                  >
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      id="email"
                    />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={24}>
                  <Form.Item
                    label="Organization Mobile"
                    name="mobileNo"
                    rules={[
                      {
                        required: true,
                        message: "Please enter mobile number",
                      },
                      {
                        pattern: new RegExp(
                          /^(?:(?:\+|0{0,2},[a-zA-Z])91(\s*[\-]\s*)?)?[6789]\d{9}$/
                        ),
                        max: 10,
                        message: "Please enter valid mobile number",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter mobile number"
                      type="number"
                      id="mobile_number"
                    />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={24}>
                  <Form.Item
                    label="Organization Landline"
                    name="LandlineNo"
                    rules={[
                      {
                        required: true,
                        message: "Please enter landline number",
                      },
                      {
                        whitespace: true,
                        message: "Please enter landline number",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      id="Landline_number"
                      placeholder="Enter landline number"
                    />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={24}>
                  <Form.Item
                    label="Industry"
                    name="industryType"
                    rules={[
                      {
                        required: true,
                        message: "Please enter industry type",
                      },
                      {
                        whitespace: true,
                        message: "Please enter industry type",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      id="industry_type"
                      placeholder="Enter industry type"
                    />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={24}>
                  <Form.Item name="GST_No" label="GSTIN (GST Number)">
                    <Input type="text" placeholder="Enter GSTIN" />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={24}>
                  <Form.Item
                    name="PAN_No"
                    label="PAN Number"
                    rules={[
                      {
                        required: true,
                        message: "Please enter PAN number",
                      },
                      {
                        whitespace: true,
                        message: "Please enter PAN number",
                      },
                    ]}
                  >
                    <Input
                      type="text"
                      id="pan_number"
                      placeholder="Enter PAN number"
                    />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={24}>
                  <Form.Item name="Tax_Deduction_No" label="TAN Number">
                    <Input
                      type="text"
                      id="tan_number"
                      placeholder="Enter TAN number"
                    />
                  </Form.Item>
                </Col>
                <Col lg={12} xs={24}>
                  <Form.Item
                    label="Registered Address"
                    name="registeredAddress"
                    rules={[
                      {
                        required: true,
                        message: "Please enter registered address",
                      },
                      {
                        whitespace: true,
                        message: "Please enter registered address",
                      },
                    ]}
                  >
                    <Input
                      type="textArea"
                      placeholder="Enter registered address"
                      onChange={() => setIsCheckboxChecked(false)}
                      id="registered_address"
                    />
                  </Form.Item>
                </Col>

                <Col lg={12} xs={24}>
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
                              const registeredAddress =
                                form.getFieldValue("registeredAddress");
                              form.setFieldsValue({
                                BuisnessLocation: registeredAddress,
                              });
                            }
                          }}
                        >
                          Business Location (Same as Registered Address)
                        </Checkbox>
                      </span>
                    }
                    name="BuisnessLocation"
                    rules={[
                      {
                        required: true,
                        message: "Please enter business location",
                      },
                      {
                        whitespace: true,
                        message: "Please enter business location",
                      },
                    ]}
                  >
                    <Input
                      type="textArea"
                      placeholder="Enter business location"
                      onChange={() => setIsCheckboxChecked(false)}
                      id="buisness_location"
                    />
                  </Form.Item>
                </Col>

                <Col lg={6} xs={24}>
                  <Form.Item name="organizationLogo" label="Organization Logo">
                    <Upload
                      className="upload-list-inline"
                      listType="picture"
                      maxCount={1}
                      fileList={fileList}
                      {...uploadProps}
                      onChange={onUploadChange}
                      id="profile_upload"
                    >
                      <Button
                        icon={<UploadOutlined />}
                        id="profile_upload_button"
                      >
                        Upload
                      </Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col lg={24} xs={24}>
                  <Form.Item {...tailFormItemLayout}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      id="save"
                      className={`${styles.buttonBlue} ${styles.buttonAdd}`}
                      loading={isCreating || isUpdating}
                    >
                      Save
                    </Button>
                    <Link to={"/settings/organization"}>
                      <Button
                        type="default"
                        htmlType="reset"
                        id="cancel"
                        className={styles.cancelBtn}
                      >
                        Cancel
                      </Button>
                    </Link>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Col>
    </OrganizationWrapper>
  );
};

export default AddOrganizationDetails;
