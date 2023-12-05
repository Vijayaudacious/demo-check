export interface Incomes {
  _id: string;
  category: string;
  organisationId: string;
  createdBy: string;
  title: string;
  amount: number;
  type: string;
  invoiceNo: string;
  source: string;
  mode: string;
  date: string;
  description: string;
  document: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  file: string;
  _id: string;
}

export interface columns {
  title: string;
  dataIndex: string;
  key: string;
  width: string;
}
