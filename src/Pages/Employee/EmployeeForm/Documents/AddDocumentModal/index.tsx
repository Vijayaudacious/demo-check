import { Input } from "@/Components/InputField";
import Modal from "@/Components/Modal";
import {
  useAddDocumentMutation,
  useUpdateDocumentMutation,
} from "@/Hooks/emloyee";
import { Document } from "@/Types/Employee";
import { InboxOutlined } from "@ant-design/icons";
import { Form, Upload, message } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

const { Dragger } = Upload;

interface AddDocumentModalProps {
  showModal: boolean;
  handleClose: () => void;
  document?: Document;
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  showModal,
  handleClose,
  document,
}) => {
  const { employeeId } = useParams();
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isValidateDocument, setIsValidateDocument] = useState(false);
  const { mutateAsync: addDocumentMutation, isLoading } =
    useAddDocumentMutation();
  const { mutateAsync: updateDocumentMutation, isLoading: isUpdating } =
    useUpdateDocumentMutation();

  const isEditMode = Boolean(document);

  useEffect(() => {
    if (document) {
      form.setFieldsValue({
        documentName: document.name,
      });
      setFileList([]);
    }
  }, [document, showModal]);

  const uploadProps = useMemo(
    () => ({
      accept: ".doc, .pdf, .jpg, .jpeg, .png",
      beforeUpload: (file: any) => {
        setFileList([]);
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          setFileList((state) => [...state]);
          message.error(
            formatMessage({
              id: "employee.messages.document.limit",
            })
          );
          setIsValidateDocument(true);
          return false;
        }
        setFileList((state) => [...state, file]);
        setIsValidateDocument(false);
        return false;
      },
      onRemove: (file: UploadFile) => {
        if (fileList.some((item) => item.uid === file.uid)) {
          setFileList((fileList) =>
            fileList.filter((item) => item.uid !== file.uid)
          );
          return true;
        }
        return false;
      },
    }),
    [fileList, isValidateDocument]
  );

  const handleAddDocument = async (data: {
    documentName: string;
    document: any;
  }) => {
    const fd = new FormData();
    fd.append("document", data.document.file);
    fd.append("documentName", data.documentName);
    try {
      await addDocumentMutation({ id: employeeId || "", data: fd });
      message.success(
        formatMessage(
          {
            id: "employee.messages.document.add",
          },
          {
            document: data?.documentName || "document",
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
    onCancelClick();
  };

  const handleUpdateDocument = async (data: {
    documentName: string;
    document: any;
  }) => {
    const fd = new FormData();
    fd.append("document", data.document.file);
    fd.append("documentName", data.documentName);

    try {
      await updateDocumentMutation({
        employeeId: employeeId || "",
        documentId: document?._id || "",
        data: fd,
      });
      message.success(
        formatMessage(
          {
            id: "employee.messages.document.update",
          },
          {
            document: data?.documentName || "document",
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
    onCancelClick();
  };

  const onCancelClick = () => {
    form.resetFields();
    setFileList([]);
    handleClose();
  };
  return (
    <Modal
      open={showModal}
      title={formatMessage({
        id: isEditMode
          ? "employee.form.documents.title.update"
          : "employee.form.documents.title.add",
      })}
      onOk={() => form.submit()}
      onCancel={onCancelClick}
      centered
      okButtonProps={{
        loading: isLoading || isUpdating,
      }}
      okText={formatMessage({ id: "generic.save" })}
    >
      <Form
        form={form}
        onFinish={isEditMode ? handleUpdateDocument : handleAddDocument}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label={formatMessage({
            id: "employee.form.documents.form.documentName.label",
          })}
          name="documentName"
          rules={[{ required: true, message: "Please enter file name" }]}
        >
          <Input
            id="file_name"
            placeholder={formatMessage({
              id: "employee.form.documents.form.documentName.placeholder",
            })}
          />
        </Form.Item>
        <Form.Item name="document">
          <Dragger fileList={fileList} maxCount={1} {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddDocumentModal;
