// components/EditAccessDialog.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  MenuItem, Select, InputLabel, FormControl, Box, Typography, CircularProgress, Alert
} from '@mui/material';
import { apiGet, apiPost, apiPut } from '@/lib/api';

type Props = {
  open: boolean;
  onClose: () => void;
  resourceId: number;
  initialName?: string;
  initialPath?: string;
  onSaved?: () => void; // called when access or content updated
};

type UserItem = { id: number; email: string };
type RoleItem = { id: number; name: string };

const PERMISSIONS = [
  'none',
  'read',
  'download',
  'upload',
  'write',
  'delete',
  'full_control',
];

export default function EditAccessDialog({ open, onClose, resourceId, initialName = '', initialPath = '', onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [targetType, setTargetType] = useState<'role'|'user'>('role');
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [permission, setPermission] = useState<string>('read');
  const [content, setContent] = useState<string>('');
  const [name, setName] = useState<string>(initialName);
  const [path, setPath] = useState<string>(initialPath);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setLoading(true);
    // fetch users and roles (roles endpoint may be missing - backend must provide it)
    Promise.allSettled([apiGet<UserItem[]>('/users/'), apiGet<RoleItem[]>('/roles/')])
      .then((results) => {
        const usersRes = results[0];
        const rolesRes = results[1];
        if (usersRes.status === 'fulfilled') setUsers(usersRes.value);
        else setUsers([]);
        if (rolesRes.status === 'fulfilled') setRoles(rolesRes.value);
        else setRoles([]);
      })
      .catch((e) => {
        console.error('Loading auxiliary lists failed', e);
        setError('Failed to load user/role lists (backend may not expose /roles/)');
      })
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    setName(initialName);
    setPath(initialPath);
  }, [initialName, initialPath]);

  async function handleAssign() {
    setError(null);
    setSaving(true);
    try {
      const payload: any = {
        resource_id: resourceId,
        permission: permission,
      };
      if (targetType === 'role') {
        if (!selectedRole) throw new Error('Select a role');
        payload.role_id = selectedRole;
      } else {
        if (!selectedUser) throw new Error('Select a user');
        payload.user_id = selectedUser;
      }
      await apiPost('/resource/assign-access/', payload);
      onSaved?.();
    } catch (e: any) {
      console.error(e);
      setError(typeof e === 'string' ? e : e?.message ?? 'Assign failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateContent() {
    setError(null);
    setSaving(true);
    try {
      // This updates resource metadata (name/path) or any field your serializer accepts.
      // If you want to update file content (binary), you should call the upload endpoint instead.
      const payload = { name, path }; 
      await apiPut(`/resources/${resourceId}/`, payload);
      onSaved?.();
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Access & Content</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
        ) : (
          <>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Typography variant="subtitle1" sx={{ mb: 1 }}>Assign Access</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="target-type-label">Target Type</InputLabel>
              <Select
                labelId="target-type-label"
                value={targetType}
                label="Target Type"
                onChange={(e) => setTargetType(e.target.value as 'role'|'user')}
              >
                <MenuItem value="role">Role</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>

            {targetType === 'role' ? (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  value={selectedRole ?? ''}
                  label="Role"
                  onChange={(e) => setSelectedRole(e.target.value as number)}
                >
                  <MenuItem value="">-- Select role --</MenuItem>
                  {roles.map(r => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
                </Select>
              </FormControl>
            ) : (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="user-select-label">User</InputLabel>
                <Select
                  labelId="user-select-label"
                  value={selectedUser ?? ''}
                  label="User"
                  onChange={(e) => setSelectedUser(e.target.value as number)}
                >
                  <MenuItem value="">-- Select user --</MenuItem>
                  {users.map(u => <MenuItem key={u.id} value={u.id}>{u.email}</MenuItem>)}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="perm-select-label">Permission</InputLabel>
              <Select
                labelId="perm-select-label"
                value={permission}
                label="Permission"
                onChange={(e) => setPermission(e.target.value as string)}
              >
                {PERMISSIONS.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </Select>
            </FormControl>

            <Box my={2}>
              <Button variant="contained" onClick={handleAssign} disabled={saving}>
                {saving ? 'Saving...' : 'Assign / Update Access'}
              </Button>
            </Box>

            <Box mt={3}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Edit Resource Data</Typography>
              <TextField
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Path or metadata"
                fullWidth
                value={path}
                onChange={(e) => setPath(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Content / Notes"
                fullWidth
                multiline
                rows={4}
                placeholder="Add textual content or notes for this resource (for binary files use the upload endpoint)."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Typography variant="caption" color="text.secondary">
                NOTE: To replace binary file contents use the upload endpoint (POST /resource/upload/).
              </Typography>
              <Box mt={2}>
                <Button variant="outlined" onClick={handleUpdateContent} disabled={saving}>
                  {saving ? 'Updating...' : 'Update Resource'}
                </Button>
              </Box>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
