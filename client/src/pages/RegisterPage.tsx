import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { authApi } from '../api/auth';
import { getApiErrorMessage, storeAuth } from '../api/client';
import { Session } from '../App';

export function RegisterPage({ session }: { session: Session }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please complete all required fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password confirmation does not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const auth = await authApi.register(fullName.trim(), email.trim(), password);
      storeAuth(auth);
      session.setUser(auth.user);
      navigate('/');
    } catch (registerError) {
      setError(getApiErrorMessage(registerError, 'Registration failed. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box maxWidth={500} mx="auto">
      <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb' }}>
        <Stack component="form" spacing={2.5} onSubmit={submit}>
          <Box>
            <Typography variant="h4" fontWeight={900}>
              Create account
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              New accounts are created as customers.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            required
            label="Full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
          <TextField
            required
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            required
            label="Password"
            type="password"
            value={password}
            helperText="At least 8 characters."
            onChange={(event) => setPassword(event.target.value)}
          />
          <TextField
            required
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          <Button
            type="submit"
            size="large"
            variant="contained"
            disabled={isSubmitting}
            startIcon={<PersonAddIcon />}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>

          <Typography variant="body2" color="text.secondary">
            Already have an account? <Link to="/login">Sign in</Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
