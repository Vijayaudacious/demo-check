import FormWrapper from "@/Pages/Employee/EmployeeForm/FormWrapper";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import ShowDocuments from "./ShowDocuments";

const Documents = () => {
  const { employeeId } = useParams();
  const { formatMessage } = useIntl();

  return (
    <FormWrapper
      nextBtnText={formatMessage({ id: "generic.finish" })}
      previousStep={`/employees/${employeeId}/salary-details`}
      nextStep={"/employees"}
      shouldUpdate={false}
      initialValues={{ documents: [""] }}
    >
      <ShowDocuments />
    </FormWrapper>
  );
};

export default Documents;
