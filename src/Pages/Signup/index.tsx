import {
  OrganisationDetails,
  PersonalDetails as PersonalDetailsType,
} from "@/Types/Signup";
import { Steps } from "antd";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Link, useSearchParams } from "react-router-dom";
import OrganizationDetails from "./OrganizationDetails";
import PersonalDetails from "./PersonalDetails";
import styles from "./styles.module.less";

export type ActiveStep = "organization" | "personal";
export type HandleChnageStep = (stepName: ActiveStep) => void;

const initialOrgValues = {
  name: "",
  email: "",
  mobileNo: "",
  industryType: "",
  panNo: "",
  gstNo: "",
  address: {
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  },
};
const Signup = () => {
  const [activeForm, setActiveForm] = useState<ActiveStep>("organization");
  const [isSignedup, setIsSignedup] = useState(false);
  const [orgDetails, setOrgDetails] =
    useState<OrganisationDetails>(initialOrgValues);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetailsType>();
  const { formatMessage } = useIntl();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  return (
    <div className={styles.signupForm}>
      {!isSignedup ? (
        <>
          <h2 className={styles.setPassTag}>
            {formatMessage({ id: "signup.title" })}
          </h2>
          {activeForm === "organization" && (
            <OrganizationDetails
              handleChnageForm={(formName) => setActiveForm(formName)}
              getOrganizationDetails={(details) => setOrgDetails(details)}
              initialValues={orgDetails}
            />
          )}
          {activeForm === "personal" && (
            <PersonalDetails
              handleChnageForm={(formName) => setActiveForm(formName)}
              handleSuccess={() => setIsSignedup(true)}
              getPersonalDetails={(details) => setPersonalDetails(details)}
              initialValues={personalDetails}
              orgDetails={orgDetails}
            />
          )}
        </>
      ) : (
        <h2> {formatMessage({ id: "signup.signedup" })}</h2>
      )}
      <h3 className={styles.loginLink}>
        {formatMessage({ id: "signup.footer.save" })}
        <Link to={`/login/?returnUrl=${encodeURIComponent(returnUrl)}`}>
          {formatMessage({ id: "signup.footer.link" })}
        </Link>
      </h3>
    </div>
  );
};

export default Signup;
