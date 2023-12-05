import { SelectLanguageContext } from "@/App";
import { Input } from "@/Components/InputField";
import useIsLoggedIn from "@/Hooks/useIsLoggedIn";
import { login } from "@/Services/auth";
import { showErrorMessage } from "@/Utils/generic";
import { Button, Form } from "antd";
import { useContext, useEffect } from "react";
import { useIntl } from "react-intl";
import { useMutation } from "react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styles from "./styles.module.less";

const LoginPage = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();
  const [form] = Form.useForm();
  const { mutateAsync: loginMutation, isLoading } = useMutation(login);
  const { getShowTrialBoolean } = useContext(SelectLanguageContext);
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, []);

  const onFinish = async (values: any) => {
    try {
      const { data }: any = await loginMutation({
        email: values.email,
        password: values.password,
      });
      localStorage.setItem("authToken", data?.token);
      localStorage.setItem("userDetails", JSON.stringify(data?.details));
      if (data.firstLogin) {
        return navigate(
          `/reset-password/?previousPass=${encodeURIComponent(values.password)}`
        );
      }
      navigate(decodeURIComponent(returnUrl));
      getShowTrialBoolean(true);
    } catch (error) {
      showErrorMessage(error);
    }
  };

  return (
    <>
      <h2 className={styles.setPassTag}>
        {formatMessage({
          id: "login.form.title",
        })}
      </h2>
      <Form
        form={form}
        name="horizontal_login"
        onFinish={onFinish}
        className={styles.formLogines}
        layout="vertical"
      >
        <Form.Item
          label="Phone number"
          className={styles.forminner}
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter phone number",
            },
          ]}
        >
          <Input type="email" placeholder="Phone number" id="login_email" />
        </Form.Item>
        <Form.Item
          label={formatMessage({
            id: "login.form.password.label",
          })}
          name="password"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: "login.form.password.required",
              }),
            },
          ]}
        >
          <Input
            type="password"
            placeholder="Enter password"
            id="login_password"
          />
        </Form.Item>

        <Form.Item shouldUpdate>
          {() => (
            <Button
              type="primary"
              id="submit"
              htmlType="submit"
              loading={isLoading}
              className={styles.buttonBlue}
            >
              Login
            </Button>
          )}
        </Form.Item>
      </Form>
      <h3 className={styles.signupLink}>
        {formatMessage({
          id: "login.footer.text",
        })}
        <Link to={`/signup/?returnUrl=${encodeURIComponent(returnUrl)}`}>
          {formatMessage({
            id: "login.footer.link",
          })}
        </Link>
      </h3>
    </>
  );
};
export default LoginPage;
