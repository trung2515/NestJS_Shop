import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
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
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { cartApi } from './api/cart';
import { clearStoredAuth, isStoredSessionExpired } from './api/client';
import { AuthUser } from './api/types';
import { AdminPage } from './pages/AdminPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProductsPage } from './pages/ProductsPage';

export type Session = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
};

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (isStoredSessionExpired()) {
      clearStoredAuth();
      return null;
    }
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const session = useMemo(() => ({ user, setUser }), [user]);

  useEffect(() => {
    if (!user) navigate('/login', { replace: true });
  }, [navigate, user]);

  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }
    if (user.role === 'CUSTOMER') {
      cartApi
        .get()
        .then((cart) =>
          setCartCount(cart.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0),
        )
        .catch(() => setCartCount(0));
    } else {
      setCartCount(0);
    }
  }, [user]);

  function logout() {
    clearStoredAuth();
    setUser(null);
    navigate('/login');
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
          {user?.role === 'CUSTOMER' && (
            <Button component={Link} to="/" startIcon={<StorefrontIcon />}>
              Shop
            </Button>
          )}
          {user?.role === 'ADMIN' && (
            <Button component={Link} to="/admin" startIcon={<DashboardIcon />}>
              Admin
            </Button>
          )}
          {user ? (
            <>
              {user.role === 'CUSTOMER' && (
                <>
                  <Button component={Link} to="/orders" startIcon={<ReceiptLongIcon />}>
                    Orders
                  </Button>
                  <IconButton component={Link} to="/cart" aria-label="cart">
                    <Badge badgeContent={cartCount} color="primary">
                      <ShoppingCartIcon />
                    </Badge>
                  </IconButton>
                </>
              )}
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
            element={
              user?.role === 'CUSTOMER' ? (
                <ProductsPage session={session} onCartChange={setCartCount} />
              ) : user?.role === 'ADMIN' ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <LoginPage session={session} />}
          />
          <Route
            path="/cart"
            element={
              user ? <CartPage onCartChange={setCartCount} /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/orders"
            element={user ? <OrdersPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/admin"
            element={user?.role === 'ADMIN' ? <AdminPage /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
        </Routes>
      </Container>
    </Box>
  );
}
