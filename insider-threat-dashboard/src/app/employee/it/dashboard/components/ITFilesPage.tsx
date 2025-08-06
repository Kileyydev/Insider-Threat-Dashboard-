'use client';

import React, { useState } from 'react';
import {
  Box, Typography, TextField, Paper, List, ListItem,
  ListItemIcon, ListItemText, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { Folder as FolderIcon, InsertDriveFile as FileIcon, Download as DownloadIcon, Lock, LockOpen } from '@mui/icons-material';

interface SharedFile {
  id: number;
  name: string;
  type: 'file' | 'folder';
  access: 'open' | 'restricted';
  content: string;
}

const initialITData: SharedFile[] = [
  { id: 1, name: "Cyber Threat Logs", type: "file", access: "restricted", content: "Threat logs from internal sensors." },
  { id: 2, name: "Firewall Rules", type: "file", access: "restricted", content: "Current firewall configuration settings." },
  { id: 3, name: "Network Diagrams", type: "folder", access: "restricted", content: "Folder contains Visio diagrams." },
  { id: 4, name: "DevOps Deployment Notes", type: "file", access: "open", content: "Deployment strategies and YAMLs." },
  { id: 5, name: "Container Images", type: "folder", access: "restricted", content: "Docker images and instructions." },
  { id: 6, name: "Kubernetes Configs", type: "file", access: "restricted", content: "k8s cluster configuration files." },
  { id: 7, name: "Dev Guidelines", type: "folder", access: "open", content: "Frontend and backend dev standards." },
  { id: 8, name: "CI/CD Workflows", type: "file", access: "open", content: "Jenkins and GitHub Actions pipelines." },
  { id: 9, name: "Security Audit Results", type: "file", access: "restricted", content: "Penetration test and audit logs." },
  { id: 10, name: "Analytics Dashboards", type: "file", access: "open", content: "Data visualizations from analytics." },
];

const ITDepartmentSharedFiles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [preview, setPreview] = useState<SharedFile | null>(null);

  const filteredFiles = initialITData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (file: SharedFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${file.name}.txt`;
    anchor.click();
  };

  return (
    <Box sx={{ p: 4, background: 'linear-gradient(to bottom, #0a101f, #1f2c3e)', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="#00bcd4">
        IT Department - Shared Files
      </Typography>

      <TextField
        label="Search files"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Paper elevation={3}>
        <List>
          {filteredFiles.map((file) => (
            <ListItem
              key={file.id}
              sx={{
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(0,188,212,0.08)',
                  cursor: 'pointer',
                },
              }}
              onClick={() => setPreview(file)}
            >
              <ListItemIcon>
                {file.type === 'file' ? <FileIcon /> : <FolderIcon />}
              </ListItemIcon>
              <ListItemText
                primary={file.name}
                secondary={file.access === 'restricted' ? 'Restricted' : 'Open'}
              />
              <Chip
                label={file.access}
                color={file.access === 'restricted' ? 'error' : 'success'}
                icon={file.access === 'restricted' ? <Lock /> : <LockOpen />}
                sx={{ mr: 2 }}
              />
              {file.type === 'file' && (
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(file);
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              )}
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* File/Folder Preview Dialog */}
      <Dialog open={!!preview} onClose={() => setPreview(null)} fullWidth maxWidth="sm">
        <DialogTitle>{preview?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
            {preview?.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreview(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ITDepartmentSharedFiles;
