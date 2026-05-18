import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { api } from '../api/client';
import { Session } from '../App';

export function LoginPage({ session }: { session: Session }) {
  const [email, setEmail] = useState('admin@shopnest.local');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      session.setUser(res.data.user);
      navigate('/');
    } catch {
      setError('Dang nhap that bai. Kiem tra email va mat khau.');
    }
  }

  return (
    <Box maxWidth={460} mx="auto">
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb' }}>
        <Stack component="form" spacing={2.5} onSubmit={submit}>
          <Typography variant="h4" fontWeight={900}>Dang nhap</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <TextField label="Mat khau" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <Button type="submit" size="large" variant="contained" startIcon={<LoginIcon />}>Dang nhap</Button>
          <Typography variant="body2" color="text.secondary">
            Admin: admin@shopnest.local / Admin123! | Customer: linh@example.com / Customer123!
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
