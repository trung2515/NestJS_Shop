# ShopNest

ShopNest là một full-stack e-commerce demo dùng để học cách xây dựng API, authentication, phân quyền, transaction, quan hệ dữ liệu và báo cáo SQL trong một ứng dụng bán hàng.

Project gồm:

- `client`: React + Vite + Material UI + Tailwind CSS.
- `server`: NestJS REST API + TypeORM + PostgreSQL + JWT authentication.
- `docker-compose.yml`: PostgreSQL và pgAdmin phục vụ môi trường local.

## Tính Năng Chính

Customer:

- Đăng nhập bắt buộc trước khi vào shop.
- Xem danh sách sản phẩm.
- Search sản phẩm theo tên, slug, brand, mô tả và category.
- Lọc theo category, khoảng giá và sort theo giá/tồn kho/mới nhất.
- Xem chi tiết sản phẩm.
- Thêm sản phẩm vào giỏ hàng.
- Tăng, giảm, cập nhật số lượng sản phẩm trong giỏ.
- Checkout với thông tin người nhận, số điện thoại, địa chỉ và phương thức thanh toán.
- Xem lịch sử đơn hàng.

Admin:

- Không thể order hoặc dùng cart.
- Thêm, sửa, xóa mềm sản phẩm.
- Xem báo cáo doanh thu theo ngày.
- Xem top sản phẩm bán chạy.
- Xem sản phẩm sắp hết hàng.
- Xem danh sách đơn hàng.
- Lọc đơn hàng theo trạng thái.
- Cập nhật trạng thái đơn hàng.

Authentication:

- Access token hết hạn sau `15m`.
- Refresh token hết hạn sau `7d`.
- Sau 7 ngày, user phải đăng nhập lại.
- Frontend tự refresh access token khi API trả `401`, nếu refresh token còn hạn.

## Công Nghệ

Frontend:

- React 19
- React Router
- Vite
- TypeScript
- Material UI
- Tailwind CSS
- Axios

Backend:

- NestJS 10
- TypeScript
- TypeORM
- PostgreSQL
- Passport JWT
- class-validator
- bcrypt
- Helmet

Tooling:

- npm workspaces
- ESLint
- Prettier
- Docker Compose

## Yêu Cầu Môi Trường

Cần cài sẵn:

- Node.js
- npm
- Docker Desktop hoặc Docker Engine

Project đang dùng npm workspaces, nên chạy lệnh từ thư mục root là đủ cho cả `client` và `server`.

## Cài Đặt Từ Đầu

Clone project:

```bash
git clone <repository-url>
cd Setting_Goal
```

Cài dependencies:

```bash
npm install
```

Tạo file môi trường cho server:

Windows PowerShell:

```powershell
Copy-Item server\.env.example server\.env
```

macOS/Linux:

```bash
cp server/.env.example server/.env
```

Nội dung mặc định trong `server/.env.example`:

```env
DB_HOST=localhost
DB_PORT=5433
DB_USER=shopnest
DB_PASSWORD=shopnest123
DB_NAME=shopnest
JWT_SECRET=shopnest_super_secret_change_me
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=shopnest_refresh_secret_change_me
JWT_REFRESH_EXPIRES_IN=7d
PORT=4001
CLIENT_URL=http://localhost:4000
```

Khởi động PostgreSQL và pgAdmin:

```bash
npm run db:up
```

Chạy migration:

```bash
npm run migrate
```

Seed dữ liệu mẫu:

```bash
npm run seed
```

Chạy client và server:

```bash
npm run dev
```

Sau khi chạy thành công:

- Client: http://localhost:4000
- Server API: http://localhost:4001
- pgAdmin: http://localhost:5050


## pgAdmin

Đăng nhập pgAdmin:

- Email: `admin@shopnest.com`
- Password: `admin123`

Kết nối PostgreSQL từ pgAdmin:

- Host: `postgres`
- Port: `5432`
- Database: `shopnest`
- Username: `shopnest`
- Password: `shopnest123`

Kết nối PostgreSQL từ máy local:

- Host: `localhost`
- Port: `5433`
- Database: `shopnest`
- Username: `shopnest`
- Password: `shopnest123`

## Tài Khoản Demo

Admin:

- Email: `admin@shopnest.com`
- Password: `Admin123!`

Customers:

- Email: `linh@example.com`
- Password: `Customer123!`

- Email: `minh@example.com`
- Password: `Customer123!`

- Email: `an@example.com`
- Password: `Customer123!`

## Phân Quyền

Project có 2 role:

- `ADMIN`
- `CUSTOMER`

Rule hiện tại:

- Admin chỉ quản lý sản phẩm, đơn hàng và báo cáo.
- Admin không thể dùng cart hoặc checkout.
- Customer mới có cart, checkout và lịch sử đơn hàng.
- API `cart` và `orders` bị chặn bằng role `CUSTOMER`.
- API tạo, sửa, xóa sản phẩm bị chặn bằng role `ADMIN`.
- API admin report và admin orders bị chặn bằng role `ADMIN`.
- Các trang frontend cũng redirect theo role tương ứng.

## Scripts

Chạy từ root:

```bash
npm run dev
```

Chạy server dev:

```bash
npm run server
```

Chạy client dev:

```bash
npm run client
```

Khởi động database:

```bash
npm run db:up
```

Dừng database:

```bash
npm run db:down
```

Chạy migration:

```bash
npm run migrate
```

Seed dữ liệu:

```bash
npm run seed
```

Format code:

```bash
npm run format
```

Lint:

```bash
npm run lint
```

Kiểm tra style:

```bash
npm run style:check
```

Build client:

```bash
npm run build -w client
```

Build server:

```bash
npm run build -w server
```

## Cấu Trúc Thư Mục

```text
.
├── client
│   ├── src
│   │   ├── api
│   │   ├── pages
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── vite.config.ts
│   └── package.json
├── server
│   ├── src
│   │   ├── admin
│   │   ├── auth
│   │   ├── cart
│   │   ├── categories
│   │   ├── common
│   │   ├── database
│   │   ├── orders
│   │   ├── products
│   │   ├── reviews
│   │   ├── users
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   └── package.json
├── docker-compose.yml
├── package.json
└── README.md
```

## Database Schema

Các bảng chính:

- `users`: user đăng nhập, role `ADMIN` hoặc `CUSTOMER`.
- `addresses`: địa chỉ nhận hàng mẫu của customer.
- `categories`: nhóm sản phẩm.
- `products`: thông tin sản phẩm, giá, tồn kho, trạng thái active.
- `product_images`: ảnh sản phẩm.
- `carts`: giỏ hàng theo user.
- `cart_items`: sản phẩm trong giỏ.
- `orders`: đơn hàng.
- `order_items`: dòng sản phẩm trong đơn hàng.
- `payments`: trạng thái thanh toán của đơn hàng.
- `reviews`: đánh giá sản phẩm.

Quan hệ dữ liệu nổi bật:

- Một user có nhiều addresses.
- Một user có một cart.
- Một cart có nhiều cart_items.
- Một category có nhiều products.
- Một product có nhiều product_images.
- Một order có nhiều order_items.
- Một order có một payment.
- Một user có nhiều orders.
- Một product có nhiều reviews.

Seed data hiện có:

- 1 admin.
- 3 customers.
- 3 categories: `Phones`, `Laptops`, `Accessories`.
- 16 products.
- Nhiều orders với trạng thái khác nhau.
- Payments có trạng thái `PENDING`, `PAID`, `FAILED`.
- Reviews mẫu để học quan hệ user-product-review.

Lưu ý: `npm run seed` sẽ truncate dữ liệu demo cũ và tạo lại dữ liệu mới.

## API Chính

Base URL:

```text
http://localhost:4001
```

Các endpoint mặc định yêu cầu Bearer token, trừ những endpoint có ghi public.

### Auth

Public:

```http
POST /auth/register
POST /auth/login
POST /auth/refresh
```

Protected:

```http
GET /auth/me
```

### Products

Protected:

```http
GET /products
GET /products/:id
```

Admin only:

```http
POST /products
PATCH /products/:id
DELETE /products/:id
```

Query hỗ trợ cho `GET /products`:

```text
q
categoryId
minPrice
maxPrice
sort
```

Giá trị `sort` hợp lệ:

```text
newest
price_asc
price_desc
stock_asc
```

### Categories

Protected:

```http
GET /categories
```

### Cart

Customer only:

```http
GET /cart
POST /cart/items
PATCH /cart/items/:id
DELETE /cart/items/:id
```

### Orders

Customer only:

```http
GET /orders
POST /orders/checkout
```

### Reviews

Protected:

```http
POST /reviews
```

### Admin

Admin only:

```http
GET /admin/reports/sales
GET /admin/reports/top-products
GET /admin/reports/low-stock
GET /admin/orders
PATCH /admin/orders/:id/status
```

## Auth Flow

Khi login thành công, server trả về:

- `accessToken`
- `refreshToken`
- `refreshTokenExpiresAt`
- `user`

Frontend lưu các giá trị này trong `localStorage`.

Khi gọi API:

- Axios tự gắn `Authorization: Bearer <accessToken>`.
- Nếu API trả `401`, frontend gọi `/auth/refresh`.
- Nếu refresh thành công, request ban đầu được retry.
- Nếu refresh token hết hạn hoặc invalid, frontend xóa session và đưa user về `/login`.

## Checkout Flow

Customer checkout từ cart:

1. Backend lấy cart hiện tại của user.
2. Backend chạy transaction.
3. Kiểm tra cart không rỗng.
4. Lock từng product bằng pessimistic write.
5. Kiểm tra product còn active và đủ stock.
6. Trừ stock.
7. Tạo order.
8. Tạo order_items.
9. Tạo payment.
10. Xóa cart_items sau khi checkout thành công.

Với payment provider:

- `COD`: order `PENDING`, payment `PENDING`.
- `BANK_TRANSFER`: order `PAID`, payment `PAID`.
- `MOMO`: order `PAID`, payment `PAID`.

## Admin Reports

Admin dashboard có 3 report:

- Daily sales: tổng số đơn và doanh thu theo ngày.
- Top products: sản phẩm bán chạy theo số lượng và doanh thu.
- Low stock: sản phẩm active có tồn kho thấp.

Report dùng SQL trực tiếp trong `AdminService`, phù hợp để học truy vấn phân tích dữ liệu.

