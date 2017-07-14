# Developing and Testing Microservices with Docker

[![Build Status](https://travis-ci.org/mjhea0/node-docker-api.svg?branch=master)](https://travis-ci.org/mjhea0/node-docker-api)

## Want to learn how to build this project?

Check out the [blog post](http://mherman.org/blog/2017/04/18/developing-and-testing-microservices-with-docker).

## Want to use this project?

### Setup

1. Fork/Clone this repo

1. Download [Docker](https://docs.docker.com/docker-for-mac/install/) (if necessary)

1. Make sure you are using a Docker version >= 17:

    ```sh
    $ docker -v
    Docker version 17.03.0-ce, build 60ccb22
    ```

### Build and Run the App

#### Set the Environment variables

```sh
$ export NODE_ENV=development
```

Register with the [OpenWeatherMap API](https://openweathermap.org/api), and add the key as an environment variable:

```sh
$ export OPENWEATHERMAP_API_KEY=YOUR_KEY_HERE
```

#### Fire up the Containers

Build the images:

```sh
$ docker-compose build
```

Run the containers:

```sh
$ docker-compose up -d
```

#### Migrate and Seed

With the apps up, run:

```sh
$ sh migrate.sh
```

#### Sanity Check

Test out the following services...

##### (1) Users - http://localhost:3000

| Endpoint        | HTTP Method | CRUD Method | Result        |
|-----------------|-------------|-------------|---------------|
| /users/ping     | GET         | READ        | `pong`        |
| /users/register | POST        | CREATE      | add a user    |
| /users/login    | POST        | CREATE      | log in a user |
| /users/user     | GET         | READ        | get user info |

##### (2) Locations - http://localhost:3001

| Endpoint         | HTTP Method | CRUD Method | Result                    |
|------------------|-------------|-------------|---------------------------|
| /locations/ping  | GET         | READ        | `pong`                    |
| /locations       | GET         | READ        | get all locations         |
| /locations/user  | GET         | READ        | get all locations by user |
| /locations/:id   | GET         | READ        | get a single location     |
| /locations       | POST        | CREATE      | add a single location     |
| /locations/:id   | PUT         | UPDATE      | update a single location  |
| /locations/:id   | DELETE      | DELETE      | delete a single location  |

##### (3) Web - http://localhost:3003

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

##### (4) Locations Database and (5) Users Database

To access, get the container id from `docker ps` and then open `psql`:

```sh
$ docker exec -ti <container-id> psql -U postgres
```

##### (6) Functional Tests

With the app running, update the `NODE_ENV environment variable and then run the tests`:

```sh
$ export NODE_ENV=test
$ docker-compose up -d
$ docker-compose run tests npm test
```


Update `NODE_ENV` when you're ready to develop again:

```sh
$ export NODE_ENV=development
$ docker-compose up -d
```

#### Commands

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

Run unit and integration tests:

```sh
$ export NODE_ENV=test
$ docker-compose up -d
$ docker-compose run users-service npm test
$ docker-compose run locations-service npm test
```
