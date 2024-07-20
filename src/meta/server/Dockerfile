FROM node:20-alpine as builder

WORKDIR /workspace
COPY . .
RUN npm config set registry https://registry.npmmirror.com &&  \
    npm i -g pnpm && \
    pnpm i && \
    pnpm run build

FROM node:20-alpine as prod
WORKDIR /worksapce
COPY --from=builder /workspace/dist .
COPY ./assets .

ENTRYPOINT ["node", "./dist/main.js"]
