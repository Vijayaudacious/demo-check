import DatePicker from "@/Components/DatePicker";
import { formatName } from "@/Components/Formats";
import { Input } from "@/Components/InputField";
import Modal from "@/Components/Modal";
import SelectCategory from "@/Components/SelectCategoryInput";
import { DATE_FORMATS } from "@/Constant";
import {
  useCreateIncomesExpensesMutation,
  useUpdateIncomesExpensesMutation,
} from "@/Hooks/incomesExpenses";
import { Incomes } from "@/Types/incomes";
import { showErrorMessage } from "@/Utils/generic";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Upload, message } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import styles from "./styles.module.less";
import SelectUser from "@/Components/SelectUserInput";

interface IncomeExpenseProps {
  showModal: boolean;
  incomeExpense: Incomes;
  incomeExpenseType: string;
  handleClose: () => void;
}

interface IncomesKeys {
  _id: string;
  date: string;
  category: string;
}

const { YEAR_MONTH_DAY, DAY_MONTH_YEAR } = DATE_FORMATS;

const AddIncomeExpense: React.FC<IncomeExpenseProps> = ({
  showModal,
  incomeExpense,
  handleClose,
  incomeExpenseType,
}) => {
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const isEditMode = Boolean(incomeExpense?._id);
  const [fileList, setFileList] = useState([] as any);
  const logoBaseURL = process.env.REACT_APP_BASE_API || "";
  const { isLoading, mutateAsync: createIncomesExpensesMutation } =
    useCreateIncomesExpensesMutation();
  const { isLoading: isUpdating, mutateAsync: updateIncomesExpensesMutation } =
    useUpdateIncomesExpensesMutation();

  const getDetails = (details: Record<string, any>) => {
    const fd: any = new FormData();
    fd.append("type", incomeExpenseType);
    Object.keys(details).forEach((key: string) => {
      const value = details[key];
      if (key === "date") {
        fd.append(key, dayjs(value).format(YEAR_MONTH_DAY));
      } else if (key === "document") {
        fileList[0]?.originFileObj
          ? fd.append("document", fileList[0]?.originFileObj)
          : fd.append(
              "document",
              incomeExpense?.document ? incomeExpense?.document : ""
            );
      } else {
        fd.append(key, value);
      }
    });
    return fd;
  };

  const handleAdd = async (values: Incomes) => {
    const fd = getDetails(values);
    try {
      if (isEditMode) {
        await updateIncomesExpensesMutation({
          id: incomeExpense._id || "",
          formData: fd,
        });
        message.success(
          formatMessage(
            {
              id: "incomesExpenses.form.messages.updated.success",
            },
            {
              type: formatName(incomeExpenseType),
            }
          )
        );
      } else {
        await createIncomesExpensesMutation(fd);
        message.success(
          formatMessage(
            {
              id: "incomesExpenses.form.messages.created.success",
            },
            {
              type: formatName(incomeExpenseType),
            }
          )
        );
      }
    } catch (error) {
      showErrorMessage(error);
    }
    handleClose();
  };

  const onUploadChange = (info: UploadChangeParam) => {
    setFileList([...info.fileList]);
  };

  const uploadProps = useMemo(
    () => ({
      beforeUpload: (file: File) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          return false;
        }
        return false;
      },
    }),
    [fileList]
  );
  useEffect(() => {
    if (isEditMode && incomeExpense) {
      Object.keys(incomeExpense).forEach((key) => {
        const value = incomeExpense[key as keyof IncomesKeys];
        if (value !== undefined) {
          form.setFieldsValue({
            [key]: key === "date" ? dayjs(value) : value,
          });
        }
      });
    }
    if (incomeExpense === null) {
      form.resetFields();
      setFileList([]);
    }
  }, [incomeExpense]);

  useEffect(() => {
    if (
      incomeExpense &&
      incomeExpense?.document &&
      incomeExpense.document.length > 0
    ) {
      setFileList([
        {
          uid: "1",
          name: incomeExpense?.document[0]?.file.slice(
            incomeExpense?.document[0]?.file.lastIndexOf("_") + 1
          ),
          status: "done",
          url: `${logoBaseURL}${incomeExpense?.document[0]?.file}`,
        },
      ]);
    }
  }, [incomeExpense?.document]);

  return (
    <Modal
      open={showModal}
      onCancel={() => {
        handleClose();
      }}
      className={styles.modal}
      onOk={form.submit}
      title={formatMessage(
        {
          id: incomeExpense?._id
            ? "incomesExpenses.form.title.update"
            : "incomesExpenses.form.title.create",
        },
        {
          type: formatName(incomeExpenseType),
        }
      )}
      okText={formatMessage({ id: "generic.save" })}
      okButtonProps={{
        loading: isLoading || isUpdating,
      }}
    >
      <Form
        name="incomesExpenses"
        onFinish={handleAdd}
        autoComplete="off"
        form={form}
        layout="vertical"
        initialValues={{ date: dayjs(), description: "" }}
      >
        <Row gutter={16}>
          <Col lg={12} xs={24}>
            <Form.Item
              name="invoiceNo"
              label={formatMessage({
                id: "incomesExpenses.form.invoiceNo.label",
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "incomesExpenses.form.invoiceNo.required",
                  }),
                },
              ]}
            >
              <Input
                placeholder={formatMessage({
                  id: "incomesExpenses.form.invoiceNo.placeholder",
                })}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              name="date"
              label={formatMessage({
                id: "incomesExpenses.form.date.label",
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "incomesExpenses.form.date.required",
                  }),
                },
              ]}
            >
              <DatePicker
                placeholder={formatMessage({
                  id: "incomesExpenses.form.date.placeholder",
                })}
                format={DAY_MONTH_YEAR}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              name="category"
              label={formatMessage({
                id: "incomesExpenses.form.category.label",
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "incomesExpenses.form.category.required",
                  }),
                },
              ]}
            >
              <SelectCategory
                placeholder={formatMessage({
                  id: "incomesExpenses.form.category.placeholder",
                })}
              />
            </Form.Item>
          </Col>
          {incomeExpenseType === "expenses" ? (
            <Col lg={12} xs={24}>
              <Form.Item
                name="expensesBy"
                label={formatMessage({
                  id: "incomesExpenses.form.expensesBy.label",
                })}
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: "incomesExpenses.form.expensesBy.required",
                    }),
                  },
                ]}
              >
                <SelectUser
                  placeholder={formatMessage({
                    id: "incomesExpenses.form.expensesBy.placeholder",
                  })}
                />
              </Form.Item>
            </Col>
          ) : null}
          <Col lg={12} xs={24}>
            <Form.Item
              name="mode"
              label={formatMessage({
                id: "incomesExpenses.form.modeOfIncome.label",
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "incomesExpenses.form.modeOfIncome.required",
                  }),
                },
              ]}
            >
              <Input
                placeholder={formatMessage({
                  id: "incomesExpenses.form.modeOfIncome.placeholder",
                })}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              name="amount"
              label={formatMessage({
                id: "incomesExpenses.form.amount.label",
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "incomesExpenses.form.amount.required",
                  }),
                },
              ]}
            >
              <Input
                type="number"
                placeholder={formatMessage({
                  id: "incomesExpenses.form.amount.placeholder",
                })}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              name="description"
              label={formatMessage({
                id: "incomesExpenses.form.description.label",
              })}
            >
              <Input
                type="textArea"
                placeholder={formatMessage({
                  id: "incomesExpenses.form.description.placeholder",
                })}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              name="document"
              label={formatMessage({
                id: "incomesExpenses.form.uploadFile.label",
              })}
            >
              <Upload
                className="upload-list-inline"
                listType="picture"
                maxCount={1}
                fileList={fileList}
                {...uploadProps}
                onChange={onUploadChange}
                id="document"
              >
                <Button icon={<UploadOutlined />} id="document">
                  {formatMessage({
                    id: "incomesExpenses.form.uploadFile.buttonTitle",
                  })}
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddIncomeExpense;
