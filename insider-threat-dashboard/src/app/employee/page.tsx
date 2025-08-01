'use client';

import { Box, Typography, Button, AppBar, Toolbar, IconButton, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import ComputerIcon from '@mui/icons-material/Computer';
import BuildIcon from '@mui/icons-material/Build';
import FooterSection from '../components/FooterSection';

const departments = [
  { name: 'Finance', route: '/employee/finance', icon: AttachMoneyIcon },
  { name: 'Human Resources', route: '/employee/hr', icon: PeopleIcon },
  { name: 'IT Department', route: '/employee/it', icon: ComputerIcon },
  { name: 'Operations', route: '/employee/operations', icon: BuildIcon },
];

export default function EmployeeLandingPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #0f2027, #203a43, #2c5364)',
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
          animation: 'rotate 20s linear infinite',
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
      <Container sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h3"
          sx={{
            color: '#fff',
            mb: 6,
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 6px rgba(0, 0, 0, 0.5)',
          }}
        >
          Kindly select your department
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 3,
            width: '100%',
            maxWidth: 800,
            mx: 'auto',
          }}
        >
          {departments.map((dept) => {
            const IconComponent = dept.icon;
            return (
              <Button
                key={dept.name}
                fullWidth
                onClick={() => router.push(dept.route)}
                sx={{
                  px: 3,
                  py: 2.5,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: '#fff',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minWidth: { xs: '100%', sm: '45%', md: '30%' },
                  transition: '0.3s',
                  '&:hover': {
                    background: 'rgba(0, 229, 255, 0.25)',
                    boxShadow: '0 8px 18px rgba(0, 229, 255, 0.5)',
                  },
                }}
              >
                <IconComponent sx={{ fontSize: 30, mr: 1 }} />
                {dept.name}
              </Button>
            );
          })}
        </Box>
      </Container>

      {/* Sidebar (Toggled with Menu, simplified here as static for demo) */}
      <Box
        sx={{
          position: 'fixed',
          top: 64,
          left: 0,
          width: 240,
          height: 'calc(100% - 64px)',
          background: 'rgba(15, 32, 39, 0.95)',
          backdropFilter: 'blur(5px)',
          color: '#fff',
          p: 2,
          display: { xs: 'none', md: 'block' }, // Visible on medium and up
          zIndex: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: '#00bcd4' }}>
          Navigation
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            startIcon={<HomeIcon />}
            onClick={() => router.push('/')}
            sx={{ justifyContent: 'flex-start', color: '#bbb', '&:hover': { color: '#00bcd4' } }}
          >
            Home
          </Button>
          <Button
            startIcon={<SettingsIcon />}
            onClick={() => router.push('/employee/settings')}
            sx={{ justifyContent: 'flex-start', color: '#bbb', '&:hover': { color: '#00bcd4' } }}
          >
            Settings
          </Button>
        </Box>
      </Box>
<FooterSection/>
    </Box>
  );
}