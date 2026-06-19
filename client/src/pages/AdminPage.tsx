import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import InsightsIcon from '@mui/icons-material/Insights';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { adminApi } from '../api/admin';
import { ProductPayload, productsApi } from '../api/products';
import { AdminOrder, Category, Order, Product, ReportRow } from '../api/types';

const emptyProductForm = {
  name: '',
  slug: '',
  brand: '',
  description: '',
  price: '',
  stock: '',
  categoryId: '',
  imageUrls: '',
};

const orderStatuses: Order['status'][] = ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED'];

export function AdminPage() {
  const [sales, setSales] = useState<ReportRow[]>([]);
  const [topProducts, setTopProducts] = useState<ReportRow[]>([]);
  const [lowStock, setLowStock] = useState<ReportRow[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState<Order['status'] | 'ALL'>('ALL');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(emptyProductForm);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadAdminData = useCallback(async () => {
    const [salesReport, topProductsReport, lowStockReport, orderRows, productRows, categoryRows] =
      await Promise.all([
        adminApi.salesReport(),
        adminApi.topProducts(),
        adminApi.lowStock(),
        adminApi.orders(),
        productsApi.list(),
        productsApi.categories(),
      ]);

    setSales(salesReport);
    setTopProducts(topProductsReport);
    setLowStock(lowStockReport);
    setOrders(orderRows);
    setProducts(productRows);
    setCategories(categoryRows);
  }, []);

  useEffect(() => {
    loadAdminData().catch(() =>
      setError('Please sign in with an admin account to view the dashboard.'),
    );
  }, [loadAdminData]);

  function setField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function editProduct(product: Product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      description: product.description,
      price: String(Number(product.price)),
      stock: String(product.stock),
      categoryId: product.category.id,
      imageUrls: product.images?.map((image) => image.url).join('\n') ?? '',
    });
  }

  function resetForm() {
    setEditingId('');
    setForm(emptyProductForm);
  }

  async function saveProduct() {
    setError('');
    setMessage('');

    const payload: ProductPayload = {
      name: form.name,
      slug: form.slug,
      brand: form.brand,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: form.categoryId,
      imageUrls: form.imageUrls
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await productsApi.update(editingId, payload);
        setMessage('Product updated.');
      } else {
        await productsApi.create(payload);
        setMessage('Product created.');
      }
      resetForm();
      await loadAdminData();
    } catch {
      setError('Could not save product. Check required fields, unique slug, and category.');
    }
  }

  async function removeProduct() {
    if (!productToDelete) return;
    setError('');
    setMessage('');
    setIsDeleting(true);
    try {
      await productsApi.remove(productToDelete.id);
      setMessage('Product removed from the shop.');
      setProductToDelete(null);
      await loadAdminData();
    } catch {
      setError('Could not delete product.');
    } finally {
      setIsDeleting(false);
    }
  }

  async function updateOrderStatus(orderId: string, status: Order['status']) {
    setError('');
    setMessage('');
    setUpdatingOrderId(orderId);
    try {
      await adminApi.updateOrderStatus(orderId, status);
      setMessage('Order status updated.');
      await loadAdminData();
    } catch {
      setError('Could not update order status.');
    } finally {
      setUpdatingOrderId('');
    }
  }

  const displayedOrders =
    orderStatusFilter === 'ALL'
      ? orders
      : orders.filter((order) => order.status === orderStatusFilter);

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={900}>
        Admin dashboard
      </Typography>
      {error && <Alert severity="warning">{error}</Alert>}
      {message && (
        <Alert severity="success" onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e5e7eb' }}>
        <Stack spacing={2.5}>
          <Typography variant="h6" fontWeight={900}>
            Product management
          </Typography>
          <Box className="grid gap-3 lg:grid-cols-4">
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
            />
            <TextField
              label="Slug"
              value={form.slug}
              onChange={(e) => setField('slug', e.target.value)}
            />
            <TextField
              label="Brand"
              value={form.brand}
              onChange={(e) => setField('brand', e.target.value)}
            />
            <TextField
              select
              label="Category"
              value={form.categoryId}
              onChange={(e) => setField('categoryId', e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Price"
              type="number"
              value={form.price}
              onChange={(e) => setField('price', e.target.value)}
            />
            <TextField
              label="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setField('stock', e.target.value)}
            />
            <TextField
              className="lg:col-span-2"
              label="Image URLs"
              value={form.imageUrls}
              onChange={(e) => setField('imageUrls', e.target.value)}
              multiline
              minRows={1}
            />
            <TextField
              className="lg:col-span-4"
              label="Description"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              multiline
              minRows={2}
            />
          </Box>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={saveProduct}>
              {editingId ? 'Save changes' : 'Create product'}
            </Button>
            {editingId && (
              <Button variant="outlined" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </Stack>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Typography fontWeight={800}>{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.brand}
                    </Typography>
                  </TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>{Number(product.price).toLocaleString('en-US')} VND</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => editProduct(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setProductToDelete(product)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Stack>
      </Paper>

      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e5e7eb' }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
            <Typography variant="h6" fontWeight={900}>
              Order management
            </Typography>
            <TextField
              select
              size="small"
              label="Status"
              value={orderStatusFilter}
              onChange={(event) =>
                setOrderStatusFilter(event.target.value as Order['status'] | 'ALL')
              }
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="ALL">All orders</MenuItem>
              {orderStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Typography fontWeight={800}>#{order.id.slice(0, 8)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(order.createdAt).toLocaleString('en-US')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={800}>{order.user.fullName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{order.items.length} item(s)</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.items
                        .map((item) => `${item.product.name} x${item.quantity}`)
                        .join(', ')}
                    </Typography>
                  </TableCell>
                  <TableCell>{Number(order.totalAmount).toLocaleString('en-US')} VND</TableCell>
                  <TableCell>
                    {order.payment ? (
                      <Stack spacing={0.5}>
                        <Chip size="small" label={order.payment.provider} />
                        <Typography variant="body2" color="text.secondary">
                          {order.payment.status}
                        </Typography>
                      </Stack>
                    ) : (
                      'No payment'
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      value={order.status}
                      disabled={updatingOrderId === order.id}
                      onChange={(event) =>
                        updateOrderStatus(order.id, event.target.value as Order['status'])
                      }
                    >
                      {orderStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {displayedOrders.length === 0 && (
            <Typography color="text.secondary">No orders match this status.</Typography>
          )}
        </Stack>
      </Paper>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={4}>
          <Report title="Daily sales" icon={<InsightsIcon color="primary" />} rows={sales} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Report
            title="Top products"
            icon={<LeaderboardIcon color="primary" />}
            rows={topProducts}
          />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Report title="Low stock" icon={<InventoryIcon color="primary" />} rows={lowStock} />
        </Grid>
      </Grid>

      <Dialog open={Boolean(productToDelete)} onClose={() => setProductToDelete(null)}>
        <DialogTitle>Delete product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Remove {productToDelete?.name} from the shop? Existing orders keep their historical item
            data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={isDeleting} onClick={() => setProductToDelete(null)}>
            Cancel
          </Button>
          <Button color="error" variant="contained" disabled={isDeleting} onClick={removeProduct}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

function Report({ title, icon, rows }: { title: string; icon: ReactNode; rows: ReportRow[] }) {
  const keys = rows[0] ? Object.keys(rows[0]) : [];
  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid #e5e7eb', height: '100%' }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        {icon}
        <Typography variant="h6" fontWeight={900}>
          {title}
        </Typography>
      </Stack>
      <Table size="small">
        <TableHead>
          <TableRow>
            {keys.map((key) => (
              <TableCell key={key}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              {keys.map((key) => (
                <TableCell key={key}>{String(row[key])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {rows.length === 0 && <Typography color="text.secondary">No data yet.</Typography>}
    </Paper>
  );
}
