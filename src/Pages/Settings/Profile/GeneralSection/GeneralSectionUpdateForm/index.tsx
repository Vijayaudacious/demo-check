import {
  Avatar,
  Button,
  Checkbox,
  Col,
  Form,
  Row,
  Select,
  Upload,
  message,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "@/Auth";
import {
  useDeleteProfileImage,
  useUploadProfileImage,
  useUserEditDetail,
} from "@/Hooks";
import styles from "./styles.module.less";
import { Input } from "@/Components/InputField";
import SettingDetailsWrapper from "@/Components/Wrappers/SettingWrapper";
import DeleteModal from "@/Components/DeleteModal";
import { snakeCase } from "lodash";
import { useQueryClient } from "react-query";
import { useIntl } from "react-intl";
import { showErrorMessage } from "@/Utils/generic";

const GeneralUpdateForm = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { _id: loggedInUserId } = useContext(UserContext);
  const [fileList, setFileList] = useState([]);
  const [isPictureClass, setIsPictureClass] = useState(true);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const logoBaseURL = process.env.REACT_APP_BASE_API || "";

  const [form] = useForm();
  const {
    title,
    name,
    contactNumber,
    localAddress,
    permanentAddress,
    maritial_status,
    profilePicture,
    gender,
    alternateContactNumber,
  } = useContext(UserContext);

  const initialValues = {
    title,
    name: name.trim(""),
    contactNumber,
    localAddress,
    permanentAddress,
    maritial_status,
    gender,
    alternateContactNumber,
  };
  const { mutate: profileImageMutate, isLoading } = useUploadProfileImage();
  const { mutateAsync: DeleteLogoMutation } = useDeleteProfileImage();

  const profilePic = `${logoBaseURL}${profilePicture}`;

  const { mutate } = useUserEditDetail();

  const handleFormSubmit = async (value: any) => {
    try {
      mutate({ loggedInUserData: value });
      message.success(
        formatMessage({
          id: "settings.general.message.updated",
        })
      );
      navigate("/settings/employee");
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const uploadProps = useMemo(
    () => ({
      accept: ".jpg, .jpeg, .png",
      beforeUpload: async (file: { size: number }) => {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error(`Image must smaller than 2MB!`, 1);
          return false;
        }
        const fd: any = new FormData();
        fd.append("profilePicture", file);
        try {
          if (loggedInUserId) {
            await profileImageMutate(fd);
            message.success(
              formatMessage({
                id: "settings.general.message.imageUploaded",
              })
            );
          }
        } catch (error) {
          showErrorMessage(error);
        }
        return false;
      },
    }),
    [fileList]
  );
  const onUploadChange = (info: any) => {
    setFileList([...info.fileList] as []);
    setIsPictureClass(false);
  };

  const deleteProfileImage = async () => {
    try {
      await DeleteLogoMutation();
      message.success(
        formatMessage({
          id: "settings.general.message.imageRemove",
        })
      );
    } catch (error) {
      showErrorMessage(error);
    }
  };

  useEffect(() => {
    const localAddress = form.getFieldValue("localAddress");
    const permanentAddress = form.getFieldValue("permanentAddress");
    if (localAddress && permanentAddress) {
      setIsCheckboxChecked(localAddress === permanentAddress);
    }
  }, [form]);

  return (
    <SettingDetailsWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.settings",
          }),
          path: "/settings/profile",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.general",
          }),
          path: "",
        },
      ]}
    >
      <Row className={styles.employeeDetailsection}>
        <Col xl={6} lg={8} md={10} xs={24}>
          <div className={styles.imageSection}>
            <Upload
              name="avatar"
              listType={isPictureClass ? "picture-card" : "text"}
              className="avatar-uploader"
              showUploadList={false}
              {...uploadProps}
              onChange={onUploadChange}
              maxCount={1}
              id="upload_image"
            >
              {profilePicture ? (
                <Avatar
                  size={{
                    xs: 250,
                    sm: 250,
                    lg: 220,
                    md: 192,
                    xxl: 250,
                    xl: 220,
                  }}
                  src={profilePic}
                />
              ) : (
                <div className={styles.avtarSection}>
                  <Avatar
                    className={styles.avatar}
                    size={{
                      xs: 250,
                      sm: 250,
                      lg: 220,
                      md: 192,
                      xxl: 250,
                      xl: 220,
                    }}
                  >
                    <span className={styles.avatarSize}>
                      {name?.trim().charAt(0).toUpperCase()}
                    </span>
                  </Avatar>
                  <Button
                    type="primary"
                    id="upload_image_button"
                    className={styles.avtarUpload}
                    onChange={onUploadChange}
                  >
                    {formatMessage({ id: "generic.uploadImage" })}
                  </Button>
                </div>
              )}
            </Upload>
            {profilePicture && (
              <DeleteModal
                className={styles.deleteicon}
                isDeleteItem
                id="remove_image"
                name="Remove Image"
                title={formatMessage({
                  id: "settings.general.delete.title",
                })}
                handleOk={() => deleteProfileImage()}
              />
            )}
          </div>
        </Col>
        <Col xl={18} lg={16} md={14} xs={24}>
          <Form
            layout="vertical"
            name="editUser"
            form={form}
            className={styles.formLogines}
            initialValues={initialValues}
            onFinish={handleFormSubmit}
          >
            <div className={styles.namefields}></div>
            <Form.Item
              label={formatMessage({
                id: "settings.general.form.name.label",
              })}
              name={"name"}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: "settings.general.form.name.required",
                  }),
                },
                {
                  whitespace: true,
                  message: formatMessage({
                    id: "settings.general.form.name.required",
                  }),
                },
              ]}
            >
              <Input
                type="text"
                id="name"
                placeholder={formatMessage({
                  id: "settings.general.form.name.placeholder",
                })}
                disabled={true}
              />
            </Form.Item>
            <div className={styles.fields}>
              <Form.Item
                label={formatMessage({
                  id: "settings.general.form.contactNumber.label",
                })}
                name="contactNumber"
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: "settings.general.form.contactNumber.required",
                    }),
                  },
                  {
                    pattern: new RegExp(
                      /^(?:(?:\+|0{0,2},[a-zA-Z])91(\s*[\-]\s*)?)?[6789]\d{9}$/
                    ),
                    max: 10,
                    message: formatMessage({
                      id: "settings.general.form.contactNumber.validNumber",
                    }),
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder={formatMessage({
                    id: "settings.general.form.contactNumber.placeholder",
                  })}
                  id="contact_number"
                />
              </Form.Item>
              <Form.Item
                label={formatMessage({
                  id: "settings.general.form.alternateContactNumber.label",
                })}
                name="alternateContactNumber"
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: "settings.general.form.alternateContactNumber.required",
                    }),
                  },
                  {
                    pattern: new RegExp(
                      /^(?:(?:\+|0{0,2},[a-zA-Z])91(\s*[\-]\s*)?)?[6789]\d{9}$/
                    ),
                    max: 10,
                    message: formatMessage({
                      id: "settings.general.form.alternateContactNumber.validNumber",
                    }),
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder={formatMessage({
                    id: "settings.general.form.alternateContactNumber.placeholder",
                  })}
                  id="contact_number"
                />
              </Form.Item>
            </div>
            <div className={styles.fields}>
              <Form.Item
                label={formatMessage({
                  id: "settings.general.form.maritalStatus.label",
                })}
                name="maritial_status"
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: "settings.general.form.maritalStatus.label",
                    }),
                  },
                  {
                    whitespace: true,
                    message: formatMessage({
                      id: "settings.general.form.maritalStatus.label",
                    }),
                  },
                ]}
              >
                <Input
                  type="select"
                  placeholder={formatMessage({
                    id: "settings.general.form.maritalStatus.placeholder",
                  })}
                  className={styles.loginInput}
                  options={[
                    {
                      label: formatMessage({
                        id: "settings.general.form.maritalStatus.optionsLabel.unmarried",
                      }),
                      value: "Unmarried",
                    },
                    {
                      label: formatMessage({
                        id: "settings.general.form.maritalStatus.optionsLabel.married",
                      }),
                      value: "Married",
                    },
                  ]}
                  id="maritial_status"
                />
              </Form.Item>
              <Form.Item
                label={formatMessage({
                  id: "settings.general.form.gender.label",
                })}
                name="gender"
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: "settings.general.form.gender.required",
                    }),
                  },
                  {
                    whitespace: true,
                    message: formatMessage({
                      id: "settings.general.form.gender.required",
                    }),
                  },
                ]}
              >
                <Input
                  type="select"
                  placeholder={formatMessage({
                    id: "settings.general.form.gender.placeholder",
                  })}
                  className={styles.loginInput}
                  options={[
                    {
                      label: formatMessage({
                        id: "settings.general.form.gender.optionsLabel.male",
                      }),
                      value: "Male",
                    },
                    {
                      label: formatMessage({
                        id: "settings.general.form.gender.optionsLabel.female",
                      }),
                      value: "Female",
                    },
                    {
                      label: formatMessage({
                        id: "settings.general.form.gender.optionsLabel.other",
                      }),
                      value: "Other",
                    },
                  ]}
                  id="gender"
                />
              </Form.Item>
            </div>
            <div className={styles.fields}>
              <Form.Item
                label={formatMessage({
                  id: "settings.general.form.localAddress.label",
                })}
                name="localAddress"
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: "settings.general.form.localAddress.required",
                    }),
                  },
                ]}
              >
                <Input
                  type="textArea"
                  id="local_address"
                  placeholder={formatMessage({
                    id: "settings.general.form.localAddress.placeholder",
                  })}
                  onChange={() => setIsCheckboxChecked(false)}
                />
              </Form.Item>

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
                        id: "settings.general.form.permanentAddress.label",
                      })}
                    </Checkbox>
                  </span>
                }
                name="permanentAddress"
                rules={[
                  {
                    required: true,
                    message: formatMessage({
                      id: "settings.general.form.permanentAddress.required",
                    }),
                  },
                ]}
              >
                <Input
                  type="textArea"
                  id="permanent_address"
                  placeholder={formatMessage({
                    id: "settings.general.form.permanentAddress.placeholder",
                  })}
                  onChange={() => setIsCheckboxChecked(false)}
                />
              </Form.Item>
            </div>
            <Form.Item name="submit">
              <div className={styles.buttonGroup}>
                <Button
                  type="primary"
                  htmlType="submit"
                  id="submit"
                  className={styles.submitBtn}
                >
                  {formatMessage({ id: "generic.save" })}
                </Button>
                <Link to={"/settings/employee"}>
                  <Button
                    type="default"
                    htmlType="reset"
                    id="cancel"
                    className={styles.submitBtn}
                  >
                    {formatMessage({ id: "generic.cancel" })}
                  </Button>
                </Link>
              </div>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </SettingDetailsWrapper>
  );
};
export default GeneralUpdateForm;
