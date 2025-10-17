'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
  List,
  ListItem,
  IconButton,
  Typography,
  Divider,
  Alert,
  Dialog as ConfirmDialog,
  DialogContentText,
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { toggleColumnVisibility, addColumn, deleteColumn } from '@/redux/tableSlice';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ColumnManager({ open, onClose }: Props) {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(state => state.table.columns);
  const [newColumnId, setNewColumnId] = useState('');
  const [newColumnLabel, setNewColumnLabel] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [columnToDelete, setColumnToDelete] = useState<{ id: string; label: string } | null>(null);

  // Default columns that cannot be deleted
  const defaultColumnIds = ['name', 'email', 'age', 'role'];

  const handleAddColumn = () => {
    if (newColumnId && newColumnLabel) {
      // Check if column already exists
      const exists = columns.some(col => col.id === newColumnId.toLowerCase());
      if (exists) {
        alert('A column with this ID already exists!');
        return;
      }

      dispatch(addColumn({
        id: newColumnId.toLowerCase(),
        label: newColumnLabel,
        visible: true,
        sortable: true,
      }));
      setNewColumnId('');
      setNewColumnLabel('');
    }
  };

  const handleDeleteClick = (columnId: string, columnLabel: string) => {
    setColumnToDelete({ id: columnId, label: columnLabel });
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (columnToDelete) {
      dispatch(deleteColumn(columnToDelete.id));
      setDeleteConfirmOpen(false);
      setColumnToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setColumnToDelete(null);
  };

  const isDefaultColumn = (columnId: string) => {
    return defaultColumnIds.includes(columnId);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Manage Columns</DialogTitle>
        <DialogContent>
          {/* Existing Columns Section */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Existing Columns
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Default columns (Name, Email, Age, Role) cannot be deleted
            </Alert>
            <List>
              {columns.map((column) => (
                <ListItem
                  key={column.id}
                  secondaryAction={
                    !isDefaultColumn(column.id) && (
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteClick(column.id, column.label)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    )
                  }
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: isDefaultColumn(column.id) ? '#f5f5f5' : 'transparent',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={column.visible}
                        onChange={() => dispatch(toggleColumnVisibility(column.id))}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">{column.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {column.id}
                          {isDefaultColumn(column.id) && ' (Default)'}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Add New Column Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Add New Column
            </Typography>
            <TextField
              fullWidth
              label="Column ID"
              value={newColumnId}
              onChange={(e) => setNewColumnId(e.target.value)}
              placeholder="e.g., department"
              helperText="Use lowercase letters and underscores only"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Column Label"
              value={newColumnLabel}
              onChange={(e) => setNewColumnLabel(e.target.value)}
              placeholder="e.g., Department"
              helperText="Display name for the column"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleAddColumn}
              startIcon={<Add />}
              fullWidth
              disabled={!newColumnId || !newColumnLabel}
            >
              Add Column
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the column <strong>&quot;{columnToDelete?.label}&quot;</strong>?
            <br />
            <br />
            This will permanently remove this column and all its data from the table.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </ConfirmDialog>
    </>
  );
}
