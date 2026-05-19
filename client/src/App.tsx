import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { api, AuthUser } from './api/client';
import { AdminPage } from './pages/AdminPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';

export type Session = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
};

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const session = useMemo(() => ({ user, setUser }), [user]);

  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }
    api
      .get('/cart')
      .then((res) => setCartCount(res.data?.items?.length ?? 0))
      .catch(() => setCartCount(0));
  }, [user]);

  function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  }

  return (
    <Box minHeight="100vh">
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: '1px solid #e5e7eb' }}
      >
        <Toolbar>
          <StorefrontIcon color="primary" />
          <Typography
            component={Link}
            to="/"
            variant="h6"
            fontWeight={900}
            sx={{ ml: 1, flexGrow: 1 }}
          >
            ShopNest
          </Typography>
          <Button component={Link} to="/" startIcon={<StorefrontIcon />}>
            Shop
          </Button>
          {user?.role === 'ADMIN' && (
            <Button component={Link} to="/admin" startIcon={<DashboardIcon />}>
              Admin
            </Button>
          )}
          {user ? (
            <>
              <IconButton component={Link} to="/cart" aria-label="cart">
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <Button onClick={logout} startIcon={<LogoutIcon />}>
                Logout
              </Button>
            </>
          ) : (
            <Button component={Link} to="/login" startIcon={<LoginIcon />}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Routes>
          <Route
            path="/"
            element={<ProductsPage session={session} onCartChange={setCartCount} />}
          />
          <Route path="/login" element={<LoginPage session={session} />} />
          <Route path="/cart" element={<CartPage onCartChange={setCartCount} />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Container>
    </Box>
  );
}
