import EmployeeDetailsWrapper from "@/Components/Wrappers/EmployeeDetailsWrapper";
import { useUserDetails } from "@/Hooks";
import { Spin } from "antd";
import get from "lodash/get";
import { useParams } from "react-router-dom";
import EmployeeForm from "../EmployeeForm";

const EmployeeDetailsEdit = () => {
  const { id }: any = useParams();

  const {
    data: userData,
    isLoading,
    refetch: refetchUser,
  } = useUserDetails(id);
  const userName = get(userData, "data.data.name", "");

  return (
    <EmployeeDetailsWrapper
      breadcurmbs={[
        { breadcrumbName: "Employees", path: "/employees" },
        ...(id && userName
          ? [
              { breadcrumbName: userName, path: `/employees/${id}/overview` },
              {
                breadcrumbName: "Update",
                path: `/employee/${id}/employee-details`,
              },
            ]
          : []),
      ]}
    >
      <Spin spinning={isLoading}>
        <EmployeeForm
          refetchUser={refetchUser}
          showHeader={false}
          initialValues={userData?.data?.data}
        />
      </Spin>
    </EmployeeDetailsWrapper>
  );
};

export default EmployeeDetailsEdit;
