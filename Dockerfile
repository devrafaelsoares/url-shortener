FROM node:20.17.0-alpine

WORKDIR /app

COPY package.json ./

RUN npm install -g pnpm

RUN pnpm self-update

RUN pnpm install 

COPY . .

RUN pnpm run build

RUN mkdir -p dist/src/presentation/templates/email && \
    cp -r src/presentation/templates/email/* dist/src/presentation/templates/email/

CMD ["pnpm", "run", "prod"]
