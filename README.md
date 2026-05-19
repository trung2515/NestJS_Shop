# ShopNest

Full-stack demo web ban hang dung NestJS, PostgreSQL, React, MUI va Tailwind.

## Cau truc

- `server`: NestJS REST API, JWT auth, TypeORM, PostgreSQL migrations va seed data.
- `client`: React + Vite + MUI + Tailwind UI.
- `docker-compose.yml`: PostgreSQL va pgAdmin4.

## Chay nhanh

```bash
npm install
npm run db:up
npm run migrate
npm run seed
npm run dev
```

Server: http://localhost:3000  
Client: http://localhost:5173  
pgAdmin: http://localhost:5050

pgAdmin login:

- Email: `admin@shopnest.com`
- Password: `admin123`

PostgreSQL connection:

- Host: `postgres` khi dung trong Docker network, hoac `localhost` tu may local
- Port: `5433` tu may local, `5432` ben trong Docker network
- Database: `shopnest`
- Username: `shopnest`
- Password: `shopnest123`

Tai khoan demo:

- Admin: `admin@shopnest.com` / `Admin123!`
- Customer: `linh@example.com` / `Customer123!`

## API noi bat

- `POST /auth/register`
- `POST /auth/login`
- `GET /products`
- `POST /products` admin only
- `GET /cart`
- `POST /cart/items`
- `POST /orders/checkout`
- `GET /admin/reports/sales`
- `GET /admin/reports/top-products`
- `GET /admin/reports/low-stock`
