import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { authApi } from '../api/auth';
import { Session } from '../App';

export function LoginPage({ session }: { session: Session }) {
  const [email, setEmail] = useState('admin@shopnest.com');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const auth = await authApi.login(email, password);
      localStorage.setItem('accessToken', auth.accessToken);
      localStorage.setItem('user', JSON.stringify(auth.user));
      session.setUser(auth.user);
      navigate('/');
    } catch {
      setError('Login failed. Please check your email and password.');
    }
  }

  return (
    <Box maxWidth={460} mx="auto">
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb' }}>
        <Stack component="form" spacing={2.5} onSubmit={submit}>
          <Typography variant="h4" fontWeight={900}>
            Sign in
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button type="submit" size="large" variant="contained" startIcon={<LoginIcon />}>
            Sign in
          </Button>
          <Typography variant="body2" color="text.secondary">
            Admin: admin@shopnest.com / Admin123! | Customer: linh@example.com / Customer123!
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
