import DeleteModal from "@/Components/DeleteModal";
import { useDeleteCategoryMutation } from "@/Hooks/categories";
import { showErrorMessage } from "@/Utils/generic";
import { message } from "antd";
import React from "react";
import { useIntl } from "react-intl";

interface DeleteCategoryProps {
  id: string;
  categoryName: string;
  isMobile?: boolean;
}

const DeleteCategory: React.FC<DeleteCategoryProps> = ({
  id,
  categoryName,
  isMobile,
}) => {
  const { formatMessage } = useIntl();
  const { mutateAsync: deleteCategoryMutation } = useDeleteCategoryMutation();

  const handleDeleteCategory = async () => {
    try {
      await deleteCategoryMutation(id);
      message.success(
        formatMessage({
          id: "categories.list.deleteModal.message.success",
        })
      );
    } catch (error) {
      showErrorMessage(error);
    }
  };

  return (
    <DeleteModal
      title={formatMessage({
        id: "categories.list.deleteModal.title",
      })}
      handleOk={handleDeleteCategory}
      id={`${id}_delete`}
      deleteingKey={categoryName}
      isMobile={isMobile}
    />
  );
};

export default DeleteCategory;
