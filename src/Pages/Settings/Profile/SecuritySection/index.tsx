import { Button, Col, Form, Row, message } from "antd";
import { useChangePassword } from "@/Hooks";
import styles from "./styles.module.less";
import { useNavigate } from "react-router-dom";
import { Input } from "@/Components/InputField";
import SettingDetailsWrapper from "@/Components/Wrappers/SettingWrapper";
import { useIntl } from "react-intl";

const SecurityChangePassword = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { mutateAsync: chanagePassword, isLoading } = useChangePassword();

  const onFinish = async (data: any) => {
    try {
      await chanagePassword(data);
      message.success(
        formatMessage({
          id: "settings.security.message.updated",
        })
      );
      navigate("/login");
    } catch (error: any) {
      message.error(error?.response.data.message);
    }
  };

  return (
    <SettingDetailsWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.settings",
          }),
          path: "/settings/profile",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.security",
          }),
          path: "/settings/security",
        },
      ]}
    >
      <Row className={styles.passwordContainer}>
        <Col xxl={18} xl={20} xs={24}>
          <Form
            layout="vertical"
            name="changePassword"
            onFinish={onFinish}
            className={styles.formLogines}
          >
            <Form.Item
              name="oldPassword"
              label={formatMessage({
                id: "settings.security.form.currentPassword.label",
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "settings.security.form.currentPassword.required",
                  }),
                },
              ]}
            >
              <Input
                type="password"
                id="current_password"
                placeholder={formatMessage({
                  id: "settings.security.form.currentPassword.placeholder",
                })}
              />
            </Form.Item>
            <div className={styles.fields}>
              <Form.Item
                label={formatMessage({
                  id: "settings.security.form.newPassword.label",
                })}
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: "settings.security.form.newPassword.required",
                    }),
                  },
                  {
                    min: 8,
                    pattern: new RegExp(
                      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$"
                    ),
                    message: formatMessage({
                      id: "settings.security.form.newPassword.message",
                    }),
                  },
                ]}
              >
                <Input
                  type="password"
                  id="new_password"
                  placeholder={formatMessage({
                    id: "settings.security.form.newPassword.placeholder",
                  })}
                />
              </Form.Item>
            </div>
            <div className={styles.fields}>
              <Form.Item
                label={formatMessage({
                  id: "settings.security.form.confirmNewPassword.label",
                })}
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: "settings.security.form.confirmNewPassword.required",
                    }),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          formatMessage({
                            id: "settings.security.form.confirmNewPassword.message",
                          })
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input
                  type="password"
                  placeholder={formatMessage({
                    id: "settings.security.form.confirmNewPassword.placeholder",
                  })}
                  id="confirm_new_password"
                />
              </Form.Item>
            </div>
            <Form.Item>
              <div className={styles.buttonGroup}>
                <Button
                  type="primary"
                  htmlType="submit"
                  id="save"
                  className={styles.submitButton}
                  loading={isLoading}
                >
                  {formatMessage({ id: "generic.save" })}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </SettingDetailsWrapper>
  );
};

export default SecurityChangePassword;
