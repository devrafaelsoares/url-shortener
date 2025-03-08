FROM node:20.17.0-alpine

WORKDIR /app

COPY package.json .

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

COPY src/presentation/templates/email* app/dist/src/presentation/templates/email/

CMD ["pnpm", "run", "prod"]
