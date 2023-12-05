import DeleteModal from "@/Components/DeleteModal";
import { useDeleteSalaryTemplateMutation } from "@/Hooks/templates";
import { message } from "antd";
import React from "react";
import { useIntl } from "react-intl";

interface DeleteReportProps {
  id: string;
  templateName: string;
}
const DeleteSalaryTemplate: React.FC<DeleteReportProps> = ({
  id,
  templateName,
}) => {
  const { formatMessage } = useIntl();
  const { mutateAsync: deleteSalaryTemplateMutation } =
    useDeleteSalaryTemplateMutation();

  const handleDeleteReport = async () => {
    try {
      await deleteSalaryTemplateMutation(id);
      message.success(
        formatMessage({
          id: "salaryTemplate.deleteModal.message.success",
        })
      );
    } catch (error) {
      message.error(
        formatMessage({
          id: "salaryTemplate.deleteModal.message.error",
        })
      );
    }
  };
  return (
    <DeleteModal
      title={formatMessage({
        id: "salaryTemplate.deleteModal.title",
      })}
      handleOk={handleDeleteReport}
      id={`${id}_delete`}
      deleteingKey={templateName}
    />
  );
};

export default DeleteSalaryTemplate;
