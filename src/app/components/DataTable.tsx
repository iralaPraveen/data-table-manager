'use client';

import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  IconButton,
  TextField,
  Box,
 
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setSearchQuery, setPage, setSorting, deleteRow } from '@/redux/tableSlice';

export default function DataTable() {
  const dispatch = useAppDispatch();
  const { data, columns, searchQuery, currentPage, rowsPerPage, sortColumn, sortDirection } = 
    useAppSelector(state => state.table);

  const visibleColumns = columns.filter(col => col.visible);

  const filteredAndSortedData = useMemo(() => {
    const filtered = data.filter(row => {
      return Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        
        if (sortDirection === 'asc') {
          return aStr.localeCompare(bStr);
        }
        return bStr.localeCompare(aStr);
      });
    }

    return filtered;
  }, [data, searchQuery, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = currentPage * rowsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedData, currentPage, rowsPerPage]);

  const handleSort = (columnId: string) => {
    const isAsc = sortColumn === columnId && sortDirection === 'asc';
    dispatch(setSorting({ column: columnId, direction: isAsc ? 'desc' : 'asc' }));
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this row?')) {
      dispatch(deleteRow(id));
    }
  };

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search all fields..."
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        sx={{ mb: 2 }}
      />
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {visibleColumns.map(column => (
                <TableCell key={column.id}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortColumn === column.id}
                      direction={sortColumn === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map(row => (
              <TableRow key={row.id}>
                {visibleColumns.map(column => (
                  <TableCell key={column.id}>{row[column.id]}</TableCell>
                ))}
                <TableCell>
                  <IconButton size="small" color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        component="div"
        count={filteredAndSortedData.length}
        page={currentPage}
        onPageChange={(_, newPage) => dispatch(setPage(newPage))}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
      />
    </Box>
  );
}
