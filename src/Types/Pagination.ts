export interface Pagination {
  search?: string;
  currentPage?: number | string;
  limit?: number | string;
  field?: string;
  sortBy?: number | string;
  fromDate?: string | number;
  toDate?: string | number;
  value?: string | number;
}
