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
  const [form, setForm] = useState<FormData>({
    email: '',
    password: '',
    otp: '',
  });
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Define custom theme to match UsersPage and ThreatLogsPage
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#00bcd4',
      },
      background: {
        default: '#0a101f',
        paper: 'rgba(255,255,255,0.05)',
      },
      text: {
        primary: '#ffffff',
        secondary: '#cccccc',
      },
      error: {
        main: '#ff6b6b',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", sans-serif',
      h5: {
        fontWeight: 700,
        color: '#00bcd4',
      },
      h6: {
        fontWeight: 600,
        color: '#ffffff',
      },
      body2: {
        fontSize: '0.85rem',
        color: '#cccccc',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            background: 'rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              color: '#ffffff',
              '& fieldset': {
                borderColor: '#444444',
              },
              '&:hover fieldset': {
                borderColor: '#666666',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00bcd4',
              },
              '&.Mui-error fieldset': {
                borderColor: '#ff6b6b',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#cccccc',
              fontSize: '0.85rem',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#00bcd4',
            },
            '& .MuiInputLabel-root.Mui-error': {
              color: '#ff6b6b',
            },
            '& .MuiInputBase-input': {
              fontSize: '0.85rem',
              padding: '10px 12px',
            },
            '& .MuiFormHelperText-root': {
              fontSize: '0.75rem',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            padding: '8px 16px',
            background: 'linear-gradient(135deg, #00bcd4, #0288d1)',
            color: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: 600,
            '&:hover': {
              background: 'linear-gradient(135deg, #0288d1, #00bcd4)',
            },
            '&.Mui-disabled': {
              background: 'rgba(0, 188, 212, 0.5)',
              color: '#cccccc',
            },
          },
        },
      },
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: form.email,
          password: form.password,
        }).toString(),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setStep('otp');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      setError('Something went wrong');
    }

    setLoading(false);
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
      const response = await fetch('http://127.0.0.1:8000/auth/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          otp: form.otp,
        }).toString(),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        router.push('/dashboard');
      } else {
        setError(data.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error(error);
      setError('Something went wrong');
    }

    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '70vh',
          background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 2, sm: 2 },
        }}
      >
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: '12px',
            width: '100%',
            maxWidth: 400,
            backdropFilter: 'blur(10px)',
            background: 'rgba(255,255,255,0.05)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <LockOutlined sx={{ fontSize: '2.5rem', color: '#00bcd4' }} />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              mb: 1,
              textAlign: 'center',
            }}
          >
            InsiderDash
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              textAlign: 'center',
            }}
          >
            {step === 'login' ? 'Sign in to manage your system' : 'Verify your identity'}
          </Typography>

          <form onSubmit={step === 'login' ? handleLoginSubmit : handleOtpSubmit}>
            {step === 'login' && (
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  error={!!error && !form.email}
                  helperText={error && !form.email ? 'Email is required' : ''}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="password"
                  label="Password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  error={!!error && !form.password}
                  helperText={error && !form.password ? 'Password is required' : ''}
                />
              </Box>
            )}

            {step === 'otp' && (
              <TextField
                fullWidth
                variant="outlined"
                label="Enter OTP"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                error={!!error}
                helperText={error}
              />
            )}

            {error && step === 'login' && (
              <Typography
                sx={{
                  color: '#ff6b6b',
                  fontSize: '0.75rem',
                  mt: 1,
                  textAlign: 'center',
                }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : step === 'login' ? (
                'Send OTP'
              ) : (
                'Verify OTP'
              )}
            </Button>
          </form>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default LoginForm;
