'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface FormData {
  email: string;
  password: string;
  otp: string;
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ email: '', password: '', otp: '' });
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#00bcd4' },
      background: { default: '#0a101f', paper: 'rgba(255,255,255,0.05)' },
    },
    typography: { fontFamily: '"Inter","Roboto",sans-serif' },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  // Use your backend host (dev: Django default)
  const API_BASE = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000' : '';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in email and password');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // backend returns detail: 'OTP sent'
        setStep('otp');
      } else {
        setError(data.detail || data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error', err);
      setError('Network error — check backend server or CORS');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.otp) {
      setError('Please enter the OTP');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp: form.otp }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.tokens && data.tokens.access) {
        localStorage.setItem('accessToken', data.tokens.access);
        if (data.tokens.refresh) localStorage.setItem('refreshToken', data.tokens.refresh);
        // optionally store user minimal info
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        // redirect to your system admin dashboard
        router.push('/employee/finance/dashboard'); // adjust route if different
      } else {
        setError(data.detail || data.message || 'Invalid OTP');
      }
    } catch (err) {
      console.error('OTP verification error', err);
      setError('Network error during OTP verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2 }}>
        <Paper sx={{ p: 3, borderRadius: 2, width: '100%', maxWidth: 420 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <LockOutlined sx={{ fontSize: 36, color: '#00bcd4' }} />
          </Box>
          <Typography variant="h5" sx={{ mb: 1, textAlign: 'center' }}>InsiderDash — System Admin</Typography>
          <Typography variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
            {step === 'login' ? 'Sign in with email and password' : 'Enter the OTP sent to your email'}
          </Typography>

          <form onSubmit={step === 'login' ? handleLoginSubmit : handleOtpSubmit}>
            {step === 'login' ? (
              <>
                <TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} sx={{ mb: 1.5 }} />
                <TextField fullWidth label="Password" name="password" type="password" value={form.password} onChange={handleChange} sx={{ mb: 1.5 }} />
              </>
            ) : (
              <TextField fullWidth label="OTP" name="otp" value={form.otp} onChange={handleChange} sx={{ mb: 1.5 }} />
            )}

            {error && <Typography sx={{ color: 'error.main', mb: 1 }}>{error}</Typography>}

            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ py: 1.25 }}>
              {loading ? <CircularProgress size={20} color="inherit" /> : step === 'login' ? 'Send OTP' : 'Verify OTP'}
            </Button>
          </form>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default LoginForm;
