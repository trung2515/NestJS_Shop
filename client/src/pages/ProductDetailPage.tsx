import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { cartApi } from '../api/cart';
import { getApiErrorMessage } from '../api/client';
import { productsApi } from '../api/products';
import { Product } from '../api/types';

type Props = {
  onCartChange: (count: number) => void;
};

export function ProductDetailPage({ onCartChange }: Props) {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const primaryImage = useMemo(
    () =>
      product?.images?.find((image) => image.isPrimary)?.url ??
      product?.images?.[0]?.url ??
      'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=900&q=80',
    [product],
  );

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');

    productsApi
      .get(id)
      .then((item) => {
        setProduct(item);
        setSelectedImage(
          item.images?.find((image) => image.isPrimary)?.url ??
            item.images?.[0]?.url ??
            'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=900&q=80',
        );
      })
      .catch((detailError) =>
        setError(getApiErrorMessage(detailError, 'Could not load product details.')),
      )
      .finally(() => setLoading(false));
  }, [id]);

  async function addToCart() {
    if (!product) return;
    setError('');
    setMessage('');
    setIsAdding(true);

    try {
      await cartApi.addItem(product.id, quantity);
      const cart = await cartApi.get();
      onCartChange(cart.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0);
      setMessage('Added to cart.');
    } catch (cartError) {
      setError(getApiErrorMessage(cartError, 'Could not add product to cart.'));
    } finally {
      setIsAdding(false);
    }
  }

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error && !product) {
    return (
      <Stack spacing={2}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ alignSelf: 'flex-start' }}
        >
          Back to shop
        </Button>
        <Alert severity="error">{error}</Alert>
      </Stack>
    );
  }

  if (!product) return null;

  const displayImage = selectedImage || primaryImage;

  return (
    <Stack spacing={3}>
      <Button
        component={Link}
        to="/"
        startIcon={<ArrowBackIcon />}
        sx={{ alignSelf: 'flex-start' }}
      >
        Back to shop
      </Button>

      {message && (
        <Alert severity="success" onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        <Stack spacing={2}>
          <Paper elevation={0} sx={{ overflow: 'hidden', border: '1px solid #e5e7eb' }}>
            <Box
              component="img"
              src={displayImage}
              alt={product.name}
              sx={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', display: 'block' }}
            />
          </Paper>
          {product.images && product.images.length > 1 && (
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {product.images.map((image) => (
                <Box
                  key={image.id}
                  component="button"
                  onClick={() => setSelectedImage(image.url)}
                  sx={{
                    width: 88,
                    height: 68,
                    p: 0,
                    border: displayImage === image.url ? '2px solid #1976d2' : '1px solid #e5e7eb',
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                >
                  <Box
                    component="img"
                    src={image.url}
                    alt={product.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </Box>
              ))}
            </Stack>
          )}
        </Stack>

        <Paper elevation={0} sx={{ p: 3, border: '1px solid #e5e7eb', height: 'fit-content' }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip label={product.category?.name ?? 'Shop'} color="primary" />
              <Chip label={product.brand} variant="outlined" />
              <Chip
                label={product.stock > 0 ? `Stock ${product.stock}` : 'Out of stock'}
                color={product.stock > 0 ? 'default' : 'error'}
                variant="outlined"
              />
            </Stack>

            <Box>
              <Typography variant="h4" fontWeight={900}>
                {product.name}
              </Typography>
              <Typography variant="h5" color="primary" fontWeight={900} sx={{ mt: 1 }}>
                {Number(product.price).toLocaleString('en-US')} VND
              </Typography>
            </Box>

            <Typography color="text.secondary">{product.description}</Typography>
            <Divider />

            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(event) =>
                setQuantity(Math.min(product.stock, Math.max(1, Number(event.target.value))))
              }
              inputProps={{ min: 1, max: product.stock }}
              sx={{ maxWidth: 160 }}
            />

            <Button
              size="large"
              variant="contained"
              startIcon={<AddShoppingCartIcon />}
              disabled={product.stock === 0 || isAdding}
              onClick={addToCart}
            >
              {isAdding ? 'Adding...' : 'Add to cart'}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
