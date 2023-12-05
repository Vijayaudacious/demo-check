export interface SalaryTemplate {
  amount: number;
  _id: string;
  basicSalary: any;
  createdAt: string;
  createdBy: any;
  createdIp: string;
  deductions: Deduction[];
  description: string;
  earnings: Earning[];
  orgId: string;
  templateName: string;
  updatedAt: string;
  updatedBy: any;
  updatedIp: string;
}

export interface Deduction {
  amount: number;
  title: string;
  type: string;
  deductionOn: string[];
}

export interface Earning {
  amount: number;
  title: string;
  type: string;
}
