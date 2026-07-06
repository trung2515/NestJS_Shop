# ShopNest

Full-stack e-commerce demo:

- Client: React, Vite, Material UI, Tailwind CSS
- Server: NestJS, TypeORM, PostgreSQL, JWT
- Database: PostgreSQL

## Yeu Cau

- Node.js
- npm
- Docker Desktop

## Cai Dat

```bash
npm install
```

Tao file env:

```powershell
Copy-Item server\.env.example server\.env
```

Neu dung macOS/Linux:

```bash
cp server/.env.example server/.env
```

## Chay Local

Chay PostgreSQL va pgAdmin bang Docker:

```bash
npm run db:up
```

Chay migration va seed:

```bash
npm run migrate
npm run seed
```

Chay client va server:

```bash
npm run dev
```

Mo web:

```text
http://localhost:4000
```

API:

```text
http://localhost:4001
```

pgAdmin:

```text
http://localhost:5050
```

pgAdmin login:

```text
Email: admin@shopnest.com
Password: admin123
```

PostgreSQL local:

```text
Host: localhost
Port: 5433
Database: shopnest
Username: shopnest
Password: shopnest123
```

## Docker local


Chay:

```bash
docker compose up -d
```

Hoac dung script co san:

```bash
npm run db:up
```

Dung:

```bash
docker compose down
```

Hoac:

```bash
npm run db:down
```

Xem container:

```bash
docker ps
```

## Docker  Nginx Production


```yaml
CLIENT_URL: http://<IP-LAN>:4000 (http://192.168.1.85:4000)
VITE_API_URL: http://<IP-LAN>:4001 (http://192.168.1.85:4001)
```

Build va chay:

```powershell
docker compose -f docker-compose.prod.yml up -d --build
```

Chi build lai client:

```powershell
docker compose -f docker-compose.prod.yml up -d --build client
```

Chi build lai server:

```powershell
docker compose -f docker-compose.prod.yml up -d --build server
```

Xem logs:

```powershell
docker compose -f docker-compose.prod.yml logs -f
```

Dung production containers:

```powershell
docker compose -f docker-compose.prod.yml down
```

Truy cap trong mang LAN:

```text
http://<IP-LAN>:4000
```

## Seed Du Lieu Khi Chay Docker Production

```powershell
npm.cmd run seed
```

Hoac:

```bash
npm run seed
```

## Tai Khoan Demo

Admin:

```text
admin@shopnest.com
Admin123!
```

Customer:

```text
linh@example.com
Customer123!
```
