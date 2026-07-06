FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./
COPY server/package*.json ./server/

RUN npm ci --workspace server --include-workspace-root

FROM node:22-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY server ./server

RUN npm run build -w server

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/package.json ./server/package.json

WORKDIR /app/server

EXPOSE 4001

CMD ["node", "dist/main"]