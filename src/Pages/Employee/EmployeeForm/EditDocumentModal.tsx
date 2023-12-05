import { Input } from "@/Components/InputField";
import { editDocument } from "@/Services/Users";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, message, Upload } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./styles.module.less";
import Modal from "@/Components/Modal";

interface EditDocProp {
  modalVisible: boolean;
  handleClose: () => void;
  editingFileData: {
    docId: string;
    docName: string;
  };
}
const EditDocumentModal: React.FC<EditDocProp> = ({
  modalVisible,
  handleClose,
  editingFileData,
}) => {
  let { id }: any = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onEditDocumentFinish = async (values: any) => {
    const editdocfd = new FormData();
    editdocfd.append("name", values.name);
    values.document && editdocfd.append("document", values.document.file);
    editdocfd.append("_id", editingFileData.docId);
    try {
      setLoading(true);
      await editDocument(id, editdocfd);
      handleClose();
      message.success("Successfully Updated");
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
    }
    form.resetFields();
  };

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isValidateDocument, setIsValidateDocument] = useState(false);
  const uploadProps = useMemo(
    () => ({
      accept: ".doc, .pdf, .jpg, .jpeg, .png",
      beforeUpload: (file: any) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          setFileList((state) => [...state]);
          message.error(`Image must smaller than 2MB!`);
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
  const onCancelClick = () => {
    form.resetFields();
    handleClose();
  };
  return (
    <Modal
      open={modalVisible}
      title="Update Document"
      onOk={onCancelClick}
      onCancel={onCancelClick}
      footer={null}
    >
      <Form
        name="Update Document"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onEditDocumentFinish}
        initialValues={{ name: editingFileData.docName }}
        autoComplete="off"
      >
        <Form.Item label="File" name="document">
          <Upload fileList={fileList} maxCount={1} {...uploadProps}>
            <Button id="select_file" icon={<UploadOutlined />}>
              Please Select File
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="File Name"
          name="name"
          rules={[{ required: true, message: "Please enter file name" }]}
        >
          <Input id="file_name" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            id="edit_update"
            htmlType="submit"
            loading={loading}
            disabled={isValidateDocument}
          >
            Update
          </Button>
          <Button
            id="edit_cancal"
            className={styles.buttonCancal}
            onClick={() => onCancelClick()}
          >
            Cancal
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default EditDocumentModal;
