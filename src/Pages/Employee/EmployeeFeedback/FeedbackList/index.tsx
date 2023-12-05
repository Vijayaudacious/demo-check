import DatePicker, { DatePickerProps } from "@/Components/DatePicker";
import DeleteModal from "@/Components/DeleteModal";
import { formatDate } from "@/Components/Formats";
import { Table } from "@/Components/Table";
import EmployeeDetailsWrapper from "@/Components/Wrappers/EmployeeDetailsWrapper";
import { useDeleteFeedback, useFeedback, useUserDetails } from "@/Hooks";
import { FeedbackType } from "@/Types/Feedback";
import { EditOutlined, PlusOutlined, StarFilled } from "@ant-design/icons";
import {
  Button,
  Col,
  PageHeader,
  Rate,
  Row,
  Space,
  Tooltip,
  message,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import get from "lodash/get";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import styles from "./styles.module.less";

const FeedbackList = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const page = params.get("currentPage") || "1";
  const size = params.get("limit") || "10";
  const search = params.get("search") || "";
  const startDate = params.get("startDate") || "";
  const endDate = params.get("endDate") || "";

  const { id: userId, feedbackId } = useParams();
  const { data, isLoading } = useFeedback(
    userId,
    page,
    size,
    startDate,
    endDate
  );

  const { data: UserData } = useUserDetails(userId);
  const UserName = get(UserData, "data.data.name");
  const { mutateAsync: DeleteFeedbackMutation } = useDeleteFeedback();

  const handleEdit = (userId: string) => {
    navigate(`/feedback/${userId}/update`);
  };

  const onFilterChange = (pagination: Record<string, any>) => {
    const { current: currentPage, pageSize } = pagination;
    setParams({
      currentPage: String(currentPage),
      limit: String(pageSize),
      startDate,
      endDate,
    });
  };

  const columns: ColumnsType<FeedbackType[]> = [
    {
      title: "S.No.",
      key: "index",
      render: (text: string, record: any, index: number) =>
        (Number(page) - 1) * Number(size) + index + 1,
    },
    {
      title: "Provider Name",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (createdBy) => createdBy.name,
    },
    {
      title: "Feedback Date",
      key: "createdAt",
      render: ({ createdAt }) => {
        return <>{formatDate(createdAt)}</>;
      },
    },
    {
      title: "Summary",
      key: "feedbackSummary",
      render: ({ feedbackSummary }) => {
        return <p className={styles.feedbackSummary}>{feedbackSummary}</p>;
      },
    },
    {
      title: "Ratings",
      dataIndex: "ratings",
      key: "ratings",
      render: (ratings) => {
        return <Rate value={ratings} disabled character={<StarFilled />} />;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (record: FeedbackType) => {
        return (
          <>
            <Tooltip title="Update">
              <Button
                icon={<EditOutlined />}
                id="feedback_edit_icon"
                className={styles.editBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(record._id);
                }}
              />
            </Tooltip>

            <Tooltip title="Delete">
              <span>
                <DeleteModal
                  id="feedback_delete_icon"
                  title={`Do you want to delete this feedback?`}
                  handleOk={() => handleDelete(record._id)}
                  deleteingKey={record.createdBy.name}
                />
              </span>
            </Tooltip>
          </>
        );
      },
    },
  ];

  const handleDelete = async (feedbackId: string) => {
    try {
      DeleteFeedbackMutation(feedbackId);
      message.success("Feedback deleted successfully");
    } catch (error: any) {
      message.error(
        "We are not able to delete the feedback, please try again after some time."
      );
    }
  };

  const onStartDateChange: DatePickerProps["onChange"] = (value) => {
    setParams({
      search,
      currentPage: "1",
      limit: String(size),
      startDate: value ? value.format("YYYY-MM-DD") : "",
      endDate,
    });
  };
  const onEndDateChange: DatePickerProps["onChange"] = (value) => {
    setParams({
      search,
      currentPage: "1",
      limit: String(size),
      startDate,
      endDate: value ? value.format("YYYY-MM-DD") : "",
    });
  };

  return (
    <>
      <EmployeeDetailsWrapper
        breadcurmbs={[
          { breadcrumbName: "Employees", path: "/employees" },
          {
            breadcrumbName: UserName || "",
            path: `/employees/${userId}/overview`,
          },
          {
            breadcrumbName: "feedback",
            path: `/employees/${userId}/feedback`,
          },
        ]}
      >
        <Row>
          <Col flex="auto" className={styles.FeedbackSection}>
            <PageHeader
              className={styles.FeedbackHeading}
              ghost={false}
              extra={[
                <Button key="1" type="primary" id="employee_feedback_add">
                  <Link to={`/feedback/${userId}/new`}>
                    <PlusOutlined />
                    Add
                  </Link>
                </Button>,
              ]}
            />
            <Table
              bordered={true}
              pagination={{
                pageSize: Number(size),
                current: Number(page),
                showSizeChanger: true,
                total: data?.totalRecords,
              }}
              handleChange={(pagination) => onFilterChange(pagination)}
              columns={columns}
              loading={isLoading}
              dataSource={data?.data || []}
              extra={
                <Space>
                  <div className={styles.startDate}>
                    Feedback Date
                    <DatePicker
                      format="DD-MM-YYYY"
                      id="feedback_startDate"
                      onChange={onStartDateChange}
                      value={startDate ? dayjs(startDate) : undefined}
                      placeholder="Select start date"
                    />
                  </div>
                  <div className={styles.endDate}>
                    <DatePicker
                      format="DD-MM-YYYY"
                      id="feedback_end_date"
                      onChange={onEndDateChange}
                      value={endDate ? dayjs(endDate) : undefined}
                      placeholder="Select end date"
                    />
                  </div>
                </Space>
              }
            />
          </Col>
        </Row>
      </EmployeeDetailsWrapper>
    </>
  );
};

export default FeedbackList;
