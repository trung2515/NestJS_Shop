import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentIcon from '@mui/icons-material/Payment';
import { cartApi } from '../api/cart';
import { CartItem } from '../api/types';

export function CartPage({ onCartChange }: { onCartChange: (count: number) => void }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState('12 Nguyen Trai Street, District 1, Ho Chi Minh City');
  const [message, setMessage] = useState('');

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
    [items],
  );

  const load = useCallback(async () => {
    const cart = await cartApi.get();
    setItems(cart.items ?? []);
    onCartChange(cart.items?.length ?? 0);
  }, [onCartChange]);

  useEffect(() => {
    load().catch(() => setMessage('Please sign in to view your cart.'));
  }, [load]);

  async function removeItem(id: string) {
    await cartApi.removeItem(id);
    await load();
  }

  async function checkout() {
    await cartApi.checkout({ shippingAddress: address, paymentProvider: 'COD Demo' });
    setMessage('Order placed successfully. The backend created the order in a transaction.');
    await load();
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={900}>
        Cart
      </Typography>
      {message && (
        <Alert severity="info" onClose={() => setMessage('')}>
          {message}
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
                  <Typography color="text.secondary">Quantity: {item.quantity}</Typography>
                  <Typography color="primary" fontWeight={900}>
                    {Number(item.product.price).toLocaleString('en-US')} VND
                  </Typography>
                </Box>
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
              label="Shipping address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              multiline
              minRows={3}
            />
            <Stack direction="row" justifyContent="space-between">
              <Typography>Total</Typography>
              <Typography fontWeight={900} color="primary">
                {total.toLocaleString('en-US')} VND
              </Typography>
            </Stack>
            <Button
              disabled={items.length === 0}
              variant="contained"
              size="large"
              startIcon={<PaymentIcon />}
              onClick={checkout}
            >
              Place order
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
