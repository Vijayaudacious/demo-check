export interface Employee {
  _id: string;
  employeeCode: string;
  Employee_ID: string;
  maritial_status: string;
  name: string;
  nameToSort: string;
  DOB: string;
  gender: string;
  fatherName: string;
  address: string;
  email: string;
  contactNumber: string;
  password: string;
  allocatedLeaves: string;
  remainingLeaves: string;
  joiningDate: string;
  document: any[];
  status: string;
  lastLoginAt: any;
  organisationId: string;
  manager: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
  roles: Role[];
  salary: number;
  salaryTemplates: string;
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  isPredefined: boolean;
  status: string;
  permission: Permission;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  users: string[];
  leaves: string[];
  roles: string[];
  payments: string[];
}

export interface CreateEmployee {
  name: string;
  email: string;
  contactNumber: string;
  employeeCode: string;
  roles: string[];
  joiningDate: string;
  salary: string;
  manager: string;
  allocatedLeaves: string;
  gender: string;
}

export interface PersonalDetails {
  fatherName: string;
  panCard: string;
  gender: string;
  dob: string;
  maritialStatus: string;
  localAddress: string;
  permanentAddress: string;
}

export interface EducationDetails {
  educationDetails: EducationDetail[];
}

export interface EducationDetail {
  institutionName: string;
  passingYear: string;
  courseName: string;
  grade: string;
}

export interface GetEmployeeDetails {
  salaryTemplates: any[];
  _id: string;
  name: string;
  email: string;
  allocatedLeaves: string;
  remainingLeaves: string;
  roles: Role[];
  status: string;
  lastLoginAt: string;
  userType: string;
  document: Document[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  organisationId: string;
  contactNumber: string;
  dob: string;
  gender: string;
  joiningDate: string;
  localAddress: string;
  manager: any;
  maritialStatus: string;
  nameToSort: string;
  permanentAddress: string;
  educationDetails: EducationalDetails[];
  employeeCode: string;
  profilePicture: string;
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  isPredefined: boolean;
  status: string;
  permission: Permission;
  __v: number;
  createdAt: string;
  updatedAt: string;
  organisationId: string;
  createdBy: string;
}

export interface Permission {
  users: string[];
  leaves: string[];
  roles: string[];
  payments: string[];
  projects: string[];
  reports: string[];
}

export interface Document {
  name: string;
  file: string;
  _id: string;
}

export interface EducationalDetails {
  courseName: string;
  specialization: string;
  institutionName: string;
  passingYear: number;
  grade: string;
}

export interface Calculations {
  deductions: Record<string, number>;
  earnings: Record<string, number>;
  absent: number;
  empId: string;
  hdCount: number;
  lwpCount: number;
  netSalary: number;
  orgId: string;
  paidDays: number;
  salary: number;
  templateId: string;
  totalDeductions: number;
  totalEarnings: number;
}
