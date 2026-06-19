import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import PaymentIcon from '@mui/icons-material/Payment';
import { Link } from 'react-router-dom';
import { cartApi } from '../api/cart';
import { getApiErrorMessage } from '../api/client';
import { ordersApi } from '../api/orders';
import { CartItem, Order } from '../api/types';

export function CartPage({ onCartChange }: { onCartChange: (count: number) => void }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [receiverName, setReceiverName] = useState('Nguyen Khanh Linh');
  const [phone, setPhone] = useState('0900000002');
  const [line1, setLine1] = useState('12 Nguyen Trai Street');
  const [district, setDistrict] = useState('District 1');
  const [city, setCity] = useState('Ho Chi Minh City');
  const [paymentProvider, setPaymentProvider] = useState('COD');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState('');

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
    [items],
  );
  const canCheckout = Boolean(
    receiverName.trim() && phone.trim() && line1.trim() && district.trim() && city.trim(),
  );

  const load = useCallback(async () => {
    const cart = await cartApi.get();
    setItems(cart.items ?? []);
    onCartChange(cart.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0);
  }, [onCartChange]);

  useEffect(() => {
    load().catch(() => setMessage('Please sign in to view your cart.'));
  }, [load]);

  async function removeItem(id: string) {
    await cartApi.removeItem(id);
    await load();
  }

  async function updateQuantity(item: CartItem, quantity: number) {
    if (quantity < 1 || quantity === item.quantity) return;
    setError('');
    setUpdatingItemId(item.id);
    try {
      await cartApi.updateItem(item.id, quantity);
      await load();
    } catch (quantityError) {
      setError(getApiErrorMessage(quantityError, 'Could not update quantity.'));
    } finally {
      setUpdatingItemId('');
    }
  }

  async function checkout() {
    setError('');
    setMessage('');
    setCompletedOrder(null);
    if (!canCheckout) {
      setError('Please complete receiver, phone, and shipping address before checkout.');
      return;
    }
    setIsCheckingOut(true);

    try {
      const order = await ordersApi.checkout({
        receiverName,
        phone,
        line1,
        district,
        city,
        paymentProvider,
      });
      setCompletedOrder(order);
      setMessage('Order placed successfully. The backend created the order in a transaction.');
      await load();
    } catch (checkoutError) {
      setError(getApiErrorMessage(checkoutError, 'Could not place order. Please try again.'));
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={900}>
        Cart
      </Typography>
      {message && (
        <Alert severity="info" onClose={() => setMessage('')}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
            <span>{message}</span>
            {completedOrder && (
              <Button component={Link} to="/orders" size="small" variant="outlined">
                View order #{completedOrder.id.slice(0, 8)}
              </Button>
            )}
          </Stack>
        </Alert>
      )}
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Stack spacing={2}>
          {items.map((item) => (
            <Paper key={item.id} elevation={0} sx={{ p: 2, border: '1px solid #e5e7eb' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  component="img"
                  src={item.product.images?.[0]?.url ?? 'https://picsum.photos/seed/cart/200/160'}
                  alt={item.product.name}
                  sx={{ width: 96, height: 76, objectFit: 'cover', borderRadius: 1 }}
                />
                <Box flexGrow={1}>
                  <Typography fontWeight={850}>{item.product.name}</Typography>
                  <Typography color="primary" fontWeight={900}>
                    {Number(item.product.price).toLocaleString('en-US')} VND
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Subtotal: {(Number(item.product.price) * item.quantity).toLocaleString('en-US')}{' '}
                    VND
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={updatingItemId === item.id || item.quantity <= 1}
                    onClick={() => updateQuantity(item, item.quantity - 1)}
                    sx={{ minWidth: 36, px: 1 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </Button>
                  <TextField
                    type="number"
                    size="small"
                    value={item.quantity}
                    disabled={updatingItemId === item.id}
                    onChange={(event) => updateQuantity(item, Number(event.target.value))}
                    inputProps={{ min: 1, max: item.product.stock, style: { textAlign: 'center' } }}
                    sx={{ width: 76 }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={updatingItemId === item.id || item.quantity >= item.product.stock}
                    onClick={() => updateQuantity(item, item.quantity + 1)}
                    sx={{ minWidth: 36, px: 1 }}
                  >
                    <AddIcon fontSize="small" />
                  </Button>
                </Stack>
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </Button>
              </Stack>
            </Paper>
          ))}
          {items.length === 0 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb' }}>
              Your cart is empty.
            </Paper>
          )}
        </Stack>

        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', height: 'fit-content' }}>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={900}>
              Checkout
            </Typography>
            <Divider />
            <TextField
              required
              label="Receiver name"
              value={receiverName}
              onChange={(event) => setReceiverName(event.target.value)}
            />
            <TextField
              required
              label="Phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <TextField
              required
              label="Address line"
              value={line1}
              onChange={(event) => setLine1(event.target.value)}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                required
                fullWidth
                label="District"
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
              />
              <TextField
                required
                fullWidth
                label="City"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </Stack>
            <TextField
              select
              label="Payment method"
              value={paymentProvider}
              onChange={(event) => setPaymentProvider(event.target.value)}
            >
              <MenuItem value="COD">Cash on delivery</MenuItem>
              <MenuItem value="BANK_TRANSFER">Bank transfer</MenuItem>
              <MenuItem value="MOMO">MoMo</MenuItem>
            </TextField>
            <Typography variant="body2" color="text.secondary">
              COD creates a pending payment. Digital methods are marked paid in this demo.
            </Typography>
            <Stack direction="row" justifyContent="space-between">
              <Typography>Total</Typography>
              <Typography fontWeight={900} color="primary">
                {total.toLocaleString('en-US')} VND
              </Typography>
            </Stack>
            <Button
              disabled={items.length === 0 || isCheckingOut || !canCheckout}
              variant="contained"
              size="large"
              startIcon={<PaymentIcon />}
              onClick={checkout}
            >
              {isCheckingOut ? 'Placing order...' : 'Place order'}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
