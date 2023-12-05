import Icon, { CancelIcon } from "@/Assets/Images";
import DatePicker from "@/Components/DatePicker";
import { Input } from "@/Components/InputField";
import Modal from "@/Components/Modal";
import { DATE_FORMATS } from "@/Constant";
import {
  useAddHolidayMutation,
  useUpdateHolidayMutation,
} from "@/Hooks/organization";
import { GetHoliday, Holiday } from "@/Types/Attendance";
import { Checkbox, Col, Form, Radio, Row, Space, message } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import styles from "./styles.module.less";
import { showErrorMessage } from "@/Utils/generic";

const { YEAR_MONTH_DAY } = DATE_FORMATS;

interface HolidayProps {
  showModal: boolean;
  holiday?: GetHoliday;
  handleClose: () => void;
}

const AddHoliday: React.FC<HolidayProps> = ({
  showModal,
  holiday,
  handleClose,
}) => {
  const [form] = Form.useForm();
  const [repeat, setRepeat] = useState(false);
  const { isLoading, mutateAsync: addHolidayMutation } =
    useAddHolidayMutation();
  const { isLoading: isUpdating, mutateAsync: updateHolidayMutation } =
    useUpdateHolidayMutation();
  const { formatMessage } = useIntl();
  const isEditMode = Boolean(holiday?._id);

  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({
        title: holiday?.title || "",
        startDate: dayjs(holiday?.startDate, YEAR_MONTH_DAY),
        description: holiday?.description || "",
        cycle: holiday?.occurenece?.cycle || "",
      });
      setRepeat(holiday?.repeat || false);
    }
    if (holiday === undefined) {
      form.resetFields();
      setRepeat(false);
    }
  }, [holiday]);

  const getFormData = (values: Holiday) => {
    const { startDate, cycle } = values;
    return {
      ...values,
      startDate: dayjs(startDate).format(YEAR_MONTH_DAY),
      endDate: dayjs(startDate).format(YEAR_MONTH_DAY),
      ...(!repeat ? { cycle: "once" } : { cycle }),
      repeat,
    };
  };

  const handleAdd = async (values: Holiday) => {
    try {
      await addHolidayMutation(getFormData(values));
      message.success(
        formatMessage({
          id: "settings.holidays.add.modal.add.success",
        })
      );
    } catch (error) {
      showErrorMessage(error);
    }
    handleClose();
  };

  const handleEdit = async (values: Holiday) => {
    try {
      await updateHolidayMutation({
        id: holiday?._id || "",
        data: getFormData(values),
      });
      message.success(
        formatMessage({
          id: "settings.holidays.add.modal.edit.success",
        })
      );
    } catch (error) {
      showErrorMessage(error);
    }
    handleClose();
  };
  return (
    <Modal
      open={showModal}
      onCancel={() => handleClose()}
      onOk={form.submit}
      title={
        <h3 className={styles.title}>
          {isEditMode
            ? formatMessage({
                id: "settings.holidays.add.modal.edit.title",
              })
            : formatMessage({
                id: "settings.holidays.add.modal.add.title",
              })}
        </h3>
      }
      centered
      className={styles.modal}
      okText={formatMessage({ id: "generic.save" })}
      okButtonProps={{
        loading: isUpdating || isLoading,
      }}
      closeIcon={<Icon icon={CancelIcon} />}
    >
      <Form
        initialValues={{ cycle: "yearly" }}
        form={form}
        onFinish={isEditMode ? handleEdit : handleAdd}
        layout="vertical"
      >
        <Row>
          <Col lg={24} xs={24}>
            <Form.Item
              name="title"
              label={formatMessage({
                id: "settings.holidays.add.form.title.label",
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "settings.holidays.add.form.title.required",
                  }),
                },
              ]}
            >
              <Input
                placeholder={formatMessage({
                  id: "settings.holidays.add.form.title.placeholder",
                })}
              />
            </Form.Item>
          </Col>
          <Col lg={24} sm={24} xs={24}>
            <Form.Item
              label={formatMessage({
                id: "settings.holidays.add.form.date.label",
              })}
              name="startDate"
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "settings.holidays.add.form.date.required",
                  }),
                },
              ]}
            >
              <DatePicker
                placeholder={formatMessage({
                  id: "settings.holidays.add.form.date.placeholder",
                })}
                className="w-100"
              />
            </Form.Item>
          </Col>

          <Col lg={24} xs={24}>
            <Form.Item
              name="description"
              label={formatMessage({
                id: "settings.holidays.add.form.description.label",
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "settings.holidays.add.form.description.required",
                  }),
                },
              ]}
            >
              <Input
                type="textArea"
                placeholder={formatMessage({
                  id: "settings.holidays.add.form.description.placeholder",
                })}
              />
            </Form.Item>
          </Col>
          <Col lg={24} xs={24} className={styles.radioGroup}>
            <Space direction="vertical" align="center">
              <Checkbox
                onChange={({ target: { checked } }: CheckboxChangeEvent) =>
                  setRepeat(checked)
                }
                checked={repeat}
              >
                {formatMessage({
                  id: "settings.holidays.add.form.repeat.label",
                })}
              </Checkbox>
              {repeat && (
                <Form.Item name="cycle">
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="daily">Daily</Radio.Button>
                    <Radio.Button value="weekly">Weekly</Radio.Button>
                    <Radio.Button value="monthly">Monthly</Radio.Button>
                    <Radio.Button value="yearly">Yearly</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              )}
            </Space>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddHoliday;
