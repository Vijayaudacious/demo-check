import { Input } from "@/Components/InputField";
import {
  useAllActions,
  useCreateRoleMutation,
  useRole,
  useUpdateRoleMutation,
} from "@/Hooks/Roles";
import { titleCase } from "@/Utils/generic";
import {
  Button,
  Checkbox,
  Col,
  Form,
  PageHeader,
  Skeleton,
  Typography,
  message,
} from "antd";
import trim from "lodash/trim";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.less";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import classNames from "classnames";
import { snakeCase } from "lodash";

const AddRole = () => {
  const navigate = useNavigate();
  const { id }: any = useParams();
  const [allSelect, setAllSelect] = useState(false);

  const { isLoading: isLoadingActions, data: actions } = useAllActions();
  const { isLoading: isLoadingDetails, data: roleDetails } = useRole(id);
  const { mutateAsync: addRoleMutation, isLoading: loading } =
    useCreateRoleMutation();
  const { mutateAsync: editRoleMutation, isLoading: loadingUpdate } =
    useUpdateRoleMutation();

  const [form] = Form.useForm();

  useEffect(() => {
    if (!roleDetails || !roleDetails?.data) {
      return;
    }

    form.setFieldsValue({
      name: roleDetails.data.name,
      description: roleDetails.data.description,
      permission: roleDetails.data.permission,
    });
  }, [form, roleDetails]);

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
    },
  };

  const onFinish = async (values: any) => {
    try {
      if (!id) {
        await addRoleMutation(values);
        message.success("Role added successfully");
      } else {
        const { data }: any = await editRoleMutation({ id, formData: values });
        message.success(data.message);
      }
      navigate("/roles");
    } catch (error: any) {
      message.error(error.response.data.message || "Unable to process");
    }
  };
  const handleAllSelect = (e: CheckboxChangeEvent) => {
    setAllSelect(e.target.checked);
    const setAllPermission: Record<string, string[]> = {};
    if (actions) {
      Object.keys(actions || {}).forEach((action) => {
        setAllPermission[action] = e.target.checked
          ? Object.keys(actions[action])
          : [];
      });
      form.setFieldsValue({
        permission: setAllPermission,
      });
    }
  };
  return (
    <PageLayoutWrapper
      breadcurmbs={[
        { breadcrumbName: "Roles", path: "/roles" },
        id
          ? { breadcrumbName: "Update", path: `/roles/${id}/update` }
          : { breadcrumbName: "/New", path: "/roles/new" },
      ]}
    >
      <Skeleton loading={isLoadingDetails}>
        <Col flex="auto" className={styles.mainSection}>
          <PageHeader ghost={false} title={id ? "Update roles" : "New Role"} />
          <div className={styles.mainSection}>
            <Form
              form={form}
              name="register"
              id="role_register"
              onFinish={onFinish}
              layout="vertical"
              className={styles.loginForm}
              scrollToFirstError
            >
              <Form.Item
                label="Role name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter the role name",
                    transform(value) {
                      return trim(value);
                    },
                  },
                ]}
              >
                <Input
                  placeholder="Enter role name"
                  id="role_name"
                  maxLength={25}
                />
              </Form.Item>
              <Form.Item
                label="Description (max 200 characters)"
                name="description"
                className={styles.labelText}
                rules={[
                  {
                    required: true,
                    message: "Please enter the description",
                    transform(value) {
                      return trim(value);
                    },
                  },
                ]}
              >
                <Input
                  type="textArea"
                  placeholder=" Enter description"
                  id="role_description"
                  maxLength={200}
                />
              </Form.Item>

              <Typography.Title level={3}>Permissions</Typography.Title>

              <Form.Item
                label={
                  <Typography.Title level={5}>
                    {titleCase("All")}
                  </Typography.Title>
                }
                key={"all"}
                name={"allSelect"}
              >
                <Checkbox
                  onChange={handleAllSelect}
                  checked={allSelect}
                  id="select_all"
                >
                  Select All
                </Checkbox>
              </Form.Item>
              <Skeleton loading={isLoadingActions}>
                {actions &&
                  Object.keys(actions).map((action: string) => (
                    <Form.Item
                      label={
                        <Typography.Title level={5}>
                          {titleCase(action)}
                        </Typography.Title>
                      }
                      key={action}
                      name={["permission", action]}
                    >
                      <Checkbox.Group>
                        {Object.keys(actions[action]).map((actionKey) => (
                          <Checkbox
                            value={actionKey}
                            key={actionKey}
                            id={`${snakeCase(action)}_${snakeCase(actionKey)}`}
                          >
                            {titleCase(actionKey)}
                          </Checkbox>
                        ))}
                      </Checkbox.Group>
                    </Form.Item>
                  ))}
              </Skeleton>

              <Form.Item {...tailFormItemLayout}>
                <Button
                  type="primary"
                  htmlType="submit"
                  id="role_submit"
                  className={classNames(styles.buttonBlue, styles.saveBtn)}
                  loading={loading || loadingUpdate}
                >
                  Save
                </Button>
                <Link to="/roles">
                  <Button
                    type="default"
                    htmlType="reset"
                    id="role_cancel"
                    className={styles.buttonBlue}
                  >
                    Cancel
                  </Button>
                </Link>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Skeleton>
    </PageLayoutWrapper>
  );
};
export default AddRole;
