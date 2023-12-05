import DeleteModal from "@/Components/DeleteModal";
import { useRemoveReportMutation } from "@/Hooks/report";
import { showErrorMessage } from "@/Utils/generic";
import { message } from "antd";
import React from "react";

interface DeleteReportProps {
  reportId: string;
  isMobileDelete?: boolean;
}
const DeleteReport: React.FC<DeleteReportProps> = ({
  reportId,
  isMobileDelete,
}) => {
  const { mutateAsync: removeReportMutation } = useRemoveReportMutation();

  const handleDeleteReport = async () => {
    try {
      await removeReportMutation(reportId);
      message.success("Report Deleted Successfully");
    } catch (error) {
      showErrorMessage(error);
    }
  };
  return (
    <DeleteModal
      title="Do you want to remove this report?"
      handleOk={handleDeleteReport}
      id={`${reportId}_delete`}
      isMobileDelete={isMobileDelete}
    />
  );
};

export default DeleteReport;
