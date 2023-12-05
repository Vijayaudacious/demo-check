import SingleIdUserCalender from "@/Components/SingleIdUserCalender";
import EmployeeDetailsWrapper from "@/Components/Wrappers/EmployeeDetailsWrapper";
import LeavesWrapper from "@/Components/Wrappers/LeaveWrapper";
import { useUserDetails } from "@/Hooks";
import get from "lodash/get";
import { useParams } from "react-router-dom";
import styles from "./styles.module.less";

const EmployeeDetailsCalender = () => {
  const { id }: any = useParams();

  const { data: userData, isLoading } = useUserDetails(id);
  const userName = get(userData, "data.data.name", "");

  return (
    <EmployeeDetailsWrapper
      breadcurmbs={[
        { breadcrumbName: "Employees", path: "/employees" },
        {
          breadcrumbName: isLoading ? "...." : userName,
          path: `/employees/${id}/overview`,
        },
        {
          breadcrumbName: "Leaves",
          path: `/employees/${id}/leaves`,
        },
      ]}
    >
      <LeavesWrapper noBreadcrum isEmployeeDetails>
        <div className={styles.mainInner}>
          <SingleIdUserCalender userId={id} />
        </div>
      </LeavesWrapper>
    </EmployeeDetailsWrapper>
  );
};

export default EmployeeDetailsCalender;
