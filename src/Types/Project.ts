export interface CreateProjectPayload {
  name: string;
  managerId: string;
  startDate: string;
  estimatedEndDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  createdIP?: string;
  updatedIP?: string;
  id?: number | string;
}

export interface Filters {
  limit?: string | number;
  page?: string | number;
  search?: string | null;
  from_date?: string;
  to_date?: string;
  date?: string;
  created_date?: string;
  project_startDate?: string;
  project_endDate?: string;
  createdBy?: string;
  managerId?: string;
  currentPage?: string;
  field?: string;
  sortBy?: string;
  fromDate?: string;
  toDate?: string;
  gender?: string;
  login?: string;
  createdAt?: string;
  joiningDate?: string;
  roles?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  templateName?: string[] | null;
  sort?: string;
  direction?: null | string;
  type?: string;
  category?: string;
  paymentMode?: string;
  source?: string;
  minRange?: string;
  maxRange?: string;
}
