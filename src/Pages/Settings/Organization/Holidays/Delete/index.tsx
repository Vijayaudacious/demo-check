import DeleteModal from "@/Components/DeleteModal";
import { useDeleteHolidayMutation } from "@/Hooks/organization";
import { showErrorMessage } from "@/Utils/generic";
import { message } from "antd";
import { ReactNode } from "react";
import { useIntl } from "react-intl";

interface DeleteHolidayProps {
  holidayId: string;
  holidayName: string;
  icon?: ReactNode;
  title: ReactNode;
  disabled?: boolean;
  okButton?: string;
  cancelButton?: string;
  canDelete?: any;
}

const DeleteHoliday: React.FC<DeleteHolidayProps> = ({
  holidayId,
  holidayName,
  icon,
  title,
  disabled,
  cancelButton,
  okButton,
  canDelete,
}) => {
  const { mutateAsync: deleteHolidayMutation } = useDeleteHolidayMutation();
  const { formatMessage } = useIntl();
  const handleDeleteHoliday = async () => {
    try {
      await deleteHolidayMutation(holidayId);
      {
        canDelete
          ? message.success(
              formatMessage({
                id: "holiday.deleteModal.cancelSuccess",
              })
            )
          : message.success(
              formatMessage({
                id: "holiday.deleteModal.success",
              })
            );
      }
    } catch (error) {
      showErrorMessage(error);
    }
  };
  return (
    <DeleteModal
      title={title}
      isDisable={disabled}
      handleOk={handleDeleteHoliday}
      id={`${holidayId}_delete`}
      deleteingKey={holidayName}
      customIcon={icon}
      okButtonText={okButton}
      cancelButtonText={cancelButton}
    />
  );
};

export default DeleteHoliday;
