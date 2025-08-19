'use client';

import React, { useState } from 'react';
import {
  Box, Typography, TextField, Paper, List, ListItem,
  ListItemIcon, ListItemText, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Container
} from '@mui/material';
import { Folder as FolderIcon, InsertDriveFile as FileIcon, Download as DownloadIcon, Lock, LockOpen } from '@mui/icons-material';
import TopNavBar from '@/app/components/TopNavBar';

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

// FooterSection component (replace with your actual FooterSection if different)
function FooterSection() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        background: 'rgba(15, 32, 39, 0.95)',
        backdropFilter: 'blur(8px)',
        color: '#fff',
        py: 2,
        textAlign: 'center',
        zIndex: 1200,
        borderTop: '1px solid rgba(0, 188, 212, 0.2)',
      }}
    >
      <Container>
        <Typography variant="body2" sx={{ color: '#bbb', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
          © {new Date().getFullYear()} Insider Threat Dashboard. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

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
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a101f 0%, #1f2c3e 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-20%',
          left: '-20%',
          width: '140%',
          height: '140%',
          background: 'radial-gradient(circle, rgba(0, 188, 212, 0.15) 0%, transparent 70%)',
          animation: 'pulse 15s ease-in-out infinite',
          zIndex: 0,
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)', opacity: 0.15 },
            '50%': { transform: 'scale(1.2)', opacity: 0.25 },
            '100%': { transform: 'scale(1)', opacity: 0.15 },
          },
        },
        pb: { xs: 8, sm: 6 }, // Prevent content overlap with fixed footer
      }}
    >
      <TopNavBar />

      <Container
        sx={{
          py: { xs: 3, sm: 4 },
          position: 'relative',
          zIndex: 1,
          flex: 1,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{
            color: '#00bcd4',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
            mb: 4,
          }}
        >
          IT Department - Shared Files
        </Typography>

        <TextField
          label="Search Files and Folders"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              '& fieldset': {
                borderColor: 'rgba(0, 188, 212, 0.5)',
              },
              '&:hover fieldset': {
                borderColor: '#00bcd4',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00bcd4',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#bbb',
              '&.Mui-focused': {
                color: '#00bcd4',
              },
            },
            '& input': {
              color: '#fff',
            },
          }}
        />

        <Paper
          elevation={6}
          sx={{
            borderRadius: 3,
            background: 'rgba(31, 44, 62, 0.9)',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden',
            mb: 2,
          }}
        >
          <List>
            {filteredFiles.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary={
                    <Typography sx={{ color: '#bbb', textAlign: 'center' }}>
                      No files or folders found
                    </Typography>
                  }
                />
              </ListItem>
            ) : (
              filteredFiles.map((file) => (
                <ListItem
                  key={file.id}
                  sx={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    py: 2,
                    px: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(0, 188, 212, 0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 188, 212, 0.3)',
                    },
                  }}
                  onClick={() => setPreview(file)}
                >
                  <ListItemIcon>
                    {file.type === 'file' ? (
                      <FileIcon sx={{ color: '#00bcd4', fontSize: 28 }} />
                    ) : (
                      <FolderIcon sx={{ color: '#ffd700', fontSize: 28 }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: '#fff', fontWeight: 500, fontSize: '1.1rem' }}>
                        {file.name}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ color: '#bbb', fontSize: '0.9rem' }}>
                        {file.access === 'restricted' ? 'Restricted Access' : 'Open Access'}
                      </Typography>
                    }
                  />
                  <Chip
                    label={file.access}
                    color={file.access === 'restricted' ? 'error' : 'success'}
                    icon={
                      file.access === 'restricted' ? (
                        <Lock sx={{ fontSize: 16 }} />
                      ) : (
                        <LockOpen sx={{ fontSize: 16 }} />
                      )
                    }
                    sx={{
                      mr: 2,
                      fontWeight: 500,
                      background: file.access === 'restricted'
                        ? 'rgba(244, 67, 54, 0.2)'
                        : 'rgba(76, 175, 80, 0.2)',
                      color: '#fff',
                      border: `1px solid ${file.access === 'restricted' ? '#f44336' : '#4caf50'}`,
                    }}
                  />
                  {file.type === 'file' && (
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file);
                      }}
                      sx={{
                        color: '#00bcd4',
                        '&:hover': {
                          color: '#fff',
                          background: 'rgba(0, 188, 212, 0.3)',
                        },
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  )}
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      </Container>

      {/* File/Folder Preview Dialog */}
      <Dialog
        open={!!preview}
        onClose={() => setPreview(null)}
        fullWidth
        maxWidth="sm"
        sx={{
          '& .MuiDialog-paper': {
            background: 'rgba(31, 44, 62, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(0, 188, 212, 0.3)',
            color: '#fff',
          },
        }}
      >
        <DialogTitle sx={{ color: '#00bcd4', fontWeight: 500, borderBottom: '1px solid rgba(0, 188, 212, 0.2)' }}>
          {preview?.name}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography
            variant="body2"
            sx={{
              whiteSpace: 'pre-wrap',
              color: '#ddd',
              background: 'rgba(0, 0, 0, 0.2)',
              p: 2,
              borderRadius: 2,
              fontSize: '0.95rem',
              lineHeight: 1.6,
            }}
          >
            {preview?.content}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(0, 188, 212, 0.2)' }}>
          <Button
            onClick={() => setPreview(null)}
            sx={{
              color: '#00bcd4',
              '&:hover': {
                background: 'rgba(0, 188, 212, 0.2)',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <FooterSection />
    </Box>
  );
};

export default ITDepartmentSharedFiles;