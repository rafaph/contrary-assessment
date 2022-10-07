SHELL=/bin/sh

export HOST_UID=$(shell id -u)
export HOST_GID=$(shell id -g)

.PHONY: down
down:
	docker compose down --remove-orphans

.PHONY: up-services
up-services:
	docker compose --profile service up -d

.PHONY: up-application
up-application:
	docker compose --profile application up -d

.PHONY: migrate
migrate:
	bin/migrate

.PHONY: get-data
get-data:
	bin/get-data

.PHONY: ingest
ingest:
	docker compose --profile ingestion up

.PHONY: shell
shell:
	docker compose --profile application run --service-ports --rm application bash
