import DeleteModal from "@/Components/DeleteModal";
import { formatName } from "@/Components/Formats";
import { useDeleteIncomesExpenseMutation } from "@/Hooks/incomesExpenses";
import { showErrorMessage } from "@/Utils/generic";
import { message } from "antd";
import React from "react";
import { useIntl } from "react-intl";

interface DeleteIncomesExpensesProps {
  id: string;
  invoiceNo: string;
  incomesExpensesType: string;
}

const DeleteIncomesExpenses: React.FC<DeleteIncomesExpensesProps> = ({
  id,
  invoiceNo,
  incomesExpensesType,
}) => {
  const { formatMessage } = useIntl();
  const { mutateAsync: deleteIncomesExpenseMutation } =
    useDeleteIncomesExpenseMutation();

  const handleDeleteIncomesExpense = async () => {
    try {
      await deleteIncomesExpenseMutation(id);
      message.success(
        formatMessage(
          {
            id: "incomesExpenses.list.deleteModal.message.success",
          },
          {
            type: formatName(incomesExpensesType),
          }
        )
      );
    } catch (error) {
      showErrorMessage(error);
    }
  };

  return (
    <DeleteModal
      title={formatMessage(
        {
          id: "incomesExpenses.list.deleteModal.title",
        },
        {
          type: formatName(incomesExpensesType),
        }
      )}
      handleOk={handleDeleteIncomesExpense}
      id={`${id}_delete`}
      deleteingKey={invoiceNo}
    />
  );
};

export default DeleteIncomesExpenses;
