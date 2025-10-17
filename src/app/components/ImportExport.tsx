'use client';

import React, { useRef, useState } from 'react';
import { Button, Box, Snackbar, Alert } from '@mui/material';
import { Upload, Download } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setData } from '@/redux/tableSlice';
import { parseCSV, exportToCSV } from '@/utils/csvHandler';

export default function ImportExport() {
  const dispatch = useAppDispatch();
  const { data, columns } = useAppSelector(state => state.table);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setSnackbar({
        open: true,
        message: 'Invalid file format. Please upload a CSV file.',
        severity: 'error',
      });
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setSnackbar({
        open: true,
        message: 'File is too large. Maximum size is 5MB.',
        severity: 'error',
      });
      return;
    }

    try {
      const parsedData = await parseCSV(file);
      
      // Validate parsed data
      if (!parsedData || parsedData.length === 0) {
        setSnackbar({
          open: true,
          message: 'CSV file is empty or contains no valid data.',
          severity: 'warning',
        });
        return;
      }

      // Check for required columns
      const requiredColumns = ['name', 'email', 'age', 'role'];
      const firstRow = parsedData[0];
      const missingColumns = requiredColumns.filter(col => !(col in firstRow));
      
      if (missingColumns.length > 0) {
        setSnackbar({
          open: true,
          message: `Missing required columns: ${missingColumns.join(', ')}`,
          severity: 'error',
        });
        return;
      }

      dispatch(setData(parsedData));
      setSnackbar({
        open: true,
        message: `Successfully imported ${parsedData.length} rows`,
        severity: 'success',
      });
    } catch (error) {
      console.error('CSV parsing error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to parse CSV file. Please check the file format and try again.',
        severity: 'error',
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    try {
      exportToCSV(data, columns);
      setSnackbar({
        open: true,
        message: 'Data exported successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Export error:', error);
      setSnackbar({
        open: true,
        message: 'Failed to export data',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".csv"
        style={{ display: 'none' }}
      />
      <Button
        variant="contained"
        startIcon={<Upload />}
        onClick={() => fileInputRef.current?.click()}
      >
        Import CSV
      </Button>
      <Button
        variant="outlined"
        startIcon={<Download />}
        onClick={handleExport}
        disabled={data.length === 0}
      >
        Export CSV
      </Button>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
