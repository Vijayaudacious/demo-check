import { UserContext } from "@/Auth";
import DatePicker from "@/Components/DatePicker";
import { Input } from "@/Components/InputField";
import Modal from "@/Components/Modal";
import SelectUser from "@/Components/SelectUserInput";
import { DATE_FORMATS } from "@/Constant";
import { useCreateMyExpenses } from "@/Hooks/myExpenses";
import { MyAllExpenes } from "@/Types/MyExpenses";
import { showErrorMessage } from "@/Utils/generic";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Upload, UploadProps, message } from "antd";
import dayjs from "dayjs";
import { useContext, useMemo, useState } from "react";
import { useIntl } from "react-intl";

const { YEAR_MONTH_DAY, DAY_MONTH_YEAR } = DATE_FORMATS;

interface AddUpdateRequestProps {
  isOpen: boolean;
  handleClose: () => void;
}

const AddUpdateRequest: React.FC<AddUpdateRequestProps> = ({
  isOpen,
  handleClose,
}) => {
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();
  const { _id: loggedInUserId, organisationId } = useContext(UserContext);
  const [fileList, setFileList] = useState<any[]>([]);
  const { mutateAsync: createMyExpenses, isLoading: isCreating } =
    useCreateMyExpenses();

  const getValues = (values: Record<string, any>) => {
    const fd = new FormData();
    Object.keys(values).forEach((key: string) => {
      const value = values[key];
      if (value && key === "date") {
        fd.append(key, dayjs(value).format(YEAR_MONTH_DAY));
      } else if (value) {
        fd.append(key, value);
      }
    });
    fd.append("requstedBy", loggedInUserId);
    fd.append("organisationId", organisationId);
    if (fileList.length > 0) {
      fd.append("document", fileList[0]);
    }
    return fd;
  };

  const handleAddRequest = async (values: MyAllExpenes) => {
    try {
      await createMyExpenses(getValues(values));
      message.success(formatMessage({ id: "myexpenses.request.added" }));
      setFileList([]);
      form.resetFields();
      handleClose();
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const uploadProps: UploadProps = useMemo(
    () => ({
      accept: ".doc, .pdf, .jpg, .jpeg, .png",
      beforeUpload: (file) => {
        setFileList([file]);
        return false;
      },
      onRemove: (file) => {
        const newFileList = fileList.filter((item) => item !== file);
        setFileList(newFileList);
      },
    }),
    [fileList]
  );
  return (
    <Modal
      open={isOpen}
      onOk={form.submit}
      onCancel={() => {
        form.resetFields();
        handleClose();
      }}
      title={formatMessage({
        id: "myexpenses.request.title.add",
      })}
      okButtonProps={{
        loading: isCreating,
      }}
      okText={formatMessage({ id: "generic.save" })}
    >
      <Form layout="vertical" form={form} onFinish={handleAddRequest}>
        <Row gutter={15}>
          <Col lg={12} xs={24}>
            <Form.Item
              name="date"
              label={formatMessage({
                id: "myexpenses.request.form.date.label",
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "myexpenses.request.form.date.required",
                  }),
                },
              ]}
            >
              <DatePicker
                placeholder={formatMessage({
                  id: "myexpenses.request.form.date.placeholder",
                })}
                format={DAY_MONTH_YEAR}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              name="amount"
              label={formatMessage({
                id: "myexpenses.request.form.amount.label",
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "myexpenses.request.form.amount.required",
                  }),
                },
              ]}
            >
              <Input
                type="number"
                placeholder={formatMessage({
                  id: "myexpenses.request.form.amount.placeholder",
                })}
              />
            </Form.Item>
          </Col>
          <Col lg={24} xs={24}>
            <Form.Item
              name="reason"
              label={formatMessage({
                id: "myexpenses.request.form.reason.label",
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "myexpenses.request.form.reason.required",
                  }),
                },
              ]}
            >
              <Input
                type="textArea"
                placeholder={formatMessage({
                  id: "myexpenses.request.form.reason.placeholder",
                })}
              />
            </Form.Item>
          </Col>
          <Col lg={24} xs={24}>
            <Form.Item
              name="notifyTo"
              label={formatMessage({
                id: "myexpenses.request.form.notify.label",
              })}
            >
              <SelectUser
                mode="multiple"
                placeholder={formatMessage({
                  id: "myexpenses.request.form.notify.placeholder",
                })}
              />
            </Form.Item>
          </Col>
          <Col lg={24} xs={24}>
            <Form.Item
              name="document"
              label={formatMessage({
                id: "myexpenses.request.form.document.label",
              })}
            >
              <Upload fileList={fileList} {...uploadProps} maxCount={1}>
                <Button type="primary" icon={<UploadOutlined />}>
                  {formatMessage({
                    id: "myexpenses.request.form.document.placeholder",
                  })}
                </Button>
              </Upload>
              <Upload />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddUpdateRequest;
