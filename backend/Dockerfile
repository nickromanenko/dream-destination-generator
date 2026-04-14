FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb* pnpm-lock.yaml* ./
RUN bun install --frozen-lockfile --production 2>/dev/null || bun install --production

# Copy source
COPY src ./src
COPY tsconfig.json ./

ENV NODE_ENV=production
EXPOSE 8080

CMD ["bun", "run", "src/index.ts"]
