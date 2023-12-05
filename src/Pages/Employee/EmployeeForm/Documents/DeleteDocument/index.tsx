import DeleteModal from "@/Components/DeleteModal";
import { useRemoveDocumentMutation } from "@/Hooks/emloyee";
import { Document } from "@/Types/Employee";
import { message } from "antd";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
interface DeleteDocModalProps {
  document: Document;
}

const DeleteDocumentModal: React.FC<DeleteDocModalProps> = ({ document }) => {
  const { formatMessage } = useIntl();
  const { employeeId } = useParams();

  const { mutateAsync: removeDocumentMutation, isLoading } =
    useRemoveDocumentMutation();

  const handleDelete = async () => {
    try {
      await removeDocumentMutation({
        employeeId: employeeId || "",
        documentId: document._id,
      });
      message.success(
        formatMessage(
          {
            id: "employee.messages.document.delete",
          },
          {
            document: document.name || "document",
          }
        )
      );
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
    <DeleteModal
      title={formatMessage({
        id: "employee.messages.document.title",
      })}
      deleteingKey={document.name}
      handleOk={handleDelete}
      okButtonProps={{
        loading: isLoading,
      }}
    />
  );
};

export default DeleteDocumentModal;
