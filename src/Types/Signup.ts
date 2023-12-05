type Address = {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

interface Details {
  name: string;
  email: string;
  mobileNo: string;
}

export interface Signup {
  organisationDetails: OrganisationDetails;
  personalDetails: PersonalDetails;
  planId?: string;
}

export interface OrganisationDetails extends Details {
  industryType: string;
  panNo: string;
  gstNo: string;
  address: Address;
}

export interface PersonalDetails extends Details {
  dob: string;
  terms: boolean;
  address: Address;
}
