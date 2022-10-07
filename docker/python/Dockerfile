FROM python:3.10-alpine

RUN apk add --no-cache --virtual .build-deps \
    gcc \
    python3-dev \
    musl-dev \
    postgresql-dev \
    && pip install --no-cache-dir psycopg2 \
    && apk del --no-cache .build-deps \
    && apk --no-cache add libpq
