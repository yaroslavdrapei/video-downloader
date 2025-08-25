FROM node:24-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g pnpm
RUN pnpm i

COPY . .

RUN pnpm build

EXPOSE $APP_PORT

CMD ["pnpm", "start:prod"]