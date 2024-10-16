from oven/bun:1
workdir /app
copy . .
run cd packages/server && bun install --frozen-lockfile --production
cmd cd packages/server && bun run start