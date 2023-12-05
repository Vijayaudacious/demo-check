import { Loader } from "@/Components/Loader";
import EmployeeDetailsWrapper from "@/Components/Wrappers/EmployeeDetailsWrapper";
import { DATE_FORMATS } from "@/Constant";
import { useUserDetails } from "@/Hooks";
import { resetPassword } from "@/Services/Users";
import { titleCase } from "@/Utils/generic";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Avatar, Button, Col, Modal, Row, Tag, message } from "antd";
import dayjs from "dayjs";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import styles from "./styles.module.less";
import ShowRoles from "@/Components/ShowRoles";

const { DAY_MONTH_YEAR, DAY_MONTHNAME_YEAR } = DATE_FORMATS;

const EmployeeShowDetails = () => {
  const baseURL = process.env.REACT_APP_BASE_API;
  const { id }: any = useParams();
  const { confirm } = Modal;
  const { formatMessage } = useIntl();
  const { isLoading, data } = useUserDetails(id);

  const employee = data?.data?.data || {};

  const profilePic = `${baseURL}${employee.profilePicture}`;
  const showConfirm = () => {
    confirm({
      title: formatMessage({
        id: "employee.profile.resetPassword.confirm",
      }),
      icon: <ExclamationCircleFilled />,
      centered: true,
      okText: formatMessage({
        id: "generic.yes",
      }),
      okType: "danger",
      cancelText: formatMessage({
        id: "generic.no",
      }),
      okButtonProps: {
        id: "yes",
      },
      cancelButtonProps: {
        id: "no",
      },
      onOk: async () => {
        try {
          await resetPassword(id);
          message.info(
            formatMessage({
              id: "employee.messages.resetPassword",
            })
          );
        } catch (error: any) {
          message.error(error.response.data.message);
        }
      },
    });
  };

  const showDetail = (data?: string, format?: string) => {
    if (!data) {
      return "--";
    } else if (!format) {
      return data;
    } else if (format === "titleCase") {
      return titleCase(data);
    } else if (format === "salary") {
      return `${data}/-month`;
    } else if (format === "dob") {
      const age = dayjs().diff(employee.dob, "year");
      return `${dayjs(data).format(DAY_MONTHNAME_YEAR)} (${age} year old)`;
    } else if (format) {
      return dayjs(data).format(format);
    }
  };
  return (
    <EmployeeDetailsWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.employees",
          }),
          path: "/employees",
        },
        {
          breadcrumbName: isLoading ? "..." : employee.name,
          path: `/employees/${id}/overview/`,
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.overview",
          }),
          path: `/employees/${id}/overview`,
        },
      ]}
    >
      <div className={styles.loader}>
        <Loader isLoading={isLoading} />
      </div>
      <Row gutter={32} className={styles.employeeDetailsection}>
        <Col xl={6} lg={8} xs={24}>
          <div className={styles.imageSection}>
            {employee.profilePicture ? (
              <img
                src={profilePic}
                alt="profileImage"
                className={styles.profileImg}
              />
            ) : (
              <Avatar className={styles.avatar}>
                <span className={styles.avatarSize}>
                  {employee.name?.trim().charAt(0).toUpperCase()}
                </span>
              </Avatar>
            )}
          </div>
          <div className={styles.regeneratePassword} id="regenerate_password">
            <Button
              type="primary"
              onClick={showConfirm}
              id="regenerate_password"
            >
              {formatMessage({
                id: "employee.profile.resetPassword.title",
              })}
            </Button>
          </div>
        </Col>
        <Col xl={9} lg={8} xs={24}>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>
              {formatMessage({
                id: "employee.form.employeeCode.label",
              })}
            </p>
            <h3 className={styles.empDsc}>
              {showDetail(employee?.employeeCode)}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>
              {formatMessage({
                id: "employee.form.name.label",
              })}
            </p>
            <h3 className={styles.empDsc}>
              {showDetail(employee.name, "titleCase")}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>
              {formatMessage({
                id: "employee.form.salary.label",
              })}
            </p>
            <h3 className={styles.empDsc}>
              {showDetail(employee.salary, "salary")}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>
              {formatMessage({
                id: "employee.form.email.label",
              })}
            </p>
            <a
              href={`mailto:${employee.email}`}
              target="_blank"
              className={styles.empDsc}
              rel="noreferrer"
              id="profile_overview_email"
            >
              {showDetail(employee.email)}
            </a>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>
              {formatMessage({
                id: "employee.form.contactNumber.label",
              })}
            </p>
            <a
              href={`tel:${employee.contactNumber}`}
              className={styles.empDsc}
              id="profile_overview_number"
            >
              {showDetail(employee.contactNumber)}
            </a>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>
              {formatMessage({
                id: "employee.form.panCard.label",
              })}
            </p>
            <h3 className={styles.empDsc}>{showDetail(employee.panCard)}</h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>
              {formatMessage({
                id: "employee.form.allocatedLeaves.label",
              })}
            </p>
            <h3 className={styles.empDsc}>
              {showDetail(employee.remainingLeaves)}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>
              {formatMessage({
                id: "employee.profile.details.createdDate",
              })}
            </p>
            <h3 className={styles.empDsc}>
              {showDetail(employee.createdAt, DAY_MONTH_YEAR)}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>
              {formatMessage({
                id: "employee.profile.details.joiningDate",
              })}
            </p>
            <h3 className={styles.empDsc}>
              {showDetail(employee.joiningDate, DAY_MONTH_YEAR)}
            </h3>
          </div>
        </Col>
        <Col xl={9} lg={8} xs={24}>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>
              {formatMessage({
                id: "employee.profile.details.roles",
              })}
            </p>
            <h3 className={styles.empDsc}>
              <ShowRoles roles={employee?.roles || []} />
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>
              {formatMessage({
                id: "employee.form.dob.label",
              })}
            </p>
            <h3 className={styles.empDsc}>{showDetail(employee.dob, "dob")}</h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>
              {formatMessage({
                id: "employee.form.fatherName.label",
              })}
            </p>
            <h3 className={styles.empDsc}>
              {showDetail(employee.fatherName, "titleCase")}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>
              {formatMessage({
                id: "employee.form.gender.label",
              })}
            </p>
            <h3 className={styles.empDsc}>
              {showDetail(employee.gender, "titleCase")}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>
              {formatMessage({
                id: "employee.form.maritialStatus.label",
              })}
            </p>
            <h3 className={styles.empDsc}>
              {showDetail(employee.maritialStatus, "titleCase")}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>
              {formatMessage({
                id: "employee.form.localAddress.label",
              })}
            </p>
            <h3 className={styles.empDsc}>
              {showDetail(employee.localAddress, "titleCase")}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>
              {formatMessage({
                id: "employee.profile.details.permanentAddress",
              })}
            </p>
            <h3 className={styles.empDsc}>
              {showDetail(employee.permanentAddress, "titleCase")}
            </h3>
          </div>
        </Col>
      </Row>
    </EmployeeDetailsWrapper>
  );
};

export default EmployeeShowDetails;
