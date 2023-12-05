import { UserContext } from "@/Auth";
import DatePicker from "@/Components/DatePicker";
import { formatDate } from "@/Components/Formats";
import { Input } from "@/Components/InputField";
import SelectUser from "@/Components/SelectUserInput";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { DATE_FORMATS } from "@/Constant";
import {
  useCreateProjectMutation,
  useProject,
  useUpdateProjectMutation,
} from "@/Hooks/project";
import { CreateProjectPayload } from "@/Types/Project";
import { Button, Col, Form, PageHeader, Row, message } from "antd";
import classNames from "classnames";
import dayjs from "dayjs";
import get from "lodash/get";
import { useContext, useEffect } from "react";
import { useIntl } from "react-intl";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.less";

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
  },
};

const { YEAR_MONTH_DAY, DAY_MONTH_YEAR } = DATE_FORMATS;

const AddUpdateProject = () => {
  const { _id: loggedinUserId, organisationId } = useContext(UserContext);
  const { projectId } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { isLoading: isCreating, mutateAsync: createProjectMutation } =
    useCreateProjectMutation();
  const { formatMessage } = useIntl();
  const { isLoading: isUpdating, mutateAsync: updateProjectMutation } =
    useUpdateProjectMutation();

  const { data } = useProject(String(projectId || ""));
  const projectName = get(data, "name", "");
  useEffect(() => {
    if (projectId && data) {
      const { name, managerId, startDate, endDate, estimatedEndDate } = data;
      form.setFieldsValue({
        name,
        managerId,
        startDate: startDate && dayjs(startDate),
        estimatedEndDate: estimatedEndDate && dayjs(estimatedEndDate),
        endDate: endDate && dayjs(endDate),
      });
    }
  }, [data, projectId]);

  const handleSubmit = async (value: CreateProjectPayload) => {
    const { startDate, endDate, estimatedEndDate } = value;

    const projectValues = {
      ...value,
      orgId: organisationId,

      ...(startDate && {
        startDate: formatDate(startDate, YEAR_MONTH_DAY),
      }),
      ...(endDate && {
        endDate: formatDate(endDate, YEAR_MONTH_DAY),
      }),
      ...(estimatedEndDate && {
        estimatedEndDate: formatDate(estimatedEndDate, YEAR_MONTH_DAY),
      }),
    };
    try {
      if (projectId) {
        await updateProjectMutation({
          id: projectId,
          data: {
            ...projectValues,
            updatedBy: loggedinUserId,
          },
        });

        message.success(formatMessage({ id: "project.message.updated" }));
      }
      if (!projectId) {
        await createProjectMutation({
          ...projectValues,
          createdBy: loggedinUserId,
          updatedBy: loggedinUserId,
        });
        message.success(formatMessage({ id: "project.message.created" }));
      }
      navigate("/projects");
    } catch (error: any) {
      message.error(
        error.data.message ||
          formatMessage({
            id: "generic.errorMessage",
          })
      );
    }
  };

  const startDate = Form.useWatch("startDate", form);
  const endDate = Form.useWatch("endDate", form);
  const estimatedDate = Form.useWatch("estimatedEndDate", form);
  return (
    <PageLayoutWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.projects",
          }),
          path: "/projects",
        },
        ...(!projectId
          ? [
              {
                breadcrumbName: formatMessage({
                  id: "breadcrumbs.new",
                }),
                path: "/projects/new",
              },
            ]
          : []),
        ...(projectId && projectName
          ? [
              {
                breadcrumbName: projectName,
                path: `/projects/${projectId}/update`,
              },
            ]
          : []),
      ]}
    >
      <Col flex="auto" className={styles.mainContainer}>
        <PageHeader
          ghost={false}
          title={
            projectId
              ? formatMessage({ id: "project.form.title.update" })
              : formatMessage({ id: "project.form.title.new" })
          }
        />
        <div className={styles.formContainer}>
          <Form
            name="project"
            layout="vertical"
            onFinish={handleSubmit}
            form={form}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={formatMessage({
                    id: "project.form.project.label",
                  })}
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: formatMessage({
                        id: "project.form.project.required",
                      }),
                    },
                  ]}
                >
                  <Input
                    placeholder={formatMessage({
                      id: "project.form.project.placeholder",
                    })}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={formatMessage({
                    id: "project.form.managerName.label",
                  })}
                  name="managerId"
                  rules={[
                    {
                      required: true,
                      message: formatMessage({
                        id: "project.form.managerName.required",
                      }),
                    },
                  ]}
                >
                  <SelectUser />
                </Form.Item>
              </Col>
              <Col xs={24} md={24}>
                <h2>
                  {formatMessage({
                    id: "project.form.projectDates.title",
                  })}
                </h2>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="startDate"
                  label={formatMessage({
                    id: "project.form.projectDates.startDate.label",
                  })}
                  rules={[
                    {
                      required: true,
                      message: formatMessage({
                        id: "project.form.projectDates.startDate.required",
                      }),
                    },
                  ]}
                >
                  <DatePicker
                    format={DAY_MONTH_YEAR}
                    id="start_date"
                    className="w-100"
                    placeholder={formatMessage({
                      id: "project.form.projectDates.startDate.placeholder",
                    })}
                    disabledDate={(d) =>
                      !d || d.isAfter(dayjs(endDate, YEAR_MONTH_DAY))
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="estimatedEndDate"
                  label={formatMessage({
                    id: "project.form.projectDates.estimatedDate.label",
                  })}
                >
                  <DatePicker
                    className="w-100"
                    format={DAY_MONTH_YEAR}
                    placeholder={formatMessage({
                      id: "project.form.projectDates.estimatedDate.placeholder",
                    })}
                    disabledDate={(d) =>
                      !d ||
                      d.isBefore(dayjs(startDate, YEAR_MONTH_DAY)) ||
                      d.isAfter(dayjs(endDate, YEAR_MONTH_DAY))
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  name="endDate"
                  label={formatMessage({
                    id: "project.form.projectDates.endDate.label",
                  })}
                >
                  <DatePicker
                    className="w-100"
                    format={DAY_MONTH_YEAR}
                    placeholder={formatMessage({
                      id: "project.form.projectDates.endDate.placeholder",
                    })}
                    disabledDate={(d) =>
                      !d ||
                      d.isSame(
                        estimatedDate
                          ? dayjs(estimatedDate, YEAR_MONTH_DAY)
                          : dayjs(startDate, YEAR_MONTH_DAY)
                      ) ||
                      d.isBefore(
                        estimatedDate
                          ? dayjs(estimatedDate, YEAR_MONTH_DAY)
                          : dayjs(startDate, YEAR_MONTH_DAY)
                      )
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              {...tailFormItemLayout}
              className={classNames(styles.actionContainer, "mt-3")}
            >
              <Button
                type="primary"
                htmlType="submit"
                id="project_submit"
                className="buttoBlue"
                loading={isCreating || isUpdating}
              >
                {formatMessage({
                  id: "generic.save",
                })}
              </Button>
              <Link to="/projects">
                <Button
                  type="default"
                  htmlType="reset"
                  id="project_cancel"
                  className="cancelButton"
                >
                  {formatMessage({
                    id: "generic.cancel",
                  })}
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </PageLayoutWrapper>
  );
};

export default AddUpdateProject;
