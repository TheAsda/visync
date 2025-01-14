# from oven/bun:1
# workdir /app
# copy . .
# run cd packages/server && bun install --frozen-lockfile --production
# cmd cd packages/server && bun run start

FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
COPY packages/server/package.json /temp/dev/packages/server/
COPY packages/extension/package.json /temp/dev/packages/extension/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
COPY packages/server/package.json /temp/prod/packages/server/
COPY packages/extension/package.json /temp/prod/packages/extension/
RUN cd /temp/prod/packages/server && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN cd packages/server && bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/packages/server/dist ./dist
COPY --from=prerelease /usr/src/app/packages/server/drizzle ./drizzle
COPY --from=prerelease /usr/src/app/packages/server/drizzle.config.ts .
COPY --from=prerelease /usr/src/app/packages/server/package.json .

# run the app
USER bun
EXPOSE 23778
ENTRYPOINT [ "bun", "run", "start" ]