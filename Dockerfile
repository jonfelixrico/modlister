FROM node:16-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN npm i pnpm -g
RUN pnpm i --frozen-lockfile

# Run Next
FROM base AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm i pnpm -g
# this seems to be the only way to run next with dynamic routes...

ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000
CMD ["pnpm", "dev"]