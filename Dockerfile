FROM node:14.9.0-alpine as build


WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock
COPY ./client/package.json /app/client/package.json
COPY ./client/yarn.lock /app/client/yarn.lock
COPY ./packages /app/packages
COPY ./lerna.json /app/lerna.json

RUN chown -R node .
USER node
RUN yarn install

COPY ./client /app/client
COPY ./public /app/public
COPY ./tsconfig.json /app/tsconfig.json
COPY ./client/.env /app/client/.env

COPY ./babel.config.js /app/babel.config.js

USER root
RUN chown -R node .
USER node
RUN yarn lerna:prepublish
RUN yarn build

FROM alpine/git AS sources

RUN git clone --depth=1 --branch=config-sessions https://github.com/onaio/express-server.git /usr/src/express-server

FROM node:14.9.0-alpine as nodejsbuild
COPY --from=sources /usr/src/express-server /usr/src/express-server

WORKDIR /usr/src/express-server
RUN yarn && yarn tsc && npm prune -production
RUN yarn add lodash && npm prune -production

# Remove unused dependencies
RUN rm -rf ./node_modules/typescript

FROM node:14.9.0-alpine as final

# Use tini for NodeJS application https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#handling-kernel-signals
RUN apk add --no-cache tini curl

# confd
RUN curl -sSL -o /usr/local/bin/confd https://github.com/kelseyhightower/confd/releases/download/v0.16.0/confd-0.16.0-linux-amd64 \
  && chmod +x /usr/local/bin/confd

COPY ./docker/confd_env.toml /etc/confd/conf.d/appconfig.toml
COPY ./docker/config.js.tmpl /etc/confd/templates/config.js.tmpl

COPY ./docker/app.sh /usr/local/bin/app.sh
RUN chmod +x /usr/local/bin/app.sh

WORKDIR /usr/src/web

COPY --from=build /app/client/build /usr/src/web

RUN chown -R node /usr/src/web

WORKDIR /usr/src/app

COPY --from=nodejsbuild /usr/src/express-server/dist /usr/src/app
COPY --from=nodejsbuild /usr/src/express-server/node_modules /usr/src/app/node_modules

RUN chown -R node /usr/src/app

USER node

ENV EXPRESS_REACT_BUILD_PATH /usr/src/web/

EXPOSE 3000

CMD [ "/bin/sh", "-c", "/usr/local/bin/app.sh && node ." ]

ENTRYPOINT ["/sbin/tini", "--"]
