import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TableRow, ColumnConfig, TableState } from '@/types/table';

const defaultColumns: ColumnConfig[] = [
  { id: 'name', label: 'Name', visible: true, sortable: true },
  { id: 'email', label: 'Email', visible: true, sortable: true },
  { id: 'age', label: 'Age', visible: true, sortable: true },
  { id: 'role', label: 'Role', visible: true, sortable: true },
];

const initialState: TableState = {
  data: [],
  columns: defaultColumns,
  searchQuery: '',
  currentPage: 0,
  rowsPerPage: 10,
  sortColumn: null,
  sortDirection: 'asc',
  editingRows: new Set(),
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<TableRow[]>) => {
      state.data = action.payload;
    },
    addRow: (state, action: PayloadAction<TableRow>) => {
      state.data.push(action.payload);
    },
    updateRow: (state, action: PayloadAction<TableRow>) => {
      const index = state.data.findIndex(row => row.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(row => row.id !== action.payload);
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 0;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSorting: (state, action: PayloadAction<{ column: string; direction: 'asc' | 'desc' }>) => {
      state.sortColumn = action.payload.column;
      state.sortDirection = action.payload.direction;
    },
    toggleColumnVisibility: (state, action: PayloadAction<string>) => {
      const column = state.columns.find(col => col.id === action.payload);
      if (column) {
        column.visible = !column.visible;
      }
    },
    addColumn: (state, action: PayloadAction<ColumnConfig>) => {
      state.columns.push(action.payload);
    },
    deleteColumn: (state, action: PayloadAction<string>) => {
      state.columns = state.columns.filter(col => col.id !== action.payload);
      // Also remove the column data from all rows
      state.data = state.data.map(row => {
        return Object.fromEntries(
          Object.entries(row).filter(([key]) => key !== action.payload)
        ) as TableRow;
      });
    },
  },
});

export const {
  setData,
  addRow,
  updateRow,
  deleteRow,
  setSearchQuery,
  setPage,
  setSorting,
  toggleColumnVisibility,
  addColumn,
  deleteColumn,
} = tableSlice.actions;

export default tableSlice.reducer;
