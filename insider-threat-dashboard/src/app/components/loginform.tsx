'use client';

import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import TopNavBar from './TopNavBar';

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '', otp: '' });
  const [showOtp, setShowOtp] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: form.email,
          password: form.password,
        }),
        credentials: 'include',
      });

      const data = await res.json();
      if (data.success) {
        setShowOtp(true);
        setSnackbar({
          open: true,
          message: 'OTP sent to your email.',
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: data.message,
          severity: 'error',
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Network error. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8000/auth/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          otp: form.otp,
        }),
        credentials: 'include',
      });

      const data = await res.json();
      if (data.success) {
        setSnackbar({
          open: true,
          message: 'Login successful!',
          severity: 'success',
        });
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1200);
      } else {
        setSnackbar({
          open: true,
          message: data.message,
          severity: 'error',
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'OTP verification failed.',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <TopNavBar />

      <Grid
        container
        component="main"
        sx={{
          minHeight: '100vh',
          width: '100vw',
          background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 0,
          m: 0,
        }}
      >
        <Grid
          item
          xs={12}
          sm={10}
          md={8}
          lg={6}
          component={Paper}
          elevation={12}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            borderRadius: 4,
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            width: '100%',
            maxWidth: 900,
          }}
        >
          {/* Left Image */}
          <Box
            sx={{
              flex: 1,
              background:
                'url(https://source.unsplash.com/400x600/?technology,security)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: { xs: 'none', md: 'block' },
            }}
          />

          {/* Form Side */}
          <Box
            sx={{
              flex: 1,
              p: 5,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Sign In
            </Typography>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
              {showOtp
                ? 'Enter the OTP sent to your email'
                : 'Please enter your login credentials'}
            </Typography>

            <form onSubmit={showOtp ? handleVerifyOTP : handleLogin}>
              {/* Step 1: Email + Password */}
              {!showOtp && (
                <>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Email Address"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    sx={textFieldStyles}
                    InputLabelProps={{ style: { color: '#ccc' } }}
                  />

                  <TextField
                    fullWidth
                    variant="outlined"
                    type="password"
                    label="Password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    sx={textFieldStyles}
                    InputLabelProps={{ style: { color: '#ccc' } }}
                  />
                </>
              )}

              {/* Step 2: OTP */}
              {showOtp && (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="OTP"
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  sx={textFieldStyles}
                  InputLabelProps={{ style: { color: '#ccc' } }}
                />
              )}

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Link href="#" underline="hover" color="#00e5ff">
                  Forgot Password?
                </Link>
                <Link href="#" underline="hover" color="#00e5ff">
                  Resend OTP (60s)
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 1,
                  py: 1.5,
                  background: 'linear-gradient(to right, #00bcd4, #2196f3)',
                  color: '#fff',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(to right, #00acc1, #1976d2)',
                  },
                }}
              >
                {showOtp ? 'Verify OTP' : 'Login'}
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity as any}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

const textFieldStyles = {
  input: { color: '#fff' },
  label: { color: '#aaa' },
  mb: 2,
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#00bcd4',
    },
    '&:hover fieldset': {
      borderColor: '#00acc1',
    },
  },
};

export default LoginForm;
