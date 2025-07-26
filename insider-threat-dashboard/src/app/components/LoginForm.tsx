'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { useRouter } from 'next/navigation'; 

const LoginForm = () => {
  const router = useRouter(); 

  const [form, setForm] = useState({
    email: '',
    password: '',
    otp: '',
  });

  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
        alert('OTP sent to your email.');
        setStep('otp');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }

    setLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
        alert('Login successful!');
        router.push('/dashboard'); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          borderRadius: 4,
          width: '100%',
          maxWidth: 480,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255,255,255,0.05)',
          color: '#fff',
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {step === 'login' ? 'System Admin Login' : 'Enter OTP'}
        </Typography>

        <form onSubmit={step === 'login' ? handleLoginSubmit : handleOtpSubmit}>
          {step === 'login' && (
            <>
              <TextField
                fullWidth
                variant="outlined"
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                margin="normal"
                InputProps={{ style: { color: '#fff' } }}
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
                margin="normal"
                InputProps={{ style: { color: '#fff' } }}
                InputLabelProps={{ style: { color: '#ccc' } }}
              />
            </>
          )}

          {step === 'otp' && (
            <TextField
              fullWidth
              variant="outlined"
              label="Enter OTP"
              name="otp"
              value={form.otp}
              onChange={handleChange}
              margin="normal"
              InputProps={{ style: { color: '#fff' } }}
              InputLabelProps={{ style: { color: '#ccc' } }}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              background: 'linear-gradient(to right, #00bcd4, #2196f3)',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 'bold',
            }}
            disabled={loading}
          >
            {step === 'login' ? 'Send OTP' : 'Verify OTP'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginForm;
