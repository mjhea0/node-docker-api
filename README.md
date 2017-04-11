# Node Docker API

[![Build Status](https://travis-ci.org/mjhea0/node-docker-api.svg?branch=master)](https://travis-ci.org/mjhea0/node-docker-api)

### Setup

1. Fork/Clone this repo

1. Download [Docker](https://docs.docker.com/docker-for-mac/install/) (if necessary)

1. Make sure you are using a Docker version >= 17:

    ```sh
    $ docker -v
    Docker version 17.03.0-ce, build 60ccb22
    ```

## Build and Run the App

### Fire up the Containers

Build the images:

```sh
$ docker-compose build
```

Run the containers:

```sh
$ docker-compose up -d
```

### Migrate and Seed

With the apps up, run:

```sh
$ sh migrate.sh
```

### Sanity Check

Test out the following services...

#### (1) Users - http://localhost:3000

| Endpoint        | HTTP Method | CRUD Method | Result        |
|-----------------|-------------|-------------|---------------|
| /users/register | POST        | CREATE      | add a user    |
| /users/login    | POST        | CREATE      | log in a user |
| /users/user     | GET         | READ        | get user info |

#### (2) Locations - http://localhost:3001

| Endpoint         | HTTP Method | CRUD Method | Result                    |
|------------------|-------------|-------------|---------------------------|
| /locations       | GET         | READ        | get all locations         |
| /locations/user  | GET         | READ        | get all locations by user |
| /locations/:id   | GET         | READ        | get a single job          |
| /locations       | POST        | CREATE      | add a single job          |
| /locations/:id   | PUT         | UPDATE      | update a single job       |
| /locations/:id   | DELETE      | DELETE      | delete a single job       |

#### (3) Web - http://localhost:3003

| Endpoint  | HTTP Method | CRUD Method | Result               |
|-----------|-------------|-------------|----------------------|
| /         | GET         | READ        | render main page     |
| /login    | GET         | READ        | render login page    |
| /login    | POST        | CREATE      | log in a user        |
| /register | GET         | READ        | render register page |
| /register | POST        | CREATE      | register a new user  |
| /logout   | GET         | READ        | log a user out       |
| /add      | POST        | CREATE      | add a new location   |
| /user     | GET         | READ        | get user info        |

#### (4) Postgres - http://localhost:5432

Add steps for accessing...

#### (5) Functional Tests

With the app running, run:

```sh
$ docker-compose -f docker-compose-test.yml -d
```

### Commands

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
