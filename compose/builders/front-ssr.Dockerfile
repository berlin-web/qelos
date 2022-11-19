ARG MONOREPO_VERSION=main
FROM qelos/monorepo:${MONOREPO_VERSION} as base

FROM node:16.15-alpine
ENV PORT=3002
ENV NODE_ENV=production
EXPOSE $PORT
WORKDIR /package
COPY --from=base /apps/front-ssr/*.mjs /apps/front-ssr/*.json /apps/front-ssr/*.js /package/
RUN npm install
COPY --from=base /apps/front-ssr/client /package/client
CMD npm start
