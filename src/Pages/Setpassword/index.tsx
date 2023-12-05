import { Input } from "@/Components/InputField";
import { Button, Form, message } from "antd";
import { useMutation } from "react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "@/Assets/Images/zestlogo_.png";
import { regeneratePassword } from "@/Services/auth";
import styles from "../Setpassword/styles.module.less";
import { useIntl } from "react-intl";
import { useChangePassword } from "@/Hooks";

const SetPassword = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const previousPass = searchParams.get("previousPass") || "";

  const id: string | null = searchParams.get("id");
  const token: string | null = searchParams.get("token");
  const { formatMessage } = useIntl();
  const { mutateAsync: regenerateMutation, isLoading: isRegenerating } =
    useMutation(regeneratePassword);
  const { mutateAsync: chanagePassword, isLoading } = useChangePassword();

  const onFinish = async (values: any) => {
    try {
      if (previousPass) {
        const data = {
          ...values,
          oldPassword: decodeURIComponent(previousPass),
        };
        await chanagePassword(data);
        message.success(
          formatMessage({
            id: "resetPassword.message.success",
          })
        );
      } else {
        const { newPassword, confirmPassword } = values;
        await regenerateMutation({
          newPassword,
          confirmPassword,
          id,
          token,
        });
        message.success(
          formatMessage({
            id: "resetPassword.message.success",
          })
        );
      }
      navigate("/login");
    } catch (error: any) {
      message.error(
        formatMessage({
          id: "resetPassword.message.error",
        })
      );
    }
  };
  return (
    <>
      <div>
        <h1 className={styles.setPassTag}>
          {formatMessage({
            id: "resetPassword.form.title",
          })}
        </h1>
      </div>
      <Form
        form={form}
        name="horizontal_login"
        className={styles.formLogines}
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label={formatMessage({
            id: "resetPassword.form.lable.password",
          })}
          name="newPassword"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: "resetPassword.message.newPassword",
              }),
            },
            {
              min: 8,
              pattern: new RegExp(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$"
              ),
              message: formatMessage({
                id: "resetPassword.message.minPassword",
              }),
            },
          ]}
        >
          <Input
            type="password"
            placeholder={formatMessage({
              id: "resetPassword.form.placeholder.newPassword",
            })}
            id="login_password"
          />
        </Form.Item>

        <Form.Item
          label={formatMessage({
            id: "resetPassword.form.lable.confirmPassword",
          })}
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: "resetPassword.message.confirmPassword",
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
                      id: "resetPassword.message.reject",
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
              id: "resetPassword.form.placeholder.confirmPassword",
            })}
            id="login_password"
            className={styles.loginInput}
          />
        </Form.Item>

        <Form.Item shouldUpdate>
          {() => (
            <Button
              block
              id="submit"
              htmlType="submit"
              type="primary"
              className={styles.buttonBlue}
              loading={isLoading || isRegenerating}
            >
              {formatMessage({
                id: "resetPassword.form.button",
              })}
            </Button>
          )}
        </Form.Item>
      </Form>
    </>
  );
};
export default SetPassword;
