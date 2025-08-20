
'use client';

import React, { useMemo, useState } from 'react';
import useSWR from 'swr';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import TopNavBar from '@/app/components/TopNavBar';
import Sidebar from '../components/SideBar';
import FooterSection from '@/app/components/FooterSection';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';

// ===== Types & constants =====
type AccessLevel = 'none' | 'read' | 'write' | 'download';
const DEPARTMENTS = ['Finance', 'IT', 'HR', 'Operations'];
const GROUPS = ['Interns', 'Regular Staff', 'Leads', 'Managers'];
const ACCESS_LEVELS: AccessLevel[] = ['none', 'read', 'write', 'download'];

function emptyPermissions(): Record<string, AccessLevel> {
  return Object.fromEntries(GROUPS.map(g => [g, 'none'])) as Record<string, AccessLevel>;
}

function suggestPath(name: string, isFolder: boolean) {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return isFolder ? `/folders/${slug}/` : `/files/${slug}.dat`;
}

function summarizeAccess(perms: Record<string, AccessLevel>): string {
  const vals = Object.values(perms);
  if (vals.includes('download')) return 'download';
  if (vals.includes('write')) return 'write';
  if (vals.includes('read')) return 'read';
  return 'none';
}

// Normalizes permissions from backend into Record<string, AccessLevel>
function normalizePerms(raw: any): Record<string, AccessLevel> {
  const base = emptyPermissions();
  if (!raw) return base;
  let perms: any = raw;

  // If raw is a string (e.g., JSON in access_level), parse it
  if (typeof raw === 'string') {
    try {
      perms = JSON.parse(raw);
    } catch {
      console.error('Failed to parse permissions JSON:', raw);
      return base;
    }
  }

  // Handle object format (e.g., {"Interns": "read", "Managers": "write"})
  if (typeof perms === 'object' && !Array.isArray(perms)) {
    for (const k of Object.keys(perms)) {
      const v = perms[k];
      if (ACCESS_LEVELS.includes(v)) base[k] = v as AccessLevel;
    }
    return base;
  }

  // Handle array format (e.g., [{group: "Interns", permission: "read"}])
  if (Array.isArray(perms)) {
    for (const item of perms) {
      if (!item) continue;
      if (typeof item === 'string' && GROUPS.includes(item)) {
        base[item] = 'read'; // Fallback for simple group names
      } else if (item.group && item.permission && ACCESS_LEVELS.includes(item.permission)) {
        base[item.group] = item.permission;
      } else if (item.name && item.level && ACCESS_LEVELS.includes(item.level)) {
        base[item.name] = item.level;
      }
    }
    return base;
  }

  console.error('Unrecognized permissions format:', raw);
  return base;
}

// ===== Page component =====
export default function AccessControlPage() {
  const { data, error, mutate } = useSWR<any[]>('/resources/', apiGet);

  // Map API shape -> UI shape
  const resources = useMemo(() => {
    if (!data) return [];
    console.log('Raw API response:', data); // Debug: Inspect raw data
    return data.map(r => ({
      id: r.id,
      name: r.name,
      type: r.is_folder ? 'folder' : 'file',
      access: summarizeAccess(normalizePerms(r.permissions ?? r.access_level ?? {})),
      department: r.department,
      path: r.path || '',
      permissions: normalizePerms(r.permissions ?? r.access_level ?? {}),
      raw: r,
    }));
  }, [data]);

  const resourcesByDepartment = useMemo(() => {
    return resources.reduce<Record<string, typeof resources[0][]>>((acc, file) => {
      if (!acc[file.department]) acc[file.department] = [];
      acc[file.department].push(file);
      return acc;
    }, {});
  }, [resources]);

  // Dialog state
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<'file' | 'folder'>('file');
  const [formDept, setFormDept] = useState('');
  const [formPath, setFormPath] = useState('');
  const [formPerms, setFormPerms] = useState<Record<string, AccessLevel>>(emptyPermissions());
  const [saving, setSaving] = useState(false);
  const [fetchingResource, setFetchingResource] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' }>({
    open: false,
    msg: '',
    severity: 'success',
  });

  // Open create
  const openCreate = () => {
    setMode('create');
    setEditingId(null);
    setFormName('');
    setFormType('file');
    setFormDept('');
    setFormPath('');
    setFormPerms(emptyPermissions());
    setToast({ open: false, msg: '', severity: 'success' });
    setOpen(true);
  };

  // Open edit
  const openEdit = async (file: any) => {
    setMode('edit');
    setEditingId(file.id);
    setFetchingResource(true);
    setToast({ open: false, msg: '', severity: 'success' });
    try {
      const detail = await apiGet(`/resources/${file.id}/`);
      console.log('Resource detail response:', detail); // Debug: Inspect detail response
      setFormName(detail.name ?? file.name ?? '');
      setFormType(detail.is_folder ? 'folder' : 'file');
      setFormDept(detail.department ?? file.department ?? '');
      setFormPath(detail.path ?? file.path ?? suggestPath(detail.name ?? file.name ?? '', detail.is_folder ?? file.type === 'folder'));
      setFormPerms(normalizePerms(detail.permissions ?? detail.access_level ?? file.permissions));
    } catch (e: any) {
      console.error('Failed to fetch resource detail:', e);
      setToast({ open: true, msg: parseApiError(e), severity: 'error' });
      // Fallback
      setFormName(file.name ?? '');
      setFormType(file.type ?? 'file');
      setFormDept(file.department ?? '');
      setFormPath(file.path ?? suggestPath(file.name ?? '', file.type === 'folder'));
      setFormPerms(normalizePerms(file.permissions));
    } finally {
      setFetchingResource(false);
      setOpen(true);
    }
  };

  // Utility to parse backend error messages
  function parseApiError(e: any) {
    let msg = e?.message ?? String(e) ?? 'Unknown error';
    try {
      const parsed = JSON.parse(msg);
      if (typeof parsed === 'object') {
        return Object.entries(parsed)
          .map(([k, v]) => (Array.isArray(v) ? `${k}: ${v.join(', ')}` : `${k}: ${String(v)}`))
          .join(' | ');
      }
    } catch {
      // Not JSON
    }
    return msg;
  }

  // Update one group's permission
  const updateGroupPerm = (group: string, level: AccessLevel) => {
    setFormPerms(prev => ({ ...prev, [group]: level }));
  };

  // Save (create or patch)
  const handleSave = async () => {
    if (!formName.trim()) {
      setToast({ open: true, msg: 'Name is required.', severity: 'error' });
      return;
    }
    if (!formDept) {
      setToast({ open: true, msg: 'Department is required.', severity: 'error' });
      return;
    }
    const finalPath = formPath.trim() || suggestPath(formName, formType === 'folder');
    if (!finalPath) {
      setToast({ open: true, msg: 'Path is required.', severity: 'error' });
      return;
    }

    const payload = {
      name: formName.trim(),
      is_folder: formType === 'folder',
      department: formDept,
      path: finalPath,
      access_level: summarizeAccess(formPerms),
      permissions: formPerms,
    };

    try {
      setSaving(true);
      if (mode === 'create') {
        await apiPost('/resources/', payload);
        setToast({ open: true, msg: 'Resource created successfully', severity: 'success' });
      } else if (mode === 'edit' && editingId != null) {
        await apiPatch(`/resources/${editingId}/`, payload);
        setToast({ open: true, msg: 'Resource updated successfully', severity: 'success' });
      }
      setOpen(false);
      await mutate();
    } catch (e: any) {
      console.error('Save failed:', e);
      setToast({ open: true, msg: parseApiError(e), severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (file: any) => {
    if (!confirm(`Delete "${file.name}"? This cannot be undone.`)) return;
    try {
      await apiDelete(`/resources/${file.id}/`);
      setToast({ open: true, msg: 'Resource deleted successfully', severity: 'success' });
      await mutate();
    } catch (e: any) {
      console.error('Delete failed:', e);
      setToast({ open: true, msg: parseApiError(e), severity: 'error' });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopNavBar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box sx={{ flex: 1, p: 3, ml: '240px' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h4">Access Control</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={openCreate}>
              Add Resource
            </Button>
          </Stack>

          <Typography variant="h5" mb={2}>Files</Typography>

          {!data && !error ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">
              {error === '404' ? 'Resources not found. Check backend configuration.' : `Failed to load resources: ${error}`}
            </Typography>
          ) : Object.keys(resourcesByDepartment).length === 0 ? (
            <Typography>No files available.</Typography>
          ) : (
            Object.entries(resourcesByDepartment).map(([department, files]) => (
              <Box key={department} mb={4}>
                <Typography variant="h6" mb={1}>Department: {department}</Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Path</TableCell>
                        <TableCell>Access</TableCell>
                        <TableCell>Permissions</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {files.map((file: any) => (
                        <TableRow key={file.id}>
                          <TableCell>{file.name}</TableCell>
                          <TableCell>{file.type}</TableCell>
                          <TableCell>
                            <Tooltip title={file.path}>
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', maxWidth: 260 }}>
                                {file.path}
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>{file.access}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap">
                              {GROUPS.map(g => (
                                <Chip
                                  key={g}
                                  size="small"
                                  label={`${g}: ${file.permissions[g] || 'none'}`}
                                  sx={{ mb: 0.5 }}
                                />
                              ))}
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => openEdit(file)}>
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(file)}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))
          )}
        </Box>
      </Box>
      <FooterSection />

      {/* Dialog */}
      <Dialog open={open} onClose={() => { if (!saving) setOpen(false); }} fullWidth maxWidth="md">
        <DialogTitle>{mode === 'create' ? 'Add New Resource' : 'Edit Resource'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {fetchingResource ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={20} />
                <Typography>Loading resource details...</Typography>
              </Box>
            ) : null}

            <TextField
              label="Resource Name"
              value={formName}
              onChange={e => {
                setFormName(e.target.value);
                if (!formPath.trim()) setFormPath(suggestPath(e.target.value, formType === 'folder'));
              }}
              fullWidth
            />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formType}
                  label="Type"
                  onChange={e => {
                    const v = e.target.value as 'file' | 'folder';
                    setFormType(v);
                    if (!formPath.trim()) setFormPath(suggestPath(formName, v === 'folder'));
                  }}
                >
                  <MenuItem value="file">File</MenuItem>
                  <MenuItem value="folder">Folder</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formDept}
                  label="Department"
                  onChange={e => setFormDept(e.target.value)}
                  disabled={mode === 'edit'}
                >
                  {DEPARTMENTS.map(d => (
                    <MenuItem key={d} value={d}>{d}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              label="Path (required)"
              value={formPath}
              onChange={e => setFormPath(e.target.value)}
              helperText="Example: /files/report-q3.pdf or /folders/policies/"
              fullWidth
            />

            <Box>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Group Permissions</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Group</TableCell>
                    <TableCell>Permission</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {GROUPS.map(g => (
                    <TableRow key={g}>
                      <TableCell>{g}</TableCell>
                      <TableCell>
                        <FormControl size="small" fullWidth>
                          <Select
                            value={formPerms[g] || 'none'}
                            onChange={e => updateGroupPerm(g, e.target.value as AccessLevel)}
                          >
                            {ACCESS_LEVELS.map(a => (
                              <MenuItem key={a} value={a}>{a}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {toast.open && (
              <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
                {toast.msg}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={saving || fetchingResource}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || fetchingResource}
          >
            {saving ? <CircularProgress size={20} /> : mode === 'create' ? 'Create' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open && !open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
