# Node Docker API

[![Build Status](https://travis-ci.org/mjhea0/node-docker-api.svg?branch=master)](https://travis-ci.org/mjhea0/node-docker-api)

Node + Express API + Docker

### Setup

1. Fork/Clone this repo

1. Download [Docker](https://docs.docker.com/docker-for-mac/install/) (if necessary)

1. Make sure you are using a Docker version >= 17:

    ```sh
    $ docker -v
    Docker version 17.03.0-ce, build 60ccb22
    ```

## Build and Run the App

Build the images:

```sh
$ docker-compose build
```

Run the containers:

```sh
$ docker-compose up -d
```

Your app should be listening on running on port 3000 with the following routes:

| Endpoint         | HTTP Method  | CRUD Method | Result               |
|------------------|--------------|-------------|----------------------|
| /api/v1/jobs/    | GET          | CREATE      | get all jobs         |
| /api/v1/jobs/:id | GET          | CREATE      | get a single job     |
| /api/v1/jobs/    | POST         | READ        | add a single job     |
| /api/v1/jobs/:id | PUT          | UPDATE      | update a single job  |
| /api/v1/jobs/:id | DELETE       | DELETE      | delete a single job  |

To stop the containers:

```sh
$ docker-compose stop
```

To bring down the containers:

```sh
$ docker-compose down
```

Want to force a build?

```sh
$ docker-compose build --no-cache
```

Remove images:

```sh
$ docker rmi $(docker images -q)
```

### Migrate and Seed

With the app running, run:

```sh
$ docker-compose run users-service knex migrate:latest --env development --knexfile app/knexfile.js
$ docker-compose run users-service knex seed:run --env development --knexfile app/knexfile.js
$ docker-compose run locations-service knex migrate:latest --env development --knexfile app/knexfile.js
$ docker-compose run locations-service knex seed:run --env development --knexfile app/knexfile.js
```

### Test

With the app running, run:

```sh
$ docker-compose run server npm test
```
