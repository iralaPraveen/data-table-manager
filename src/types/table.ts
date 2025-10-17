export interface TableRow {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  department?: string;
  location?: string;
  [key: string]: string | number | undefined;
}

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
}

export interface TableState {
  data: TableRow[];
  columns: ColumnConfig[];
  searchQuery: string;
  currentPage: number;
  rowsPerPage: number;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
  editingRows: Set<string>;
}
