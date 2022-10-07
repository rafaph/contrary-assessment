## Contrary Engineering Backend/Data Engineering Take-Home Assessment

My solution was made to be easy to execute with `docker` and `make` on a Linux machine.

### Part 1

I used Python to prepare the data and ingest it into a PostgreSQL database.

Here is the way to execute this part:

1) Requirements:
  - docker
  - docker compose extension
  - curl
  - make

2) Run the commands below to download the CSVs, create containers, tables and ingest the data.

```
make get-data
make up-services
make migrate
make ingest
```

The script [import.py](ingestion/scripts/import.py) contains the logic to prepare data and ingest it into the database.

Now we have the data ingested into the database, is possible to access it through this URL: `postgresql://contrary@postgres.localtest.me:5432/contrary`.

3) The solutions are on the [answers.sql](ingestion/scripts/answers.sql) file.

### Parte 2

The application part was made with NodeJS (TypeScript) with a Clean Architecture approach. The project is located in the [application](application) folder.

Using a make command is possible to create a terminal inside the docker container and run some specific tasks for the application:

```
make shell
```

The first time, the NodeJS dependencies will be installed. Here are the available commands:

```
npm run lint // lints code using some rules from eslint
npm run test // run all tests
npm run test:unit // run unit tests
npm run test:e2e // run end-to-end tests
npm run test:cov // run all tests with coverage and generate reports into the application/coverage folder
npm run start:dev // starts the server, so we can access the endpoints later
npm run build // compile the typescript code into the dist folder
npm run start // starts the server with compiled code (in a prod env we must use this)
```

Once we ran `npm run start:dev`, we can access the endpoints through this URL `http://application.localtest.me`.

#### Documentation and CI pipeline

The complete documentation about the endpoints are available through this URL `http://application.localtest.me/api-docs`.

The Github CI pipeline is configured to run lint and test coverage.
