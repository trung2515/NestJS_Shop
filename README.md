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

Server: http://localhost:4001  
Client: http://localhost:4000  
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
- Customer: `minh@example.com` / `Customer123!`
- Customer: `an@example.com` / `Customer123!`

Phan quyen:

- Admin chi quan ly san pham: them, sua, xoa mem san pham va xem bao cao.
- Customer moi co gio hang, checkout va lich su don hang.
- Backend chan `cart` va `orders` bang role `CUSTOMER`; mutation san pham bi chan bang role `ADMIN`.

Seed data:

- Du lieu duoc chia theo bang quan he: `users`, `addresses`, `categories`, `products`, `product_images`, `carts`, `orders`, `order_items`, `payments`, `reviews`.
- Seed tao nhieu customer, dia chi, don hang theo nhieu ngay, order status va payment status khac nhau de hoc SQL/report.
- Report admin dung `orders`, `order_items`, `products`, `payments` de tinh revenue, top products va low stock.

## API noi bat

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /products`
- `POST /products` admin only
- `GET /cart`
- `POST /cart/items`
- `POST /orders/checkout`
- `GET /admin/reports/sales`
- `GET /admin/reports/top-products`
- `GET /admin/reports/low-stock`

## Dang nhap va token

- Client bat buoc dang nhap truoc khi vao shop, cart, orders va admin.
- Access token mac dinh het han sau `15m`.
- Refresh token mac dinh het han sau `7d` va khong duoc gia han tu dong.
- Sau 1 tuan, user phai dang nhap lai de nhan refresh token moi.
