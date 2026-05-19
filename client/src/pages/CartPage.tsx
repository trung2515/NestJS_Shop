import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentIcon from '@mui/icons-material/Payment';
import { api } from '../api/client';

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: string;
    stock: number;
    images?: { url: string }[];
  };
};

export function CartPage({ onCartChange }: { onCartChange: (count: number) => void }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState('12 Nguyen Trai, Quan 1, TP HCM');
  const [message, setMessage] = useState('');

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
    [items],
  );

  const load = useCallback(async () => {
    const res = await api.get('/cart');
    setItems(res.data?.items ?? []);
    onCartChange(res.data?.items?.length ?? 0);
  }, [onCartChange]);

  useEffect(() => {
    load().catch(() => setMessage('Can dang nhap de xem gio hang.'));
  }, [load]);

  async function removeItem(id: string) {
    await api.delete(`/cart/items/${id}`);
    await load();
  }

  async function checkout() {
    await api.post('/orders/checkout', { shippingAddress: address, paymentProvider: 'COD Demo' });
    setMessage('Dat hang thanh cong. Backend da tao order bang transaction va tru ton kho.');
    await load();
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={900}>
        Gio hang
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
                  <Typography color="text.secondary">So luong: {item.quantity}</Typography>
                  <Typography color="primary" fontWeight={900}>
                    {Number(item.product.price).toLocaleString('vi-VN')} d
                  </Typography>
                </Box>
                <Button
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => removeItem(item.id)}
                >
                  Xoa
                </Button>
              </Stack>
            </Paper>
          ))}
          {items.length === 0 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb' }}>
              Gio hang dang trong.
            </Paper>
          )}
        </Stack>

        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', height: 'fit-content' }}>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={900}>
              Thanh toan
            </Typography>
            <Divider />
            <TextField
              label="Dia chi giao hang"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              multiline
              minRows={3}
            />
            <Stack direction="row" justifyContent="space-between">
              <Typography>Tong tien</Typography>
              <Typography fontWeight={900} color="primary">
                {total.toLocaleString('vi-VN')} d
              </Typography>
            </Stack>
            <Button
              disabled={items.length === 0}
              variant="contained"
              size="large"
              startIcon={<PaymentIcon />}
              onClick={checkout}
            >
              Dat hang
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
