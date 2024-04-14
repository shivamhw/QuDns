FROM oven/bun:latest as builder
WORKDIR /app
COPY . .
RUN bun install \
    && cd frontend && bun install \
    && cd /app && bun run build 
RUN bunx prisma generate


FROM node:20-alpine as prod
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build /app/build
CMD ["node", "build/index.js"]