import { UserContext } from "@/Auth";
import { Input } from "@/Components/InputField";
import Modal from "@/Components/Modal";
import {
  useCreateSalaryTemplateMutation,
  useUpdateSalaryTemplateMutation,
} from "@/Hooks/templates";
import { Deduction, Earning, SalaryTemplate } from "@/Types/SalaryTemplate";
import { titleCase } from "@/Utils/generic";
import { Col, Form, Row, message } from "antd";
import { isEqual, lowerCase } from "lodash";
import { useContext, useEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import Actions from "./Actions";
import styles from "./styles.module.less";

const showLabel = (index: number, label: string) =>
  index == 0 ? label : false;

const useCheckPercentage = (value: Record<string, string>[], index: number) =>
  value && lowerCase(value[index]?.title) === "percentage" ? true : false;
interface SalaryTemplateProps {
  showModal: boolean;
  salaryTemplate?: SalaryTemplate;
  handleClose: () => void;
}

const AddSalaryTemplate: React.FC<SalaryTemplateProps> = ({
  showModal,
  salaryTemplate,
  handleClose,
}) => {
  const { organisationId } = useContext(UserContext);
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();
  const isEditMode = Boolean(salaryTemplate?._id);
  const { isLoading, mutateAsync: addSalaryTemplateMutation } =
    useCreateSalaryTemplateMutation();
  const { isLoading: isUpdating, mutateAsync: updateSalaryTemplateMutation } =
    useUpdateSalaryTemplateMutation();

  const handleAdd = async (values: SalaryTemplate) => {
    const payload = {
      ...values,
      earnings: values.earnings.map((earning) => ({
        ...earning,
        amount: Number(earning.amount),
      })),
      deductions: values.deductions.map((deduction) => ({
        ...deduction,
        amount: Number(deduction.amount),
      })),
      orgId: values.orgId || organisationId,
    };
    try {
      if (!isEditMode) {
        await addSalaryTemplateMutation(payload);
        message.success(
          formatMessage({ id: "salaryTemplate.messages.createdSuccess" })
        );
      }
      if (isEditMode) {
        await updateSalaryTemplateMutation({
          id: salaryTemplate?._id || "",
          data: payload,
        });
        message.success(
          formatMessage({ id: "salaryTemplate.messages.updatedSuccess" })
        );
      }
    } catch (error: any) {
      message.error(
        error.data.message ||
          formatMessage({
            id: "generic.errorMessage",
          })
      );
    }
    handleClose();
  };

  useEffect(() => {
    if (isEditMode && salaryTemplate) {
      form.setFieldsValue({
        templateName: salaryTemplate?.templateName,
        description: salaryTemplate?.description,
        earnings: salaryTemplate?.earnings?.map(
          (earning: Earning, index: Number) => ({
            title: earning.title,
            type: earning.type,
            amount: earning.amount,
            key: index,
          })
        ),
        deductions: salaryTemplate?.deductions?.map(
          (deduction: Deduction, index: Number) => ({
            title: deduction.title,
            type: deduction.type,
            amount: deduction.amount,
            key: index,
            deductionOn: deduction.deductionOn,
          })
        ),
      });
    }
    if (salaryTemplate === undefined) {
      form.resetFields();
    }
  }, [salaryTemplate]);

  const earnings = Form.useWatch("earnings", form);
  const deductions = Form.useWatch("deductions", form);

  const deductionOnOptions = useMemo(() => {
    const defaultOptions = [{ label: "Gross Salary", value: "grossSalary" }];
    const options = earnings
      ?.filter((value: Earning) => value?.title)
      .map((value: Earning) => ({
        label: titleCase(value.title),
        value: value.title,
      }));
    return options?.length ? defaultOptions.concat(options) : defaultOptions;
  }, [earnings]);

  return (
    <Modal
      open={showModal}
      onCancel={() => {
        handleClose();
      }}
      onOk={form.submit}
      title={
        <h3 className={styles.title}>
          {isEditMode
            ? formatMessage({ id: "salaryTemplate.form.title.update" })
            : formatMessage({ id: "salaryTemplate.form.title.create" })}
        </h3>
      }
      centered
      className={styles.modal}
      okText={formatMessage({ id: "generic.save" })}
      okButtonProps={{
        loading: isLoading || isUpdating,
      }}
      width={1000}
    >
      <Form
        name="SalaryTemplate"
        onFinish={handleAdd}
        autoComplete="off"
        form={form}
        initialValues={{
          earnings: [{ type: "fixed" }],
          deductions: [{ type: "fixed" }],
        }}
        layout="vertical"
      >
        <Col lg={24} xs={24}>
          <Form.Item
            name="templateName"
            label={formatMessage({
              id: "salaryTemplate.form.templateName.label",
            })}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: "salaryTemplate.form.templateName.required",
                }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({
                id: "salaryTemplate.form.templateName.placeholder",
              })}
            />
          </Form.Item>
        </Col>
        <Col lg={24} xs={24}>
          <Form.Item
            name="description"
            label={formatMessage({
              id: "salaryTemplate.form.description.label",
            })}
            rules={[
              {
                required: true,
                message: formatMessage({
                  id: "salaryTemplate.form.description.required",
                }),
              },
            ]}
          >
            <Input
              type="textArea"
              placeholder={formatMessage({
                id: "salaryTemplate.form.description.placeholder",
              })}
            />
          </Form.Item>
        </Col>
        <Form.Item
          label={formatMessage({
            id: "salaryTemplate.form.earnings.title",
          })}
        >
          <Form.List name="earnings">
            {(fields, { add, remove }) => (
              <div>
                {fields.map(({ key, name, ...restField }, index) => {
                  const isPercentage = useCheckPercentage(earnings, index);
                  return (
                    <Row gutter={16} key={index}>
                      <Col lg={7} xs={18}>
                        <Form.Item
                          {...restField}
                          name={[name, "type"]}
                          label={showLabel(
                            index,
                            formatMessage({
                              id: "salaryTemplate.form.earnings.type.label",
                            })
                          )}
                          rules={[
                            {
                              required: true,
                              message: formatMessage({
                                id: "salaryTemplate.form.earnings.type.required",
                              }),
                            },
                          ]}
                        >
                          <Input
                            type="select"
                            placeholder={formatMessage({
                              id: "salaryTemplate.form.earnings.type.placeholder",
                            })}
                            options={[
                              {
                                label: formatMessage({
                                  id: "salaryTemplate.form.earnings.type.options.percentage",
                                }),
                                value: "percentage",
                              },
                              {
                                label: formatMessage({
                                  id: "salaryTemplate.form.earnings.type.options.fixed",
                                }),
                                value: "fixed",
                              },
                            ]}
                            id="type"
                          />
                        </Form.Item>
                      </Col>
                      <Col lg={7} xs={18}>
                        <Form.Item
                          {...restField}
                          name={[name, "title"]}
                          label={showLabel(
                            index,
                            formatMessage({
                              id: "salaryTemplate.form.earnings.name.label",
                            })
                          )}
                          rules={[
                            {
                              required: true,
                              message: formatMessage({
                                id: "salaryTemplate.form.earnings.name.required",
                              }),
                            },
                          ]}
                        >
                          <Input
                            type="text"
                            placeholder={formatMessage({
                              id: "salaryTemplate.form.earnings.name.placeholder",
                            })}
                          />
                        </Form.Item>
                      </Col>
                      <Col lg={8} xs={18}>
                        <Form.Item
                          shouldUpdate={(prevValues, curValues) => {
                            return !isEqual(
                              prevValues.earnings[index],
                              curValues.earnings[index]
                            );
                          }}
                        >
                          {({ getFieldValue }) => {
                            const earnings = getFieldValue("earnings");

                            const isShowPercentage =
                              earnings?.length &&
                              earnings[index]?.type === "percentage"
                                ? true
                                : false;

                            return (
                              <Form.Item
                                {...restField}
                                name={[name, "amount"]}
                                label={showLabel(
                                  index,
                                  formatMessage({
                                    id: isPercentage
                                      ? "salaryTemplate.form.earnings.amount.label.percentage"
                                      : "salaryTemplate.form.earnings.amount.label.amount",
                                  })
                                )}
                                rules={[
                                  {
                                    required: true,
                                    message: formatMessage({
                                      id: isPercentage
                                        ? "salaryTemplate.form.earnings.amount.required.percentage"
                                        : "salaryTemplate.form.earnings.amount.required.amount",
                                    }),
                                  },
                                ]}
                                className={styles.amountInput}
                              >
                                <Input
                                  type="number"
                                  allowedCharacters={["."]}
                                  addonAfter={
                                    isShowPercentage ? <div>%</div> : null
                                  }
                                  placeholder={formatMessage({
                                    id: isPercentage
                                      ? "salaryTemplate.form.earnings.amount.placeholder.percentage"
                                      : "salaryTemplate.form.earnings.amount.placeholder.amount",
                                  })}
                                />
                              </Form.Item>
                            );
                          }}
                        </Form.Item>
                      </Col>
                      <Col
                        xl={2}
                        lg={2}
                        md={2}
                        xs={24}
                        className={styles.buttonSection}
                      >
                        <Actions
                          name={name}
                          actions={{ add, remove }}
                          length={fields.length}
                        />
                      </Col>
                    </Row>
                  );
                })}
              </div>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item
          label={formatMessage({
            id: "salaryTemplate.form.deductions.title",
          })}
        >
          <Form.List name="deductions">
            {(fields, { add, remove }) => (
              <div>
                {fields.map(({ key, name, ...restField }, index) => {
                  const isPercentage = useCheckPercentage(deductions, index);
                  return (
                    <Row gutter={16} key={index}>
                      <Col lg={5} xs={18}>
                        <Form.Item
                          {...restField}
                          label={showLabel(
                            index,
                            formatMessage({
                              id: "salaryTemplate.form.deductions.type.label",
                            })
                          )}
                          name={[name, "type"]}
                          rules={[
                            {
                              required: true,
                              message: formatMessage({
                                id: "salaryTemplate.form.deductions.type.required",
                              }),
                            },
                          ]}
                        >
                          <Input
                            type="select"
                            placeholder={formatMessage({
                              id: "salaryTemplate.form.deductions.type.placeholder",
                            })}
                            options={[
                              {
                                label: formatMessage({
                                  id: "salaryTemplate.form.earnings.type.options.percentage",
                                }),
                                value: "percentage",
                              },
                              {
                                label: formatMessage({
                                  id: "salaryTemplate.form.earnings.type.options.fixed",
                                }),
                                value: "fixed",
                              },
                            ]}
                            id="type"
                          />
                        </Form.Item>
                      </Col>
                      <Col lg={5} xs={18}>
                        <Form.Item
                          {...restField}
                          label={showLabel(
                            index,
                            formatMessage({
                              id: "salaryTemplate.form.deductions.name.label",
                            })
                          )}
                          name={[name, "title"]}
                          rules={[
                            {
                              required: true,
                              message: formatMessage({
                                id: "salaryTemplate.form.deductions.name.required",
                              }),
                            },
                          ]}
                        >
                          <Input
                            type="text"
                            placeholder={formatMessage({
                              id: "salaryTemplate.form.deductions.name.placeholder",
                            })}
                          />
                        </Form.Item>
                      </Col>
                      <Col lg={5} xs={18}>
                        <Form.Item
                          shouldUpdate={(prevValues, curValues) => {
                            return !isEqual(
                              prevValues.deductions[index],
                              curValues.deductions[index]
                            );
                          }}
                        >
                          {/* -------- */}
                          {({ getFieldValue }) => {
                            const deductions = getFieldValue("deductions");

                            const isShowPercentage =
                              deductions?.length &&
                              deductions[index]?.type === "percentage"
                                ? true
                                : false;

                            return (
                              <Form.Item
                                {...restField}
                                name={[name, "amount"]}
                                label={showLabel(
                                  index,
                                  formatMessage({
                                    id: isPercentage
                                      ? "salaryTemplate.form.deductions.amount.label.percentage"
                                      : "salaryTemplate.form.deductions.amount.label.amount",
                                  })
                                )}
                                rules={[
                                  {
                                    required: true,
                                    message: formatMessage({
                                      id: isPercentage
                                        ? "salaryTemplate.form.deductions.amount.required.percentage"
                                        : "salaryTemplate.form.deductions.amount.required.amount",
                                    }),
                                  },
                                ]}
                                className={styles.amountInput}
                              >
                                <Input
                                  type="number"
                                  allowedCharacters={["."]}
                                  addonAfter={
                                    isShowPercentage ? <div>%</div> : null
                                  }
                                  placeholder={formatMessage({
                                    id: isPercentage
                                      ? "salaryTemplate.form.deductions.amount.placeholder.percentage"
                                      : "salaryTemplate.form.deductions.amount.placeholder.amount",
                                  })}
                                />
                              </Form.Item>
                            );
                          }}
                        </Form.Item>
                      </Col>
                      <Col lg={7} xs={18}>
                        <Form.Item
                          name={[name, "deductionOn"]}
                          label={showLabel(index, "Deduction On")}
                          rules={[
                            {
                              required: true,
                              message: "Please select",
                            },
                          ]}
                        >
                          <Input
                            type="multiselect"
                            placeholder="Select"
                            options={deductionOnOptions}
                          />
                        </Form.Item>
                      </Col>
                      <Col
                        xl={2}
                        lg={2}
                        md={2}
                        xs={24}
                        className={styles.buttonSection}
                      >
                        <Actions
                          name={name}
                          actions={{ add, remove }}
                          length={fields.length}
                        />
                      </Col>
                    </Row>
                  );
                })}
              </div>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddSalaryTemplate;
