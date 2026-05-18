import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Alert, Grid, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import InsightsIcon from '@mui/icons-material/Insights';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { api } from '../api/client';

type Row = Record<string, string | number>;

export function AdminPage() {
  const [sales, setSales] = useState<Row[]>([]);
  const [topProducts, setTopProducts] = useState<Row[]>([]);
  const [lowStock, setLowStock] = useState<Row[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/admin/reports/sales'),
      api.get('/admin/reports/top-products'),
      api.get('/admin/reports/low-stock'),
    ])
      .then(([salesRes, topRes, lowRes]) => {
        setSales(salesRes.data);
        setTopProducts(topRes.data);
        setLowStock(lowRes.data);
      })
      .catch(() => setError('Can dang nhap bang tai khoan admin de xem dashboard.'));
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={900}>Admin dashboard</Typography>
      {error && <Alert severity="warning">{error}</Alert>}
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={4}>
          <Report title="Doanh thu theo ngay" icon={<InsightsIcon color="primary" />} rows={sales} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Report title="San pham ban chay" icon={<LeaderboardIcon color="primary" />} rows={topProducts} />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Report title="Ton kho thap" icon={<InventoryIcon color="primary" />} rows={lowStock} />
        </Grid>
      </Grid>
    </Stack>
  );
}

function Report({ title, icon, rows }: { title: string; icon: ReactNode; rows: Row[] }) {
  const keys = rows[0] ? Object.keys(rows[0]) : [];
  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid #e5e7eb', height: '100%' }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        {icon}
        <Typography variant="h6" fontWeight={900}>{title}</Typography>
      </Stack>
      <Table size="small">
        <TableHead>
          <TableRow>{keys.map((key) => <TableCell key={key}>{key}</TableCell>)}</TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              {keys.map((key) => <TableCell key={key}>{String(row[key])}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {rows.length === 0 && <Typography color="text.secondary">Chua co du lieu.</Typography>}
    </Paper>
  );
}
