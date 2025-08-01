'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const FinanceLoginPage = () => {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [form, setForm] = useState({ email: '', password: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('http://127.0.0.1:8000/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        email: form.email,
        password: form.password,
      }).toString(),
      credentials: 'include',
    });

    const data = await res.json();
    if (data.success) {
      alert('OTP sent to email.');
      setStep('otp');
    } else {
      alert(data.message);
    }

    setLoading(false);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('http://127.0.0.1:8000/auth/verify-otp/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ otp: form.otp }).toString(),
      credentials: 'include',
    });

    const data = await res.json();
    if (data.success) {
      alert('Login successful!');
      router.push('/employee/finance/dashboard'); // Adjust route accordingly
    } else {
      alert(data.message);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 70%, #2c5364 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(0, 188, 212, 0.1) 0%, transparent 70%)',
          animation: 'rotate 25s linear infinite',
          '@keyframes rotate': {
            from: { transform: 'rotate(0deg)' },
            to: { transform: 'rotate(360deg)' },
          },
          zIndex: 0,
        },
      }}
    >
      {/* Header */}
      <AppBar position="static" sx={{ background: 'rgba(15, 32, 39, 0.9)', backdropFilter: 'blur(5px)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#00bcd4' }}>
            Insider Threat Dashboard
          </Typography>
          <IconButton color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)', // Adjust for header height
          px: 2,
          py: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: 12,
            width: '100%',
            maxWidth: 500,
            backdropFilter: 'blur(15px)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
            color: '#fff',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.02)' },
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{ mb: 4, textAlign: 'center', textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}
          >
            Finance Login
          </Typography>

          <form onSubmit={step === 'login' ? handleLogin : handleVerify}>
            {step === 'login' && (
              <>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{
                    style: { color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.3)' },
                  }}
                  InputLabelProps={{ style: { color: '#ccc' } }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{
                    style: { color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.3)' },
                  }}
                  InputLabelProps={{ style: { color: '#ccc' } }}
                  sx={{ mb: 3 }}
                />
              </>
            )}

            {step === 'otp' && (
              <TextField
                fullWidth
                label="OTP"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                margin="normal"
                InputProps={{
                  style: { color: '#fff', borderBottom: '1px solid rgba(255, 255, 255, 0.3)' },
                }}
                InputLabelProps={{ style: { color: '#ccc' } }}
                sx={{ mb: 3 }}
              />
            )}

            <Button
              fullWidth
              type="submit"
              sx={{
                mt: 2,
                py: 1.5,
                background: 'linear-gradient(45deg, #00bcd4, #2196f3)',
                color: '#fff',
                fontWeight: 'bold',
                borderRadius: 8,
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(45deg, #00aaff, #00bcd4)',
                  boxShadow: '0 4px 12px rgba(0, 188, 212, 0.5)',
                },
                '&:disabled': { background: 'rgba(0, 188, 212, 0.5)', cursor: 'not-allowed' },
              }}
              disabled={loading}
            >
              {loading ? 'Processing...' : (step === 'login' ? 'Send OTP' : 'Verify OTP')}
            </Button>
          </form>
        </Paper>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          mt: 'auto',
          py: 2,
          background: 'rgba(0, 0, 0, 0.7)',
          textAlign: 'center',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography variant="body2" color="#d3d3d3">
          © 2025 Insider Threat Dashboard |{' '}
          <a href="/privacy" style={{ color: '#00bcd4', textDecoration: 'none' }}>Privacy Policy</a> |{' '}
          <a href="/terms" style={{ color: '#00bcd4', textDecoration: 'none' }}>Terms of Service</a>
        </Typography>
      </Box>
    </Box>
  );
};

export default FinanceLoginPage;