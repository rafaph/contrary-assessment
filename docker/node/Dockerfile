FROM node:16-slim

ENV PORT=3000

ARG UID
ARG GID

RUN apt-get update && apt-get -y install python3 curl git bash

RUN npm i --location=global npm

RUN groupmod -o -g $GID node && usermod -u $UID node

COPY --chown=node:node entrypoint.sh /usr/local/bin/entrypoint

HEALTHCHECK --interval=30s --timeout=10s CMD wget -q "http://localhost:$PORT/status" -O /dev/null

USER node

ENTRYPOINT ["sh", "/usr/local/bin/entrypoint"]
