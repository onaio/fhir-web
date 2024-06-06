FROM alpine/git AS sources

# TODO - update the tag here
RUN git clone --depth=1 --branch=bulk-upload-bull https://github.com/onaio/express-server.git /usr/src/express-server

FROM node:16.18-alpine as build

COPY ./ /project

WORKDIR /project
ENV PATH /project/node_modules/.bin:$PATH
ENV NODE_OPTIONS --max_old_space_size=4096

RUN chown -R node .
USER node

RUN cp /project/app/.env.sample /project/app/.env \
  && yarn

USER root
RUN chown -R node .
USER node
RUN yarn lerna run build


# FROM node:16.18-alpine as nodejsbuild

# COPY --from=sources /usr/src/express-server /usr/src/express-server

# WORKDIR /usr/src/express-server
# RUN yarn && yarn tsc && npm prune -production --legacy-peer-deps

# # Remove unused dependencies
# RUN rm -rf ./node_modules/typescript

# TODO - change image to use one with python or install python here
# FROM nikolaik/python-nodejs:python3.8-nodejs18-alpine as final

# # Use tini for NodeJS application https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#handling-kernel-signals
# RUN apk add --no-cache tini curl

# # confd
# RUN curl -sSL -o /usr/local/bin/confd https://github.com/kelseyhightower/confd/releases/download/v0.16.0/confd-0.16.0-linux-amd64 \
#   && chmod +x /usr/local/bin/confd

# COPY ./docker/confd_env.toml /etc/confd/conf.d/appconfig.toml
# COPY ./docker/config.js.tmpl /etc/confd/templates/config.js.tmpl

# COPY ./docker/app.sh /usr/local/bin/app.sh
# RUN chmod +x /usr/local/bin/app.sh

# WORKDIR /usr/src/web

# COPY --from=build /project/node_modules /usr/src/web/node_modules
# COPY --from=build /project/app/build /usr/src/web


# # RUN chown -R node /usr/src/web

# WORKDIR /usr/src/app

# COPY --from=nodejsbuild /usr/src/express-server/build /usr/src/app
# COPY --from=nodejsbuild /usr/src/express-server/node_modules /usr/src/app/node_modules


# RUN pip install -r /usr/src/app/fhir-tooling/requirements.txt

# # RUN chown -R node /usr/src/app

# # USER node

# ENV EXPRESS_REACT_BUILD_PATH /usr/src/web/

# EXPOSE 3000

# CMD ["python3"]

ENTRYPOINT  [ "/bin/sh" ]
# ENTRYPOINT  [ "/bin/sh", "-c", "/usr/local/bin/app.sh && node ." ]

# ENTRYPOINT ["/sbin/tini", "--"]
