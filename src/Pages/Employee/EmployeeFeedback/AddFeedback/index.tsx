import { formatName } from "@/Components/Formats";
import { Input } from "@/Components/InputField";
import { Loader } from "@/Components/Loader";
import PageLayoutWrapper from "@/Components/Wrappers/PageLayoutWrapper";
import {
  UseGetSingleFeedback,
  useCreateFeedbackMutation,
  useUpdateFeedbackMutation,
  useUserDetails,
} from "@/Hooks";
import { Button, Col, Form, PageHeader, Rate, Row, message } from "antd";
import get from "lodash/get";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.less";

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
  },
};

const AddFeedback = () => {
  const [form] = Form.useForm();
  const [spinLoading, setSpinLoading] = useState(false);
  const { userId, feedbackId } = useParams();
  const navigate = useNavigate();
  const { data: UserData } = useUserDetails(userId);
  const UserName = get(UserData, "data.data.name");
  const id = get(UserData, "data.data._id");

  const { mutateAsync: CreateFeedbackMutation } = useCreateFeedbackMutation();
  const { isLoading: isUpdating, mutateAsync: UpdateFeedbackMutation } =
    useUpdateFeedbackMutation();

  const { data: feedbackData } = UseGetSingleFeedback(String(feedbackId || ""));
  const feedbackSummary = get(feedbackData, "data.data.feedbackSummary");
  const ratings = get(feedbackData, "data.data.ratings");

  useEffect(() => {
    if (feedbackData && feedbackId) {
      const formData = {
        UserName,
        feedbackSummary,
        ratings,
      };
      form.setFieldsValue(formData);
    }
  }, [feedbackData, feedbackId]);

  const handleSubmit = async (values: Record<string, any>) => {
    const { feedbackSummary, ratings } = values;

    const feedbackValue = {
      ...values,
      feedbackSummary,
      ratings,
    };

    try {
      if (feedbackId) {
        await UpdateFeedbackMutation({
          id: feedbackId,
          data: feedbackValue,
        });
        message.success("Feedback updated successfully");
      } else {
        await CreateFeedbackMutation({
          id: userId || "",
          data: feedbackValue,
        });
        message.success("Feedback created successfully");
      }
      navigate(`/employees/${id}/feedback`);
    } catch (error: any) {
      message.error("Please provide atleast one rating");
    }
  };

  return (
    <>
      <PageLayoutWrapper
        breadcurmbs={[
          { breadcrumbName: "Employees", path: "/employees" },
          {
            breadcrumbName: UserName || "",
            path: `/employees/${userId}/overview`,
          },
          {
            breadcrumbName: `new feedback`,
            path: `/employees/${userId}/feedback`,
          },
        ]}
      >
        <Col flex="auto" className={styles.addFeedbackSection}>
          <div className={styles.loader}>
            <Loader isLoading={isUpdating} />
          </div>
          <PageHeader
            ghost={false}
            title={feedbackId ? "Update Feedback" : "New Feedback"}
          />
          <div className={styles.innerSection}>
            <div className={styles.sectionInner}>
              <Form
                form={form}
                name="feedback"
                id="feedback_form"
                onFinish={handleSubmit}
                layout="vertical"
                initialValues={{
                  name: formatName(UserName || ""),
                }}
              >
                <Row gutter={16}>
                  <Col lg={24}>
                    <Form.Item label="Name" name={"name"}>
                      <Input
                        id="Feedback_name"
                        type="text"
                        disabled={true}
                        placeholder="Enter full name"
                      />
                    </Form.Item>
                    <Form.Item
                      label="Feedback Summary"
                      name="feedbackSummary"
                      rules={[
                        {
                          required: true,
                          message: "Please enter Summary",
                          whitespace: true,
                        },
                      ]}
                    >
                      <Input
                        id="feedback_summary"
                        type="textArea"
                        placeholder="Enter summary"
                      />
                    </Form.Item>
                    <Col lg={12}>
                      <Form.Item
                        label="Rating"
                        name="ratings"
                        rules={[
                          {
                            validator: (_, value) => {
                              if (
                                value === undefined ||
                                value === null ||
                                value === 0
                              ) {
                                return Promise.reject(
                                  "Please provide at least one rating"
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Rate className={styles.retings} />
                      </Form.Item>
                      <Col lg={24} xs={24}>
                        <Form.Item {...tailFormItemLayout}>
                          <Button
                            type="primary"
                            htmlType="submit"
                            id="save"
                            className={`${styles.buttonBlue} ${styles.buttonAdd}`}
                          >
                            Save
                          </Button>

                          <Button
                            htmlType="reset"
                            id="cancel"
                            onClick={() => history.back()}
                            className={`${styles.buttonBlue} ${styles.buttonAdd}`}
                          >
                            Cancel
                          </Button>
                        </Form.Item>
                      </Col>
                    </Col>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </Col>
      </PageLayoutWrapper>
    </>
  );
};

export default AddFeedback;
