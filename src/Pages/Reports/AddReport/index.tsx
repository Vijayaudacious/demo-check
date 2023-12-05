import { UserContext } from "@/Auth";
import { Loader } from "@/Components/Loader";
import SelectUser from "@/Components/SelectUserInput";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import { useProjects } from "@/Hooks/project";
import {
  useCreateReportMutation,
  useReport,
  useUpdateReporttMutation,
} from "@/Hooks/report";
import { showErrorMessage } from "@/Utils/generic";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  PageHeader,
  Row,
  Select,
  SelectProps,
  TimePicker,
  message,
} from "antd";
import dayjs from "dayjs";
import { debounce, get } from "lodash";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.less";
import { useIntl } from "react-intl";

const AddReport = () => {
  const { _id: loggedinUserId, organisationId } = useContext(UserContext);
  const { TextArea } = Input;
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();
  const [projectOptions, setProjectOptions] = useState<SelectProps["options"]>(
    []
  );

  const [search, setSearch] = useState<string>("");
  const { isLoading: isCreating, mutateAsync: createReportMutation } =
    useCreateReportMutation();
  const { isLoading: isUpdating, mutateAsync: updateReportMutation } =
    useUpdateReporttMutation();
  const { data: allProjects, isLoading } = useProjects({
    search,
  });
  const getProjects = get(allProjects, "items", []);
  const projects = getProjects?.map((data: Record<string, string>) => {
    return {
      label: data.name,
      value: data.id,
    };
  });

  useEffect(() => {
    if (getProjects.length) {
      setProjectOptions(projects);
    }
  }, [allProjects]);

  const handleProjectSearch = debounce((searchedProject: string) => {
    setSearch(searchedProject);
  }, 1000);

  const onFinish = async (values: Record<string, any>) => {
    const finalData = values.tasks?.map((value: Record<string, string>) => {
      return {
        ...value,
        userId: loggedinUserId,
        orgId: organisationId,
        ...(!reportId && { createdBy: loggedinUserId }),
        reportDate: value.reportDate
          ? dayjs(value.reportDate).format("YYYY-MM-DD")
          : dayjs(new Date()).format("YYYY-MM-DD"),
        startTime: dayjs(value.startTime).format("YYYY-MM-DDTHH:mm:ss"),
        endTime: dayjs(value.endTime).format("YYYY-MM-DDTHH:mm:ss"),
        ...(reportId && { id: value.id }),
      };
    });
    try {
      if (!reportId) {
        await createReportMutation({
          tasks: finalData,
        });
        message.success("Report created successfully");
      }
      if (reportId) {
        await updateReportMutation({
          id: reportId,
          data: finalData,
        });
        message.success("Report updated successfully");
      }
      navigate("/reports");
    } catch (error) {
      showErrorMessage(error);
    }
  };
  const { data: singleReportData } = useReport(String(reportId || ""));

  useEffect(() => {
    if (reportId && singleReportData) {
      form.setFieldsValue({
        tasks: singleReportData.map((reportData: Record<string, string>) => {
          return {
            id: reportData.id,
            assignedBy: reportData.assignedBy,
            description: reportData.description,
            startTime: reportData.startTime && dayjs(reportData.startTime),
            endTime: reportData.endTime && dayjs(reportData.endTime),
            projectId: reportData.projectId,
          };
        }),
      });
    }
  }, [singleReportData]);

  return (
    <PageLayoutWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.projects",
          }),
          path: "/projects",
        },
        { breadcrumbName: "Reports", path: "/reports" },
        reportId
          ? { breadcrumbName: "Update", path: `/reports/${reportId}/update` }
          : { breadcrumbName: "New", path: "/reports/new" },
      ]}
    >
      <PageHeader
        ghost={false}
        title={reportId ? "Update Report" : "New Report"}
      />

      <Form
        name="reports"
        onFinish={onFinish}
        autoComplete="off"
        form={form}
        initialValues={{ tasks: [""] }}
        layout="vertical"
      >
        <Form.List name="tasks">
          {(fields, { add, remove }) => (
            <div>
              {fields.map(({ key, name, ...restField }, index) => (
                <Row gutter={16} key={index}>
                  <Col xl={4} lg={6} md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      name={[name, "startTime"]}
                      label="Start time"
                      rules={[
                        { required: true, message: "Please select start time" },
                      ]}
                    >
                      <TimePicker
                        placeholder="Select start time"
                        size="large"
                        className={styles.antPicker}
                        id={`start_date_${index}`}
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={4} lg={6} md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      name={[name, "endTime"]}
                      label="End time"
                      rules={[
                        { required: true, message: "Please select end time" },
                      ]}
                    >
                      <TimePicker
                        placeholder="Select end time"
                        size="large"
                        className={styles.antPicker}
                        id={`start_end_${index}`}
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={4} lg={6} md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      name={[name, "assignedBy"]}
                      rules={[
                        {
                          required: true,
                          message: "Please select manager name",
                        },
                      ]}
                      className={styles.managersField}
                      label="Manager name"
                    >
                      <SelectUser id={`select_manager_${index}`} />
                    </Form.Item>
                  </Col>
                  <Col xl={4} lg={6} md={12} xs={24}>
                    <Form.Item
                      {...restField}
                      name={[name, "projectId"]}
                      rules={[
                        {
                          required: true,
                          message: "Please select project name",
                        },
                      ]}
                      className={styles.projectsField}
                      label="Project name"
                    >
                      <Select
                        size="large"
                        showSearch
                        value={search}
                        placeholder="Select project"
                        defaultActiveFirstOption={false}
                        filterOption={false}
                        onSearch={handleProjectSearch}
                        onChange={handleProjectSearch}
                        options={projectOptions}
                        loading={isLoading}
                        notFoundContent={
                          isLoading ? <Loader isLoading /> : null
                        }
                        id={`project_name_${index}`}
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={6} lg={22} md={22} xs={24}>
                    <Form.Item
                      {...restField}
                      name={[name, "description"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter the description",
                        },
                      ]}
                      className={styles.descriptionField}
                      label="Description"
                    >
                      <TextArea
                        placeholder="Enter description"
                        showCount
                        maxLength={300}
                        id={`description_${index}`}
                      />
                    </Form.Item>
                  </Col>
                  <Col
                    xl={2}
                    lg={2}
                    md={2}
                    xs={24}
                    className={styles.buttonSection}
                  >
                    {fields.length > 1 && !reportId && (
                      <MinusCircleOutlined
                        className={styles.removeIcon}
                        onClick={() => remove(name)}
                        id={`remove_${index}`}
                      />
                    )}
                    {fields.length === index + 1 && !reportId && (
                      <PlusCircleOutlined
                        onClick={() => add()}
                        className={styles.addIcon}
                        id={`add_${index}`}
                      />
                    )}
                  </Col>
                </Row>
              ))}
            </div>
          )}
        </Form.List>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating || isUpdating}
            className={styles.saveBtn}
            id="save"
          >
            Save
          </Button>
          <Link to="/reports">
            <Button htmlType="reset" id="cancel" className={styles.cancelBtn}>
              Cancel
            </Button>
          </Link>
        </Form.Item>
      </Form>
    </PageLayoutWrapper>
  );
};

export default AddReport;
