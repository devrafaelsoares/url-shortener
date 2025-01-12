FROM node:20.17.0-alpine

WORKDIR /app

COPY package.json .

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build


CMD ["pnpm", "run", "prod"]