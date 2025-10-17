'use client';

import React, { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Settings } from '@mui/icons-material';
import DataTable from './components/DataTable';
import ImportExport from './components/ImportExport';
import ColumnManager from './components/ColumnManager';

export default function Home() {
  const [columnManagerOpen, setColumnManagerOpen] = useState(false);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3" component="h1">
          Dynamic Data Table Manager
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Settings />}
          onClick={() => setColumnManagerOpen(true)}
        >
          Manage Columns
        </Button>
      </Box>
      
      <ImportExport />
      <DataTable />
      
      <ColumnManager
        open={columnManagerOpen}
        onClose={() => setColumnManagerOpen(false)}
      />
    </Container>
  );
}
