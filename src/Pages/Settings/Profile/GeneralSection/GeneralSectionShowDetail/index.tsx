import { UserContext } from "@/Auth";
import { FormatMonth, formatDate, formatName } from "@/Components/Formats";
import { Loader } from "@/Components/Loader";
import SettingDetailsWrapper from "@/Components/Wrappers/SettingWrapper";
import { userDetail } from "@/Services/Users";
import { Avatar, Button, Col, Row, Tag } from "antd";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./styles.module.less";
import ShowRoles from "@/Components/ShowRoles";

const EmployeeShowDetails = () => {
  const [spinLoading, setSpinLoading] = useState(false);
  const [employee, setEmployee] = useState<any>({});
  const { _id: loggedInUserId } = useContext(UserContext);
  const baseURL = process.env.REACT_APP_BASE_API;

  let { id }: any = useParams();
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getData = async () => {
    setSpinLoading(true);
    try {
      const { data }: any = await userDetail(loggedInUserId);
      setEmployee(data.data);
      setSpinLoading(false);
    } catch (error) {
      setSpinLoading(false);
    }
  };

  const date1 = dayjs(new Date());
  const getAge = date1.diff(employee.DOB, "year");
  const profilePic = `${baseURL}${employee.profilePicture}`;

  return (
    <SettingDetailsWrapper
      breadcurmbs={[{ breadcrumbName: "Settings", path: "/settings/employee" }]}
    >
      <div className={styles.loader}>
        <Loader isLoading={spinLoading} />
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
          <Link to={"/settings/employee/update"}>
            <Button type="primary" className={styles.updateButton}>
              Update
            </Button>
          </Link>
        </Col>
        <Col xl={9} lg={8} xs={24}>
          <div className={styles.mainSection}>
            <div className={styles.detailBox}>
              <p className={styles.empLavel}>Employee ID</p>
              <h3 className={styles.empDsc}>
                {employee.Employee_ID ? employee.Employee_ID : "--"}
              </h3>
            </div>
            <div className={styles.detailBox}>
              <p className={styles.empLavel}>Employee Name</p>
              <h3 className={styles.empDsc}>
                {employee.name ? formatName(employee.name) : "--"}
              </h3>
            </div>
            <div className={styles.detailBox}>
              <p className={styles.empLavel}>Email</p>
              <h3 className={styles.empDsc}>
                <a
                  href={`mailto:${employee.email}`}
                  target="_blank"
                  className={styles.empDsc}
                  rel="noreferrer"
                  id="profile_overview_email"
                >
                  {employee.email ? employee.email : "--"}
                </a>
              </h3>
            </div>
            <div className={styles.detailBox}>
              <p className={styles.empLavel}>Contact Number</p>
              <h3 className={styles.empDsc}>
                <a
                  href={`tel:${employee.contactNumber}`}
                  className={styles.empDsc}
                  id="profile_overview_number"
                >
                  {employee.contactNumber ? employee.contactNumber : "--"}
                </a>
              </h3>
            </div>
            <div className={styles.detailBox}>
              <p className={styles.empLavel}>Alternate Contact Number</p>
              <h3 className={styles.empDsc}>
                <a
                  href={`tel:${employee.contactNumber}`}
                  className={styles.empDsc}
                  id="profile_overview_number"
                >
                  {employee.alternateContactNumber
                    ? employee.alternateContactNumber
                    : "--"}
                </a>
              </h3>
            </div>
            <div className={styles.detailBox}>
              <p className={styles.empLavel}>Pan Card Number</p>
              <h3 className={styles.empDsc}>
                {employee.panCardNumber ? employee.panCardNumber : "--"}
              </h3>
            </div>
            <div className={styles.detailBox}>
              <p className={styles.empLavel}>Remaining leaves</p>
              <h3 className={styles.empDsc}>
                {employee.remainingLeaves ? employee.remainingLeaves : "--"}
              </h3>
            </div>
            <div className={styles.detailBox}>
              <p className={styles.empLavel}>Created Date:</p>
              <h3 className={styles.empDsc}>
                {formatDate(employee.createdAt)
                  ? formatDate(employee.createdAt)
                  : "--"}
              </h3>
            </div>
          </div>
        </Col>
        <Col xl={9} lg={8} xs={24}>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>Roles</p>
            <h3 className={styles.empDsc}>
              <ShowRoles roles={employee?.roles || []} />
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>Date of Birth</p>
            <h3 className={styles.empDsc}>
              {employee.DOB ? (
                <>
                  {FormatMonth(employee.DOB)} ({getAge} year old)
                </>
              ) : (
                "--"
              )}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>Father Name</p>
            <h3 className={styles.empDsc}>
              {employee.fatherName ? formatName(employee.fatherName) : "--"}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>Gender</p>
            <h3 className={styles.empDsc}>
              {employee.gender ? formatName(employee.gender) : "--"}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>Marital Status</p>
            <h3 className={styles.empDsc}>
              {employee.maritial_status
                ? formatName(employee.maritial_status)
                : "--"}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>Local Address</p>
            <h3 className={styles.empDsc}>
              {employee.localAddress ? formatName(employee.localAddress) : "--"}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>Permanent Address</p>
            <h3 className={styles.empDsc}>
              {employee.permanentAddress
                ? formatName(employee.permanentAddress)
                : "--"}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.empLavel}>Joining Date:</p>
            <h3 className={styles.empDsc}>
              {employee.joiningDate ? formatDate(employee.joiningDate) : "--"}
            </h3>
          </div>
        </Col>
      </Row>
    </SettingDetailsWrapper>
  );
};

export default EmployeeShowDetails;
