import DeleteModal from "@/Components/DeleteModal";
import OrganizationWrapper from "@/Components/Wrappers/OrganizationWrapper";
import { useDeleteOrganizationLogoMutation } from "@/Hooks/organization";
import { organisationDetail } from "@/Services/Organization";
import { Avatar, Button, Col, Row, Space, message } from "antd";
import classNames from "classnames";
import get from "lodash/get";
import snakeCase from "lodash/snakeCase";
import upperCase from "lodash/upperCase";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.less";
import { useIntl } from "react-intl";
import { showErrorMessage } from "@/Utils/generic";

const OrganizationShowDetails = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { data } = useQuery("organization-detail", organisationDetail);
  const organizationData = get(data, "data", " ");
  const logoBaseURL = process.env.REACT_APP_BASE_API || "";

  const editOrganizationData = () => {
    if (organizationData._id) {
      navigate(`/organizations/${organizationData._id}/update`);
    } else {
      navigate("/organizations/new");
    }
  };

  const fullLogoUrl = `${logoBaseURL}${organizationData.organizationLogo}`;

  const { mutateAsync: DeleteLogoMutation } =
    useDeleteOrganizationLogoMutation();
  const queryClient = useQueryClient();

  const handleLogoRemove = async () => {
    try {
      await DeleteLogoMutation();
      queryClient.invalidateQueries(["organization-detail"]);
      message.success(
        formatMessage({
          id: "settings.organization.message.logoRemove",
        })
      );
    } catch (error) {
      showErrorMessage(error);
    }
  };

  return (
    <OrganizationWrapper
      breadcurmbs={[
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.settings",
          }),
          path: "/settings/employee",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.organization",
          }),
          path: "/settings/organization",
        },
        {
          breadcrumbName: formatMessage({
            id: "breadcrumbs.organization",
          }),
          path: "/settings/organization",
        },
      ]}
    >
      <Row gutter={32} className={styles.organizationDetailsection}>
        <Col xl={6} lg={8} xs={24}>
          <div className={styles.orgLavel}>
            <div className={styles.empDsc}>
              <Space direction="vertical">
                {organizationData.organizationLogo ? (
                  <div className={styles.alignment}>
                    <img
                      src={fullLogoUrl}
                      style={{ width: "100%" }}
                      className={styles.organisationLogo}
                      id={snakeCase(organizationData.organizationLogo)}
                    />
                    <DeleteModal
                      isDeleteItem
                      id="remove_organization_logo"
                      className={styles.deleteicon}
                      name="Remove Organization Logo"
                      title="Are you sure you want to remove the organization logo?"
                      handleOk={() => handleLogoRemove()}
                    />
                  </div>
                ) : (
                  <div className={styles.avtarSection}>
                    <Avatar className={styles.avatar} size={200}>
                      <span className={styles.avatarSize}>
                        {upperCase(
                          organizationData?.organizationName?.charAt(0)
                        )}
                      </span>
                    </Avatar>
                  </div>
                )}
                <div className={classNames(styles.organization, "mt-5")}>
                  <Button
                    onClick={editOrganizationData}
                    type="primary"
                    id="organizations_btn"
                    className={styles.addEditBtn}
                  >
                    {organizationData._id
                      ? "Update Organization"
                      : "Add Organization"}
                  </Button>
                </div>
              </Space>
            </div>
          </div>
        </Col>
        <Col xl={9} lg={8} xs={24}>
          <div className={styles.detailBox}>
            <p className={styles.orgLavel}>
              {formatMessage({
                id: "settings.organization.Details.organizationName",
              })}
            </p>
            <h3 className={styles.orgDsc}>
              {organizationData.organizationName
                ? organizationData.organizationName
                : "--"}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.orgLavel}>
              {formatMessage({
                id: "settings.organization.Details.organizationEmail",
              })}
            </p>
            <h3 className={styles.orgDsc}>
              {organizationData.organizationEmail
                ? organizationData.organizationEmail
                : "--"}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.orgLavel}>
              {formatMessage({
                id: "settings.organization.Details.organizationContactNumber",
              })}
            </p>
            <h3 className={styles.orgDsc}>
              {organizationData.mobileNo ? organizationData.mobileNo : "--"}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.orgLavel}>
              {formatMessage({
                id: "settings.organization.Details.organizationLandlineNumber",
              })}
            </p>
            <h3 className={styles.orgDsc}>
              {organizationData.LandlineNo ? organizationData.LandlineNo : "--"}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.orgLavel}>
              {formatMessage({
                id: "settings.organization.Details.businessLocation",
              })}
            </p>
            <h3 className={styles.orgDsc}>
              {organizationData.BuisnessLocation
                ? organizationData.BuisnessLocation
                : "--"}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.orgLavel}>
              {formatMessage({
                id: "settings.organization.Details.industry",
              })}
            </p>
            <h3 className={styles.orgDsc}>
              {organizationData.industryType
                ? organizationData.industryType
                : "--"}
            </h3>
          </div>
        </Col>
        <Col xl={9} lg={8} xs={24}>
          <div className={styles.detailBox}>
            <p className={styles.orgLavel}>
              {formatMessage({
                id: "settings.organization.Details.prefixId",
              })}
            </p>
            <h3 className={styles.orgDsc}>
              {organizationData.companyPrefix
                ? organizationData.companyPrefix
                : "--"}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.orgLavel}>
              {formatMessage({
                id: "settings.organization.Details.registeredAddress",
              })}
            </p>
            <h3 className={styles.orgDsc}>
              {organizationData.registeredAddress
                ? organizationData.registeredAddress
                : "--"}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.orgLavel}>
              {formatMessage({
                id: "settings.organization.Details.gstNumber",
              })}
            </p>
            <h3 className={styles.orgDsc}>
              {organizationData.GST_No
                ? upperCase(organizationData.GST_No)
                : "--"}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.orgLavel}>
              {formatMessage({
                id: "settings.organization.Details.panNumber",
              })}
            </p>
            <h3 className={styles.orgDsc}>
              {organizationData.PAN_No
                ? upperCase(organizationData.PAN_No)
                : "--"}
            </h3>
          </div>
          <div className={styles.detailBox}>
            <p className={styles.orgLavel}>
              {formatMessage({
                id: "settings.organization.Details.tanNumber",
              })}
            </p>
            <h3 className={styles.orgDsc}>
              {organizationData.Tax_Deduction_No
                ? upperCase(organizationData.Tax_Deduction_No)
                : "--"}
            </h3>
          </div>
        </Col>
      </Row>
    </OrganizationWrapper>
  );
};

export default OrganizationShowDetails;
