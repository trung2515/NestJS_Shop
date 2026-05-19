import { useEffect, useState } from 'react';
import { Alert, Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { getApiErrorMessage } from '../api/client';
import { ordersApi } from '../api/orders';
import { Order } from '../api/types';

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    ordersApi
      .list()
      .then(setOrders)
      .catch((ordersError) =>
        setError(getApiErrorMessage(ordersError, 'Please sign in to view your orders.')),
      );
  }, []);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={1} alignItems="center">
        <ReceiptLongIcon color="primary" />
        <Typography variant="h4" fontWeight={900}>
          Orders
        </Typography>
      </Stack>

      {error && <Alert severity="warning">{error}</Alert>}

      <Stack spacing={2}>
        {orders.map((order) => (
          <Paper key={order.id} elevation={0} sx={{ p: 2.5, border: '1px solid #e5e7eb' }}>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1}>
                <Box>
                  <Typography fontWeight={900}>Order #{order.id.slice(0, 8)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.createdAt).toLocaleString('en-US')}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip size="small" color="primary" label={order.status} />
                  <Typography fontWeight={900} color="primary">
                    {Number(order.totalAmount).toLocaleString('en-US')} VND
                  </Typography>
                </Stack>
              </Stack>

              <Divider />

              <Stack spacing={1}>
                {order.items.map((item) => (
                  <Stack
                    key={item.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                  >
                    <Box>
                      <Typography fontWeight={800}>{item.product.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                    </Box>
                    <Typography fontWeight={800}>
                      {Number(item.unitPrice).toLocaleString('en-US')} VND
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Typography variant="body2" color="text.secondary">
                Shipping to: {order.shippingAddress}
              </Typography>
            </Stack>
          </Paper>
        ))}

        {!error && orders.length === 0 && (
          <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb' }}>
            You have not placed any orders yet.
          </Paper>
        )}
      </Stack>
    </Stack>
  );
}
