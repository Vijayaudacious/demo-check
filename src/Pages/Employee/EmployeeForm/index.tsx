import DatePicker from "@/Components/DatePicker";
import { formatName } from "@/Components/Formats";
import { Input } from "@/Components/InputField";
import { Loader } from "@/Components/Loader";
import SelectRoles from "@/Components/SelectRoleInput";
import SelectUser from "@/Components/SelectUserInput";
import { DATE_FORMATS } from "@/Constant";
import {
  useCreateUserMutation,
  useDeleteDocumentMutation,
  useUpdateUserMutation,
} from "@/Hooks/emloyee";
import { Role } from "@/Types/Employee";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Modal,
  PageHeader,
  Row,
  Tooltip,
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";
import last from "lodash/last";
import split from "lodash/split";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditDocumentModal from "./EditDocumentModal";
import styles from "./styles.module.less";

interface EmployeeFormProps {
  showHeader?: boolean;
  initialValues?: any;
  refetchUser?: any;
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
    },
  },
};
const baseURL = process.env.REACT_APP_BASE_API;

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  showHeader = true,
  initialValues: data,
  refetchUser,
}) => {
  const [form] = Form.useForm();
  const { id } = useParams() as { id: string };
  const { formatMessage } = useIntl();
  const [modalVisible, setModalVisible] = useState(false);
  const [showUploadedDocument, setShowUploadedDocument] = useState<any>([]);
  const [editingFileData, setEditingFileData] = useState({
    docId: "",
    docName: "",
  });
  const [handleNextDoc, setHandleNextDoc] = useState<any>(false);
  const [handleNextDocType, setHandleNextDocType] = useState<any>(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const navigate = useNavigate();

  const docAuth = handleNextDocType && handleNextDoc;

  const setInitialValues = useCallback(() => {
    if (!data) {
      return;
    }

    setShowUploadedDocument(data?.document);
    const {
      title,
      name,
      email,
      contactNumber,
      gender,
      dob,
      fatherName,
      manager,
      localAddress,
      permanentAddress,
      panCard,
      joiningDate,
      maritialStatus,
      allocatedLeaves,
      roles,
      salary,
      employeeCode,
      document: documents,
    } = data;
    form.setFieldsValue({
      title: title,
      name: name,
      fatherName,
      manager,
      email,
      contactNumber,
      gender: formatName(gender),
      dob: dob && dayjs(dob),
      joiningDate: joiningDate && dayjs(joiningDate),
      maritialStatus: formatName(maritialStatus),
      localAddress,
      permanentAddress,
      panCard,
      allocatedLeaves,
      salary,
      employeeCode,
      roles: (roles || []).map(({ _id }: Role) => _id),
      documents: (documents || []).map((item: any) => {
        return {
          ...item,
          first: item.name,
          Upload: item.file,
        };
      }),
    });
    form.setFieldsValue(documents[0]?.first);
    for (const key in { documents }) {
      if (Object.prototype.hasOwnProperty.call({ documents }, key)) {
        form.setFieldsValue({ documents }[key]?.first);
      }
    }
  }, [data]);

  useEffect(() => {
    setInitialValues();
  }, [setInitialValues]);

  const documents = useMemo(() => {
    const resultedFileArr = showUploadedDocument.map(({ file }: any) => file);
    const uploadedDocs = [];
    for (let i = 0; i < resultedFileArr.length; i++) {
      const obj: any = {};
      obj["uid"] = Math.random();
      obj["name"] = last(split(resultedFileArr[i], "_"));
      obj["url"] = `${baseURL}${resultedFileArr[i]}`;
      uploadedDocs.push(obj);
    }
    return uploadedDocs;
  }, [showUploadedDocument, id]);

  const { mutateAsync: addUserMutation, isLoading: isCreating } =
    useCreateUserMutation();
  const { mutateAsync: updateUserMutation, isLoading: isUpdating } =
    useUpdateUserMutation();
  const { mutateAsync: deleteDocumentMutation } = useDeleteDocumentMutation();

  const loading = isCreating || isUpdating;

  const onFinish = async (values: any) => {
    const fd: any = new FormData();

    Object.keys(values).forEach((key) => {
      const value = values[key];
      if (key === "allocatedLeaves") {
        fd.append(key, value ? value : "2");
      } else if (key === "dob" || key === "joiningDate") {
        value && fd.append(key, dayjs(value).format("YYYY-MM-DD"));
      } else if (key === "roles") {
        fd.append(key, value ? JSON.stringify(value) : []);
      } else if (key === "documents") {
        const documentName = value?.map(
          (data: any) => data?.Upload?.file && data?.first
        );
        const filteredDocumentName = documentName?.filter(
          (documentName: []) => documentName
        );
        filteredDocumentName &&
          fd.append("documentName", JSON.stringify(filteredDocumentName));
        value?.map(({ Upload }: any) => fd.append("document", Upload.file));
      } else {
        value && fd.append(key, value);
      }
    });

    try {
      if (!id) {
        await addUserMutation(fd);
        message.success(
          formatMessage({
            id: "employee.messages.create",
          })
        );
      } else {
        await updateUserMutation({ id, formData: fd });
        message.success(
          formatMessage({
            id: "employee.messages.update",
          })
        );
        if (refetchUser) {
          refetchUser();
        }
      }
      navigate("/employees");
    } catch (error: any) {
      message.error(error.response.data.message);
    }
  };

  const deleteDocument = async (name: any) => {
    Modal.confirm({
      title: formatMessage({
        id: "employee.messages.document.title",
      }),
      centered: true,
      icon: <DeleteOutlined className={styles.deleteColor} />,
      okText: formatMessage({
        id: "generic.yes",
      }),
      cancelText: formatMessage({
        id: "generic.no",
      }),
      okButtonProps: {
        id: "remove_yes",
        danger: true,
      },
      cancelButtonProps: {
        id: "remove_no",
      },
      onOk: async () => {
        try {
          const { data }: any = await deleteDocumentMutation({
            id,
            documentId: {
              docId: showUploadedDocument[name]?._id,
            },
          });
          if (refetchUser) {
            refetchUser();
          }
          message.success(data.message);
        } catch (error: any) {
          message.error(error.message);
        }
      },
    });
  };

  const showModal = (name: any) => {
    setEditingFileData({
      ...editingFileData,
      docId: showUploadedDocument[name]._id,
      docName: showUploadedDocument[name].name,
    });
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(!modalVisible);
    setIsHide(false);
  };

  const [isHide, setIsHide] = useState(false);

  const uploadProps = useMemo(
    () => ({
      accept: ".doc, .pdf, .jpg, .jpeg, .png",
      beforeUpload: (file: any) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          setHandleNextDoc(false);
          message.error(
            formatMessage({
              id: "employee.messages.document.limit",
            }),
            10
          );
          setIsHide(true);
          return false;
        }

        setIsHide(false);
        setHandleNextDoc(true);

        return false;
      },
    }),
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const localAddress = form.getFieldValue("localAddress");
      const permanentAddress = form.getFieldValue("permanentAddress");
      if (localAddress && permanentAddress) {
        setIsCheckboxChecked(localAddress === permanentAddress);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [form]);

  return (
    <div>
      <Col flex="auto" className={styles.addemployeeSection}>
        <div className={styles.loader}>
          <Loader isLoading={loading} />
        </div>
        {showHeader && (
          <PageHeader
            ghost={false}
            title={formatMessage({
              id: id ? "employee.title.update" : "employee.title.new",
            })}
          />
        )}
        <div className={styles.innerSection}>
          <div className={styles.sectionInner}>
            <Form
              form={form}
              name="register"
              id="register_form"
              onFinish={onFinish}
              className={styles.loginForm}
              layout="vertical"
              initialValues={{
                allocatedLeaves: 2,
                userType: "employee",
                joiningDate: dayjs(),
              }}
              scrollToFirstError
            >
              <Row gutter={16}>
                <Col lg={12} xs={24}>
                  <Form.Item
                    label={formatMessage({
                      id: "employee.form.name.label",
                    })}
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: "employee.form.name.required",
                        }),
                      },
                    ]}
                  >
                    <Input
                      id="register_name"
                      type="text"
                      placeholder={formatMessage({
                        id: "employee.form.name.placeholder",
                      })}
                    />
                  </Form.Item>
                </Col>
                <Col lg={4} xs={24}>
                  <Form.Item
                    label={formatMessage({
                      id: "employee.form.fatherName.label",
                    })}
                    name="fatherName"
                  >
                    <Input
                      id="register_father_name"
                      type="text"
                      placeholder={formatMessage({
                        id: "employee.form.fatherName.placeholder",
                      })}
                    />
                  </Form.Item>
                </Col>
                <Col lg={4} xs={24}>
                  <Form.Item
                    label={formatMessage({
                      id: "employee.form.panCard.label",
                    })}
                    name="panCard"
                  >
                    <Input
                      placeholder={formatMessage({
                        id: "employee.form.panCard.placeholder",
                      })}
                      id="panCard"
                    />
                  </Form.Item>
                </Col>
                <Col lg={4} xs={24}>
                  <Form.Item
                    label={formatMessage({
                      id: "employee.form.salary.label",
                    })}
                    name="salary"
                  >
                    <Input
                      placeholder={formatMessage({
                        id: "employee.form.salary.placeholder",
                      })}
                      id="salary"
                      type="number"
                    />
                  </Form.Item>
                </Col>
                <Col lg={12} xs={24}>
                  <Form.Item
                    label={formatMessage({
                      id: "employee.form.email.label",
                    })}
                    name="email"
                    rules={[
                      {
                        type: "email",
                        message: formatMessage({
                          id: "employee.form.email.required",
                        }),
                      },
                      {
                        required: true,
                        message: formatMessage({
                          id: "employee.form.email.validmail",
                        }),
                      },
                    ]}
                  >
                    <Input
                      type="email"
                      placeholder={formatMessage({
                        id: "employee.form.email.placeholder",
                      })}
                      id="register_email"
                    />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={24}>
                  <Form.Item
                    label={formatMessage({
                      id: "employee.form.contactNumber.label",
                    })}
                    name="contactNumber"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: "employee.form.contactNumber.required",
                        }),
                      },
                      {
                        pattern: new RegExp(
                          /^(?:(?:\+|0{0,2},[a-zA-Z])91(\s*[\-]\s*)?)?[6789]\d{9}$/
                        ),
                        max: 10,
                        message: formatMessage({
                          id: "employee.form.contactNumber.validnumber",
                        }),
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      placeholder={formatMessage({
                        id: "employee.form.contactNumber.placeholder",
                      })}
                      id="register_number"
                    />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={24}>
                  <Form.Item
                    label={formatMessage({
                      id: "employee.form.allocatedLeaves.label",
                    })}
                    name="allocatedLeaves"
                  >
                    <Input
                      type="number"
                      id="register_leaves"
                      placeholder={formatMessage({
                        id: "employee.form.allocatedLeaves.label",
                      })}
                    />
                  </Form.Item>
                </Col>
                <Col lg={12} xs={24}>
                  <Form.Item
                    label={formatMessage({
                      id: "employee.form.roles.label",
                    })}
                    name="roles"
                    rules={[
                      {
                        type: "array",
                      },
                    ]}
                  >
                    <SelectRoles id="register_roles" />
                  </Form.Item>
                </Col>
                <Col lg={12} xs={24}>
                  <Form.Item
                    label={formatMessage({
                      id: "employee.form.manager.label",
                    })}
                    name="manager"
                  >
                    <SelectUser id="manager_name" />
                  </Form.Item>
                </Col>
                <Col lg={4} xs={24}>
                  <Form.Item
                    name="employeeCode"
                    label={formatMessage({
                      id: "employee.form.employeeCode.label",
                    })}
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: "employee.form.employeeCode.required",
                        }),
                      },
                    ]}
                  >
                    <Input
                      placeholder={formatMessage({
                        id: "employee.form.employeeCode.placeholder",
                      })}
                      id="employeeCode"
                      type="number"
                    />
                  </Form.Item>
                </Col>
                <Col lg={4} xs={24}>
                  <Form.Item
                    name="gender"
                    label={formatMessage({
                      id: "employee.form.gender.label",
                    })}
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: "employee.form.gender.required",
                        }),
                      },
                    ]}
                  >
                    <Input
                      type="select"
                      placeholder={formatMessage({
                        id: "employee.form.gender.placeholder",
                      })}
                      id="register_gender"
                      options={[
                        {
                          label: formatMessage({
                            id: "employee.form.gender.options.male",
                          }),
                          value: "Male",
                        },
                        {
                          label: formatMessage({
                            id: "employee.form.gender.options.female",
                          }),
                          value: "Female",
                        },
                        {
                          label: formatMessage({
                            id: "employee.form.gender.options.other",
                          }),
                          value: "Other",
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col lg={4} xs={24}>
                  <Form.Item
                    name="maritialStatus"
                    label={formatMessage({
                      id: "employee.form.maritialStatus.label",
                    })}
                  >
                    <Input
                      type="select"
                      id="marital_status"
                      placeholder={formatMessage({
                        id: "employee.form.maritialStatus.placeholder",
                      })}
                      options={[
                        {
                          label: formatMessage({
                            id: "employee.form.maritialStatus.options.unmarried",
                          }),
                          value: "unmarried",
                        },
                        {
                          label: formatMessage({
                            id: "employee.form.maritialStatus.options.married",
                          }),
                          value: "married",
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={24}>
                  <Form.Item
                    name="dob"
                    label={formatMessage({
                      id: "employee.form.dob.label",
                    })}
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: "employee.form.dob.required",
                        }),
                      },
                    ]}
                  >
                    <DatePicker
                      className={styles.loginInput}
                      id="register_dob"
                      placeholder={formatMessage({
                        id: "employee.form.dob.placeholder",
                      })}
                      format="DD-MM-YYYY"
                      disabledDate={(d) =>
                        !d ||
                        d.isAfter(
                          dayjs().subtract(18, "year").format("YYYY-MM-DD")
                        ) ||
                        d.isSame(
                          dayjs().subtract(60, "year").format("YYYY-MM-DD")
                        ) ||
                        d.isBefore(
                          dayjs().subtract(60, "year").format("YYYY-MM-DD")
                        )
                      }
                      defaultPickerValue={dayjs().subtract(18, "years")}
                    />
                  </Form.Item>
                </Col>
                <Col lg={6} xs={24}>
                  <Form.Item
                    name="joiningDate"
                    label={formatMessage({
                      id: "employee.form.joiningDate.label",
                    })}
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: "employee.form.joiningDate.required",
                        }),
                      },
                    ]}
                  >
                    <DatePicker
                      id="register_joiningdate"
                      className={styles.loginInput}
                      placeholder={formatMessage({
                        id: "employee.form.joiningDate.placeholder",
                      })}
                      format={DATE_FORMATS.DAY_MONTH_YEAR}
                    />
                  </Form.Item>
                </Col>
                <Col lg={12} xs={24}>
                  <Form.Item
                    label={formatMessage({
                      id: "employee.form.localAddress.label",
                    })}
                    name="localAddress"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: "employee.form.localAddress.required",
                        }),
                      },
                    ]}
                  >
                    <Input
                      type="textArea"
                      id="local_address"
                      placeholder={formatMessage({
                        id: "employee.form.localAddress.placeholder",
                      })}
                      onChange={() => setIsCheckboxChecked(false)}
                    />
                  </Form.Item>
                </Col>
                <Col lg={12} xs={24}>
                  <Form.Item
                    label={
                      <span>
                        <Checkbox
                          id="address_checkbox"
                          checked={isCheckboxChecked}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setIsCheckboxChecked(checked);

                            if (checked) {
                              const localAddress =
                                form.getFieldValue("localAddress");
                              form.setFieldsValue({
                                permanentAddress: localAddress,
                              });
                            }
                          }}
                        >
                          {formatMessage({
                            id: "employee.form.permanentAddress.label",
                          })}
                        </Checkbox>
                      </span>
                    }
                    name="permanentAddress"
                    rules={[
                      {
                        required: true,
                        message: formatMessage({
                          id: "employee.form.permanentAddress.required",
                        }),
                      },
                    ]}
                  >
                    <Input
                      type="textArea"
                      id="permanent_address"
                      placeholder={formatMessage({
                        id: "employee.form.permanentAddress.placeholder",
                      })}
                      onChange={() => setIsCheckboxChecked(false)}
                    />
                  </Form.Item>
                </Col>
                <Col lg={24} xs={24}>
                  <Form.Item
                    label={formatMessage({
                      id: "employee.form.documents.label",
                    })}
                    valuePropName="fileList"
                  >
                    <Form.List name="documents">
                      {(fields, { add, remove }) => {
                        return (
                          <>
                            <div className="site-card-wrapper">
                              <Row gutter={16}>
                                {fields.map(
                                  ({ key, name, ...restField }, index) => {
                                    return (
                                      <Col xs={24} xxl={8} lg={12} key={index}>
                                        <Card
                                          title={
                                            documents[key]
                                              ? showUploadedDocument[index]
                                                  ?.name
                                              : formatMessage(
                                                  {
                                                    id: "employee.form.documents.cards.title",
                                                  },
                                                  { documentNumber: index + 1 }
                                                )
                                          }
                                          hoverable
                                        >
                                          <Form.Item
                                            {...restField}
                                            name={[name, "first"]}
                                            rules={[
                                              {
                                                required: true,
                                                message: formatMessage({
                                                  id: "employee.form.documents.cards.input.required",
                                                }),
                                              },
                                            ]}
                                          >
                                            <Input
                                              type="text"
                                              placeholder={formatMessage({
                                                id: "employee.form.documents.cards.input.placeholder",
                                              })}
                                              id="register_document"
                                              disabled={
                                                documents[key] ? true : false
                                              }
                                              onChange={(e) =>
                                                setHandleNextDocType(true)
                                              }
                                              className={styles.DocumentInput}
                                            />
                                          </Form.Item>
                                          <Row className={styles.docSection}>
                                            <Col xl={20} lg={18}>
                                              <Form.Item
                                                {...restField}
                                                name={[name, "Upload"]}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message: formatMessage({
                                                      id: "employee.form.documents.cards.upload.required",
                                                    }),
                                                  },
                                                ]}
                                              >
                                                <Upload
                                                  name={
                                                    documents[key] && "logo"
                                                  }
                                                  listType={
                                                    documents[key] && "picture"
                                                  }
                                                  className={
                                                    documents[key] &&
                                                    "upload-list-inline"
                                                  }
                                                  maxCount={1}
                                                  {...uploadProps}
                                                  fileList={
                                                    documents[key]
                                                      ? [documents[key]]
                                                      : undefined
                                                  }
                                                >
                                                  {documents[key] ? null : (
                                                    <Button
                                                      className="mb-4"
                                                      icon={<UploadOutlined />}
                                                      id="upload_document"
                                                    >
                                                      {formatMessage({
                                                        id: "employee.form.documents.cards.button.add",
                                                      })}
                                                    </Button>
                                                  )}
                                                </Upload>
                                              </Form.Item>
                                            </Col>
                                            <Col xl={2} lg={3}>
                                              {documents[key] && (
                                                <Tooltip
                                                  title={formatMessage({
                                                    id: "generic.update",
                                                  })}
                                                  id="register_document_edit"
                                                >
                                                  <Button
                                                    icon={
                                                      <EditOutlined id="Update_icon_document" />
                                                    }
                                                    onClick={() =>
                                                      showModal(name)
                                                    }
                                                  />
                                                </Tooltip>
                                              )}
                                            </Col>
                                            <Col
                                              xl={2}
                                              lg={3}
                                              className="text-end"
                                            >
                                              <Tooltip
                                                title={formatMessage({
                                                  id: "generic.delete",
                                                })}
                                              >
                                                <Button
                                                  icon={<DeleteOutlined />}
                                                  danger
                                                  id="delete_document"
                                                  onClick={() => {
                                                    setHandleNextDocType(true);
                                                    setHandleNextDoc(true);
                                                    setIsHide(false);
                                                    if (id && documents[key]) {
                                                      deleteDocument(name);
                                                    } else {
                                                      remove(name);
                                                    }
                                                  }}
                                                />
                                              </Tooltip>
                                            </Col>
                                          </Row>
                                        </Card>
                                      </Col>
                                    );
                                  }
                                )}
                              </Row>
                            </div>
                            <Form.Item>
                              {fields.length <= 2 && (
                                <Button
                                  className={styles.buttonBlue}
                                  onClick={() => {
                                    setHandleNextDocType(false);
                                    setHandleNextDoc(false);
                                    add();
                                  }}
                                  block
                                  icon={<PlusOutlined />}
                                  disabled={
                                    fields.length === 0
                                      ? false
                                      : documents.length
                                      ? false
                                      : !docAuth
                                  }
                                  id="add_document"
                                >
                                  {formatMessage({
                                    id: "employee.form.documents.cards.button.add",
                                  })}
                                </Button>
                              )}
                            </Form.Item>
                          </>
                        );
                      }}
                    </Form.List>
                  </Form.Item>
                </Col>
                <Col lg={24} xs={24}>
                  <Form.Item {...tailFormItemLayout}>
                    <div className="buttonGroupsection">
                      <Button
                        type="primary"
                        htmlType="submit"
                        id="save"
                        className={`${styles.buttonBlue} ${styles.buttonAdd}`}
                        loading={loading}
                        disabled={isHide}
                      >
                        {formatMessage({
                          id: "generic.save",
                        })}
                      </Button>
                      <Link to="/employees">
                        <Button
                          htmlType="reset"
                          id="cancel"
                          className={`${styles.buttonBlue} ${styles.buttonAdd}`}
                        >
                          {formatMessage({
                            id: "generic.cancel",
                          })}
                        </Button>
                      </Link>
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Col>
      <EditDocumentModal
        modalVisible={modalVisible}
        handleClose={handleClose}
        editingFileData={editingFileData}
      />
    </div>
  );
};

export default EmployeeForm;
