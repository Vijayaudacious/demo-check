import { Input } from "@/Components/InputField";
import Modal from "@/Components/Modal";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/Hooks/categories";
import { Category } from "@/Types/Categories";
import { showErrorMessage } from "@/Utils/generic";
import { Col, Form, message } from "antd";
import { useEffect } from "react";
import { useIntl } from "react-intl";

interface CategoriesProps {
  showModal: boolean;
  categories?: Category;
  handleClose: () => void;
}

const AddCategory: React.FC<CategoriesProps> = ({
  showModal,
  categories,
  handleClose,
}) => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const isEditMode = Boolean(categories?._id);
  const { isLoading, mutateAsync: addCategoriesMutation } =
    useCreateCategoryMutation();
  const { isLoading: isUpdating, mutateAsync: updateCategoriesMutation } =
    useUpdateCategoryMutation();

  const handleAdd = async (values: Category) => {
    try {
      if (!isEditMode) {
        await addCategoriesMutation(values);
        message.success(
          formatMessage({
            id: "categories.form.messages.created.success",
          })
        );
      }
      if (isEditMode) {
        await updateCategoriesMutation({
          id: categories?._id || "",
          data: values,
        });
        message.success(
          formatMessage({
            id: "categories.form.messages.updated.success",
          })
        );
      }
    } catch (error) {
      showErrorMessage(error);
    }
    form.resetFields();
    handleClose();
  };

  useEffect(() => {
    if (isEditMode && categories) {
      form.setFieldsValue({
        name: categories?.name,
        description: categories?.description,
      });
    }
  }, [categories]);

  return (
    <Modal
      open={showModal}
      onCancel={() => {
        form.resetFields();
        handleClose();
      }}
      onOk={form.submit}
      title={
        <h3>
          {formatMessage({
            id: isEditMode
              ? "categories.form.title.update"
              : "categories.form.title.create",
          })}
        </h3>
      }
      okText={formatMessage({ id: "generic.save" })}
      okButtonProps={{
        loading: isLoading || isUpdating,
      }}
    >
      <Form
        name="Categories"
        onFinish={handleAdd}
        autoComplete="off"
        form={form}
        layout="vertical"
      >
        <Col lg={24} xs={24}>
          <Form.Item
            name="name"
            label={formatMessage({
              id: "categories.form.label.name.label",
            })}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: "categories.form.label.name.required",
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: "categories.form.label.name.placeholder",
              })}
            />
          </Form.Item>
        </Col>
        <Col lg={24} xs={24}>
          <Form.Item
            label={formatMessage({
              id: "categories.form.label.description.label",
            })}
            name="description"
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: "categories.form.label.description.required",
                }),
              },
            ]}
          >
            <Input
              type="textArea"
              placeholder={formatMessage({
                id: "categories.form.label.description.placeholder",
              })}
            />
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  );
};

export default AddCategory;
