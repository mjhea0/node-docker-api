# Node Docker API

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
$ docker-compose up
```

Your app should be listening on running on port 3000 with the following routes:

| Endpoint | HTTP Method  | CRUD Method | Result               |
|----------|--------------|-------------|----------------------|
| /        | GET          | CREATE      | get all jobs         |
| /:id     | GET          | CREATE      | get a single job     |
| /        | POST         | READ        | add a single job     |
| /:id     | PUT          | UPDATE      | update a single job  |
| /:id     | DELETE       | DELETE      | delete a single job  |

To bring down the containers:

```sh
$ docker-compose down
```

Want to force a build?

```sh
$ docker-compose build --no-cache
```

### Migrate and Seed

With the app running, open a new terminal tab and run:

```sh
$ docker-compose run web knex migrate:latest --env development --knexfile app/knexfile.js
$ docker-compose run web knex seed:run --env development --knexfile app/knexfile.js
```

### Test

With the app running, open a new terminal tab and run:

```sh
$ docker-compose run web npm test
```
