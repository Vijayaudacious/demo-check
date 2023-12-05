import { DATE_FORMATS } from "@/Constant";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from "@/Hooks/emloyee";
import { EmployeeDetailsContext } from "@/Layouts/AddEmployeeLayout";
import {
  CreateEmployee,
  EducationalDetails as EducationalDetailsType,
  GetEmployeeDetails,
  Role,
} from "@/Types/Employee";
import { Button, Form, FormProps, message } from "antd";
import dayjs from "dayjs";
import React, { useContext, useEffect } from "react";
import { useIntl } from "react-intl";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.less";
import useWindowDimensions from "@/Hooks/useWindowDimensions";

const { YEAR_MONTH_DAY } = DATE_FORMATS;

interface EmployeeProps extends FormProps {
  nextStep: string;
  isLoading?: boolean;
  previousStep?: string;
  nextBtnText?: string;
  showSkipButton?: boolean;
  shouldUpdate?: boolean;
}

const FormWrapper: React.FC<React.PropsWithChildren<EmployeeProps>> = ({
  children,
  isLoading,
  previousStep,
  nextStep,
  nextBtnText,
  showSkipButton,
  shouldUpdate = true,
  ...props
}) => {
  const { isMobile } = useWindowDimensions();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { employeeId } = useParams();
  const details = useContext(EmployeeDetailsContext);
  const { mutateAsync: createEmployeeMutation, isLoading: isCreating } =
    useCreateEmployeeMutation();
  const { mutateAsync: updateEmployeeMutation, isLoading: isUpdating } =
    useUpdateEmployeeMutation();

  const setInitialValues = () => {
    if (!details) return;

    if (employeeId && details) {
      const {
        name,
        email,
        contactNumber,
        employeeCode,
        roles,
        joiningDate,
        salary,
        manager,
        allocatedLeaves,
        previousOrgDetails,
        educationDetails,
      } = details;
      form.setFieldsValue({
        name: name || "",
        manager,
        email,
        contactNumber,
        joiningDate: joiningDate && dayjs(joiningDate),
        allocatedLeaves,
        salary,
        employeeCode,
        roles: (roles || []).map(({ _id }: Role) => _id),
      });

      if (educationDetails && educationDetails.length >= 1) {
        form.setFieldsValue({
          educationDetails: educationDetails.map(
            ({
              institutionName,
              courseName,
              grade,
              passingYear,
              specialization,
            }: EducationalDetailsType) => ({
              institutionName: institutionName || "",
              courseName,
              grade,
              passingYear,
              specialization,
            })
          ),
        });
      }

      if (previousOrgDetails) {
        const {
          startDate,
          endDate,
          name: previousOrgName,
          salary: previousOrgSalary,
        } = previousOrgDetails;

        form.setFieldsValue({
          previousOrgDetails: {
            startDate: startDate ? dayjs(startDate) : undefined,
            endDate: endDate ? dayjs(endDate) : undefined,
            name: previousOrgName || "",
            salary: previousOrgSalary || "",
          },
        });
      }
    }
  };

  useEffect(() => {
    setInitialValues();
  }, [employeeId, details]);

  const handleCreate = async (employeeData: CreateEmployee) => {
    try {
      const data = await createEmployeeMutation({
        ...employeeData,
        joiningDate: dayjs(employeeData?.joiningDate).format(YEAR_MONTH_DAY),
      });
      message.success(
        formatMessage({
          id: "employee.messages.create",
        })
      );
      navigate(`/employees/${data._id}/personal-details`);
    } catch (error: any) {
      message.error(
        error.data.message ||
          formatMessage({
            id: "generic.errorMessage",
          })
      );
    }
  };

  const handleSubmit = async (data: object) => {
    if (!shouldUpdate) return navigate(nextStep);

    if (!employeeId) return handleCreate(data as CreateEmployee);

    const { _id, __v, updatedAt, createdAt, nameToSort, ...rest } = details;
    const { joiningDate, roles, ...employeeData } = data as GetEmployeeDetails;
    const assignedRoles = roles
      ? roles
      : details?.roles?.map((role: Role) => role._id);
    try {
      await updateEmployeeMutation({
        id: employeeId || "",
        data: {
          ...rest,
          ...employeeData,
          ...(joiningDate && [
            { joiningDate: dayjs(joiningDate).format(YEAR_MONTH_DAY) },
          ]),
          roles: assignedRoles,
        },
      });
      message.success(
        formatMessage({
          id: "employee.messages.update",
        })
      );
      navigate(nextStep);
    } catch (error: any) {
      message.error(
        error.data.message ||
          formatMessage({
            id: "generic.errorMessage",
          })
      );
    }
  };

  return (
    <Form
      {...props}
      layout="vertical"
      onFinish={handleSubmit}
      form={props.form || form}
      className={styles.formContainer}
    >
      <div className={!isMobile ? styles.childrenContainer : ""}>
        {children}
      </div>
      <Form.Item>
        <div className={styles.actionButtons}>
          {previousStep && (
            <Link to={previousStep}>
              <Button htmlType="reset" id="previous" type="primary">
                {formatMessage({
                  id: "generic.previous",
                })}
              </Button>
            </Link>
          )}
          {showSkipButton && (
            <Link to={nextStep}>
              <Button htmlType="reset" id="skip" type="primary">
                {formatMessage({
                  id: "generic.skip",
                })}
              </Button>
            </Link>
          )}
          <Button
            type="primary"
            htmlType="submit"
            id="save"
            loading={isLoading || isCreating || isUpdating}
            disabled={isLoading || isCreating || isUpdating}
          >
            {nextBtnText ||
              formatMessage({
                id: employeeId ? "generic.save" : "generic.next",
              })}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default FormWrapper;
