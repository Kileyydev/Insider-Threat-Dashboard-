'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';

import TopNavBar from '@/app/components/TopNavBar';
import FooterSection from '@/app/components/FooterSection';

interface FileItem {
  id: number;
  name: string;
  type: 'folder' | 'file';
  access: 'open' | 'restricted';
  content?: string;
}

const initialFiles: FileItem[] = [
  { id: 1, name: 'Payroll Records', type: 'file', access: 'restricted', content: 'Confidential Payroll Data' },
  { id: 2, name: 'Invoices Q1', type: 'file', access: 'open', content: 'Invoice details for Q1' },
  { id: 3, name: 'Finance Reports', type: 'folder', access: 'restricted' },
  { id: 4, name: 'Budgets 2025', type: 'file', access: 'open', content: 'Projected budgets for 2025' },
  { id: 5, name: 'Audit Documents', type: 'folder', access: 'restricted' },
  { id: 6, name: 'Staff Salaries', type: 'file', access: 'restricted', content: 'Salaries breakdown' },
  { id: 7, name: 'Bank Statements', type: 'file', access: 'restricted', content: 'Statements from Jan to Mar' },
  { id: 8, name: 'Expense Claims', type: 'file', access: 'open', content: 'Expense claim summaries' },
  { id: 9, name: 'Quarterly Reviews', type: 'folder', access: 'open' },
  { id: 10, name: 'Receipts', type: 'file', access: 'open', content: 'Receipt images and records' },
];

const SharedFilesPage = () => {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [newItem, setNewItem] = useState({ name: '', type: 'file' });

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFile = () => {
    if (newItem.name.trim()) {
      const newFile: FileItem = {
        id: Date.now(),
        name: newItem.name,
        type: newItem.type as 'file' | 'folder',
        access: 'restricted',
        content: newItem.type === 'file' ? 'Newly created file content' : undefined,
      };
      setFiles([newFile, ...files]);
      setNewItem({ name: '', type: 'file' });
      setOpenDialog(false);
    }
  };

  const handleOpen = (file: FileItem) => {
    setPreviewFile(file);
    setPreviewDialog(true);
  };

  const handleDownload = (file: FileItem) => {
    const blob = new Blob([file.content || 'No content'], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#0a101f', color: '#fff' }}>
      <TopNavBar />
      <Box display="flex">
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" sx={{ color: '#00bcd4', mb: 2 }}>
            Finance Department - Shared Files
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <TextField
              placeholder="Search files/folders"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#888' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, color: '#fff', backgroundColor: '#1c2a3a' },
              }}
              sx={{ width: '50%' }}
            />
            <Box>
              <Button
                variant="outlined"
                sx={{ mr: 2, borderColor: '#00bcd4', color: '#00bcd4' }}
                onClick={() => {
                  setNewItem({ name: '', type: 'file' });
                  setOpenDialog(true);
                }}
              >
                New File
              </Button>
              <Button
                variant="outlined"
                sx={{ borderColor: '#00bcd4', color: '#00bcd4' }}
                onClick={() => {
                  setNewItem({ name: '', type: 'folder' });
                  setOpenDialog(true);
                }}
              >
                New Folder
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 2, borderColor: '#1a2a3c' }} />

          <List sx={{ bgcolor: 'transparent' }}>
            {filteredFiles.map((file) => (
              <ListItem
                key={file.id}
                sx={{
                  bgcolor: '#1c2a3a',
                  mb: 1,
                  borderRadius: 2,
                  '&:hover': { backgroundColor: '#27394e' },
                  cursor: 'pointer',
                }}
                onClick={() => handleOpen(file)}
                secondaryAction={
                  file.type === 'file' && (
                    <IconButton edge="end" onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file);
                    }}>
                      <DownloadIcon sx={{ color: '#00bcd4' }} />
                    </IconButton>
                  )
                }
              >
                <ListItemIcon sx={{ color: '#00bcd4' }}>
                  {file.type === 'folder' ? <FolderIcon /> : <DescriptionIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={file.type === 'folder' ? 'Folder' : 'File'}
                  primaryTypographyProps={{ color: '#fff' }}
                  secondaryTypographyProps={{ color: '#bbb', fontSize: '0.8rem' }}
                />
                <Chip
                  label={file.access === 'open' ? 'Open' : 'Restricted'}
                  color={file.access === 'open' ? 'success' : 'error'}
                  size="small"
                  sx={{ fontSize: '0.75rem' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      <FooterSection />

      {/* Create File/Folder Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New {newItem.type === 'folder' ? 'Folder' : 'File'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddFile} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialog} onClose={() => setPreviewDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{previewFile?.name}</DialogTitle>
        <DialogContent dividers sx={{ minHeight: 100 }}>
          {previewFile?.type === 'file' ? (
            <Typography variant="body2">{previewFile?.content}</Typography>
          ) : (
            <Typography variant="body2">Folder contents will be shown here...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>Close</Button>
          {previewFile?.type === 'file' && (
            <Button
              variant="contained"
              onClick={() => previewFile && handleDownload(previewFile)}
            >
              Download
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SharedFilesPage;
