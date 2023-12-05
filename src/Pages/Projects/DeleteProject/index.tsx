import DeleteModal from "@/Components/DeleteModal";
import { useRemoveProjectMutation } from "@/Hooks/project";
import { Alert, message } from "antd";
import React from "react";
import { useIntl } from "react-intl";
interface DeleteProjectProp {
  projectId: string;
  isMobileDelete?: boolean;
  projectName: string;
}
const DeleteProject: React.FC<DeleteProjectProp> = ({
  projectId,
  projectName,
  isMobileDelete,
}) => {
  const { mutateAsync: removeProjectMutation } = useRemoveProjectMutation();
  const { formatMessage } = useIntl();
  const handleDeleteProject = async () => {
    try {
      await removeProjectMutation(projectId);
      message.success(formatMessage({ id: "project.message.deleted" }));
    } catch (error) {
      message.error(formatMessage({ id: "project.delete.error" }));
    }
  };
  return (
    <DeleteModal
      title={formatMessage({ id: "project.delete.title" })}
      handleOk={handleDeleteProject}
      id={`${projectId}_delete`}
      isMobileDelete={isMobileDelete}
      deleteingKey={projectName}
      extra={
        <Alert
          message={formatMessage({ id: "project.delete.warning" })}
          type="warning"
          showIcon
          className="mb-3"
        />
      }
    />
  );
};

export default DeleteProject;
