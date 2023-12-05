import { formatDateWithTime } from "@/Components/Formats";
import MobileCard from "@/Components/MobileCard";
import { Table } from "@/Components/Table";
import EmployeeDetailsWrapper from "@/Components/Wrappers/EmployeeDetailsWrapper";
import LeavesWrapper from "@/Components/Wrappers/LeaveWrapper";
import { COLOR_STATUS } from "@/Constant";
import { useUserDetails } from "@/Hooks";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import { leaveApproved, userLeave } from "@/Services/Leaves";
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Col, Row, Tag, Tooltip, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import type { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import get from "lodash/get";
import queryString from "querystring";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styles from "./styles.module.less";
import Modal from "@/Components/Modal";
import confirm from "antd/lib/modal/confirm";
import useModal from "antd/lib/modal/useModal";

interface DataType {
  key: string;
  name: string;
  status: string[];
}

interface filtersInterface {
  currentPage: any;
  limit: any;
}
interface permissionData {
  userPermission?: string;
}
const UserList: React.FC<permissionData> = (userPermission: permissionData) => {
  const { isMobile } = useWindowDimensions();

  const { id } = useParams();
  const { search: locationSearch } = useLocation();
  const parsed = queryString.parse(locationSearch) || {};
  const { currentPage = 1, limit = 500 } = parsed;
  const [tableData, setTableData] = useState([]);
  const [rejectLeave, setRejectLeave] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rejectDescribtion, setRejectDescription] = useState("");
  const [modal, contextHolder] = useModal();
  const [page, setPage] = useState(1);
  const [paginationSize, setPaginationSize] = useState(25);
  const [, setFilters] = useState<filtersInterface>({
    currentPage,
    limit,
  });

  useEffect(() => {
    UserList(id);
    // eslint-disable-next-line
  }, []);

  const UserList = async (id: any) => {
    setLoading(true);
    try {
      const { data }: any = await userLeave(id);
      const listdata = JSON.parse(JSON.stringify(data.data));
      let newArr: any = [];
      listdata.map((element: any) => {
        const objt = {
          createdBy: element.createdBy,
          description: element.description,
          end: element.endDate,
          start: element.startDate,
          title: element.reason,
          requestedAt: element.requestedAt,
          requestedBy: element.requestedBy,
          status: element.status,
          totalCountDay: element.totalCountDay,
          _id: element._id,
        };
        newArr.push(objt);
        return <></>;
      });
      setTableData(newArr);
      setLoading(false);
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const showModal = () => {
    setRejectDescription("");
    setIsModalVisible(true);
  };

  const handleOk = async (employeeId: string) => {
    try {
      await leaveApproved({
        employeeId,
        data: {
          status: "rejected",
          leaveStatusDescription: rejectDescribtion,
        },
      });
      UserList(id);
    } catch (error) {}
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onChangeTitle = (e: any) => {
    setRejectDescription(e.target.value);
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setFilters({
      ...filters,
      currentPage: pagination?.current,
      limit: pagination.pageSize.totalRecords,
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "S.No.",
      key: "index",
      render: (text: any, record: any, index: any) =>
        (page - 1) * paginationSize + index + 1,
    },
    {
      title: "Start Date",
      dataIndex: "start",
      key: "start",
      width: "1.5%",
      render: (start: any) => {
        return <>{dayjs(start).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: " End Date",
      dataIndex: "end",
      key: "end",
      width: "1.5%",
      render: (end: any) => {
        return <>{dayjs(end).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "Leave Count",
      dataIndex: "totalCountDay",
      key: "totalCountDay",
      width: ".2%",
    },
    {
      title: "Title",
      key: "title",
      dataIndex: "title",
    },
    {
      title: "Description",
      key: "description",
      dataIndex: "description",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status: string) => {
        return (
          <>
            <Tag color={COLOR_STATUS[status.toUpperCase()]}>
              {status.toUpperCase()}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Request At",
      key: "requestedAt",
      dataIndex: "requestedAt",
      width: "1.5%",
      render: (requestedAt: any) => {
        return <>{formatDateWithTime(requestedAt)}</>;
      },
    },
    {
      title: "Action",
      key: "action",
      width: "1.5%",
      render: (record: any) => {
        return (
          <>
            <Tooltip title="Approve">
              <CheckOutlined
                id="user_list_approve_button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleApprove(record._id);
                }}
              >
                Approve
              </CheckOutlined>
            </Tooltip>

            <Tooltip title="Reject">
              <CloseOutlined
                id="user_list_reject_button"
                onClick={() => {
                  showModal();
                  setRejectLeave(record._id);
                }}
              >
                Reject
              </CloseOutlined>
            </Tooltip>
          </>
        );
      },
    },
  ];
  const handleApprove = async (record: any) => {
    confirm({
      title: "Do you want to approve leave",
      icon: <ExclamationCircleOutlined />,
      centered: true,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        setLoading(true);
        try {
          await leaveApproved({
            employeeId: record,
            data: {
              status: "approved",
              leaveStatusDescription: rejectDescribtion,
            },
          });
          setLoading(false);
          UserList(id);
          message.success("Approve leave successfully");
        } catch (error: any) {
          message.error(error.message);
        }
      },
    });
  };
  const countDown = () => {
    const instance = modal.error({
      title: "Please enter reason of reject leave",
    });
    setTimeout(() => {
      instance.destroy();
    }, 3000);
  };
  const { data: userData } = useUserDetails(id);
  const UserName = get(userData, "data.data.name", "");
  return (
    <EmployeeDetailsWrapper
      breadcurmbs={[
        { breadcrumbName: "Employees", path: "/employees" },
        {
          breadcrumbName: UserName,
          path: `/employees/${id}/overview`,
        },
        {
          breadcrumbName: "Leaves",
          path: `/employees/${id}/leaves`,
        },
      ]}
    >
      <LeavesWrapper noBreadcrum isEmployeeDetails>
        <div className={styles.main}>
          {!isMobile && (
            <Table
              bordered={true}
              dataSource={tableData}
              columns={columns}
              handleChange={handleTableChange}
              pagination={{
                onChange(current, pageSize) {
                  setPage(current);
                  setPaginationSize(pageSize);
                },
                defaultPageSize: 10,
                hideOnSinglePage: false,
                showSizeChanger: true,
              }}
            />
          )}
          {isMobile &&
            React.Children.toArray(
              tableData.map((data: Record<string, string>, index) => (
                <MobileCard
                  title={data.title}
                  cardNumber={index + 1}
                  extra={
                    <>
                      <CheckOutlined
                        id="user_list_approve_button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(data._id);
                        }}
                      >
                        Approve
                      </CheckOutlined>
                      <CloseOutlined
                        id="user_list_reject_button"
                        onClick={() => {
                          showModal();
                          setRejectLeave(data._id);
                        }}
                      >
                        Reject
                      </CloseOutlined>
                    </>
                  }
                >
                  <Row>
                    <Col xs={12}>Start Date</Col>
                    <Col xs={12}>{dayjs(data.start).format("DD-MM-YYYY")}</Col>
                    <Col xs={12}>End Date</Col>
                    <Col xs={12}>{dayjs(data.end).format("DD-MM-YYYY")}</Col>
                    <Col xs={12}>Status</Col>
                    <Col xs={12}>{data.status}</Col>
                    <Col xs={12}>Request At</Col>
                    <Col xs={12}>{formatDateWithTime(data.requestedAt)}</Col>
                    <Col xs={12}>Total Days</Col>
                    <Col xs={12}>{data.totalCountDay}</Col>
                    <Col xs={12}>Description</Col>
                    <Col xs={12}>{data.description}</Col>
                  </Row>
                </MobileCard>
              ))
            )}
          <div>
            <Modal
              title="Reason of reject leave"
              open={isModalVisible}
              onCancel={handleCancel}
              onOk={() =>
                rejectDescribtion ? handleOk(rejectLeave) : countDown()
              }
            >
              {contextHolder}
              <TextArea
                id="user_list_reject_describtion"
                rows={4}
                value={rejectDescribtion}
                name="about"
                onChange={(e) => onChangeTitle(e)}
              />
            </Modal>
          </div>
        </div>
      </LeavesWrapper>
    </EmployeeDetailsWrapper>
  );
};
export default UserList;
