
FROM node:20.17.0-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@9.15.4

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

RUN mkdir -p dist/src/presentation/templates/email && \
    cp -r src/presentation/templates/email/* dist/src/presentation/templates/email/


FROM node:20.17.0-alpine AS runner

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER appuser

EXPOSE 80

CMD ["node", "dist/src/main/server.js"]
