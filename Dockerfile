FROM oven/bun:1.0.4

WORKDIR /app

COPY ./package.json ./
COPY ./bun.lockb ./

RUN bun install

COPY ./ ./

RUN bun run build

FROM oven/bun:1.0.4-alpine

WORKDIR /app

COPY --from=0 /app/out/telebot ./

RUN chmod 755 telebot

CMD ["/app/telebot"]
