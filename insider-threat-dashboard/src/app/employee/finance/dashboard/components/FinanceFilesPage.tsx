'use client';

import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import {
  Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText,
  TextField, Chip, Divider, Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment, IconButton, Snackbar, Alert
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import TopNavBar from '@/app/components/TopNavBar';
import FooterSection from '@/app/components/FooterSection';
import { apiGet, apiPost } from '@/lib/api';
import { ResourceDto } from '@/types/resource';
import EditAccessDialog from '@/app/components/EditAccessDialog';

type UiFile = {
  id: number;
  name: string;
  type: 'folder' | 'file';
  access: 'open' | 'restricted' | 'full_control' | 'none' | 'upload' | 'download' | 'delete';
};

const DEPT_ID = 1; // finance department id in your DB

export default function SharedFilesPage() {
  const { data, error, mutate } = useSWR<ResourceDto[]>('/resources/', apiGet);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [previewText, setPreviewText] = useState<string>('');
  const [newItem, setNewItem] = useState({ name: '', type: 'file' as 'file' | 'folder' });
  const [toast, setToast] = useState<{open: boolean; msg: string; severity: 'success'|'error'|'info'}>({open:false,msg:'',severity:'success'});

  const files: UiFile[] = useMemo(() => {
    if (!data) return [];
    // Map API to UI items. Access label is determined by backend policy; here we default to "restricted".
    return data.map(r => ({
      id: r.id,
      name: r.name,
      type: r.is_folder ? 'folder' : 'file',
      access: 'restricted',
    }));
  }, [data]);

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  async function handleAddFile() {
    if (!newItem.name.trim()) return;
    try {
      // POST to create Resource on the backend
      const payload = {
        name: newItem.name,
        path: newItem.type === 'file' ? `resources/${Date.now()}_${newItem.name}.txt` : `folders/${Date.now()}_${newItem.name}/`,
        is_folder: newItem.type === 'folder',
        department: DEPT_ID,
      };
      await apiPost<ResourceDto>('/resources/', payload);
      setOpenDialog(false);
      setNewItem({ name: '', type: 'file' });
      setToast({open:true,msg:'Created successfully',severity:'success'});
      mutate(); // refresh list
    } catch (e:any) {
      setToast({open:true,msg:e?.message || 'Create failed',severity:'error'});
    }
  }

  async function handleOpen(file: UiFile) {
    try {
      // GET detail to enforce RBAC + create AuditLog (server side).
      const r = await apiGet<ResourceDto>(`/resources/${file.id}/`);
      // You might have a file preview endpoint; demo shows metadata.
      setPreviewText(`Name: ${r.name}\nPath: ${r.path}\nCreated by: ${r.created_by ?? '—'}\nCreated: ${new Date(r.created_at).toLocaleString()}`);
      setPreviewDialog(true);
      
    } catch (e:any) {
      const code = `${e.message}`;
      setToast({open:true,msg: code==='403' ? 'Access denied' : `Open failed (${code})`, severity: 'error'});
    }
  }
      const [editOpen, setEditOpen] = useState(false);
      const [selectedResourceId, setSelectedResourceId] = useState<number | null>(null);
      // optionally store current name/path to prefill
      const [selectedResourceName, setSelectedResourceName] = useState('');
      const [selectedResourcePath, setSelectedResourcePath] = useState('');

  interface EditResourceDto {
    id: number;
    name: string;
    path: string;
  }

  function handleOpenEdit(resourceDto: EditResourceDto) {
    setSelectedResourceId(resourceDto.id);
    setSelectedResourceName(resourceDto.name);
    setSelectedResourcePath(resourceDto.path);
    setEditOpen(true);
  }

  async function handleDownload(file: UiFile) {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      const base = process.env.NEXT_PUBLIC_BACKEND_URL;
      const url = `${base}/resources/${file.id}/download/`;
      const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error(`${res.status}`);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${file.name}${file.type==='file'?'.txt':''}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (e:any) {
      const code = `${e.message}`;
      setToast({open:true,msg: code==='403' ? 'No permission to download' : `Download failed (${code})`, severity: 'error'});
      setToast({open:true,msg: code==='401' ? 'Forbidden' : `Download failed (${code})`, severity: 'error'});
    }
  }

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
                onClick={() => { setNewItem({ name: '', type: 'file' }); setOpenDialog(true); }}
              >
                New File
              </Button>
              <Button
                variant="outlined"
                sx={{ borderColor: '#00bcd4', color: '#00bcd4' }}
                onClick={() => { setNewItem({ name: '', type: 'folder' }); setOpenDialog(true); }}
              >
                New Folder
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 2, borderColor: '#1a2a3c' }} />

          {error && (
            <Alert severity="error" sx={{ mb:2 }}>
              Failed to load resources (are you logged in? token missing? CORS?)
            </Alert>
          )}

          <List sx={{ bgcolor: 'transparent' }}>
            {filteredFiles.map((file) => (
              <ListItem
                key={file.id}
                sx={{ bgcolor: '#1c2a3a', mb: 1, borderRadius: 2, '&:hover': { backgroundColor: '#27394e' }, cursor: 'pointer' }}
                onClick={() => handleOpen(file)}
              >
                <Button
                    size="small"
                    onClick={(e)=> { 
                      e.stopPropagation(); 
                      handleOpenEdit({ id: file.id, name: file.name, path: file.name }); 
                    }}
                  >
                    Manage
                  </Button>
                  secondaryAction={
                  file.type === 'file' && (
                    <IconButton edge="end" onClick={(e) => { e.stopPropagation(); handleDownload(file); }}>
                      <DownloadIcon sx={{ color: '#00bcd4' }} />
                    </IconButton>
                  )
                }
                <EditAccessDialog
                  open={editOpen}
                  onClose={() => setEditOpen(false)}
                  resourceId={selectedResourceId!}
                  initialName={selectedResourceName}
                  initialPath={selectedResourcePath}
                  onSaved={() => { mutate(); /* refresh list */ setEditOpen(false); }}
                />

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

      {/* Create */}
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
          <Button onClick={handleAddFile} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Preview */}
      <Dialog open={previewDialog} onClose={() => setPreviewDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Preview</DialogTitle>
        <DialogContent dividers sx={{ minHeight: 100 }}>
          <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{previewText}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={()=>setToast({...toast,open:false})}>
        <Alert onClose={()=>setToast({...toast,open:false})} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
