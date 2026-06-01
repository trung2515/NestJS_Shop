import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { cartApi } from '../api/cart';
import { productsApi } from '../api/products';
import { Category, Product } from '../api/types';
import { Session } from '../App';

type Props = {
  session: Session;
  onCartChange: (count: number) => void;
};

export function ProductsPage({ session, onCartChange }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [q, setQ] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const hasFilters = Boolean(q.trim() || categoryId);

  useEffect(() => {
    productsApi.categories().then(setCategories);
  }, []);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError('');

    productsApi
      .list({ categoryId, q: q.trim() })
      .then((items) => {
        if (!ignore) setProducts(items);
      })
      .catch(() => {
        if (!ignore) setError('Could not load products. Please try again.');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [categoryId, q]);

  function clearFilters() {
    setQ('');
    setCategoryId('');
  }

  async function addToCart(productId: string) {
    if (!session.user) {
      setMessage('Please sign in to add products to your cart.');
      return;
    }
    await cartApi.addItem(productId);
    const cart = await cartApi.get();
    onCartChange(cart.items?.length ?? 0);
    setMessage('Added to cart.');
  }

  return (
    <Stack spacing={3}>
      <Box className="grid gap-4 md:grid-cols-[1.2fr_0.8fr] items-end">
        <Box>
          <Typography variant="h3" fontWeight={900}>
            ShopNest
          </Typography>
          <Typography color="text.secondary" maxWidth={640}>
            E-commerce demo built with NestJS, PostgreSQL transactions, JWT, and SQL reports.
          </Typography>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label="Search products"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Name, brand, description..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            label="Category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            sx={{ minWidth: 190 }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="outlined" disabled={!hasFilters} onClick={clearFilters} sx={{ px: 3 }}>
            Clear
          </Button>
        </Stack>
      </Box>

      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        <Chip
          label="All products"
          color={!categoryId ? 'primary' : 'default'}
          variant={!categoryId ? 'filled' : 'outlined'}
          onClick={() => setCategoryId('')}
        />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            color={categoryId === category.id ? 'primary' : 'default'}
            variant={categoryId === category.id ? 'filled' : 'outlined'}
            onClick={() => setCategoryId(category.id)}
          />
        ))}
      </Stack>

      {message && (
        <Alert severity="success" onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {loading && (
        <Stack alignItems="center" sx={{ py: 8 }}>
          <CircularProgress />
        </Stack>
      )}

      {!loading && !error && products.length === 0 && (
        <Paper elevation={0} sx={{ border: '1px solid #e5e7eb', p: 4, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={800}>
            No products found
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Try another keyword or category.
          </Typography>
          {hasFilters && (
            <Button variant="contained" onClick={clearFilters} sx={{ mt: 2 }}>
              Show all products
            </Button>
          )}
        </Paper>
      )}

      {!loading && !error && products.length > 0 && (
        <Grid container spacing={2.5}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} lg={4} xl={3} key={product.id}>
              <Paper
                sx={{ height: '100%', overflow: 'hidden', border: '1px solid #e5e7eb' }}
                elevation={0}
              >
                <Box
                  component="img"
                  src={
                    product.images?.find((image) => image.isPrimary)?.url ??
                    product.images?.[0]?.url ??
                    'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=900&q=80'
                  }
                  alt={product.name}
                  sx={{
                    width: '100%',
                    aspectRatio: '4 / 3',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <Stack spacing={1.5} sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Chip size="small" label={product.category?.name ?? 'Shop'} />
                    <Typography
                      variant="caption"
                      color={product.stock <= 10 ? 'error' : 'text.secondary'}
                    >
                      Stock {product.stock}
                    </Typography>
                  </Stack>
                  <Box minHeight={88}>
                    <Typography variant="h6" fontWeight={850}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.brand}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {product.description}
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary" fontWeight={900}>
                    {Number(product.price).toLocaleString('en-US')} VND
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => addToCart(product.id)}
                    >
                      Add
                    </Button>
                    <Button component={Link} to="/cart" variant="outlined">
                      Cart
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
