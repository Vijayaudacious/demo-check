export interface SortingFilter {
  column: Column;
  order: string;
  field: string;
  columnKey: string;
}

export interface Column {
  title: string;
  dataIndex: string;
  key: string;
  sorter: boolean;
}
