# Developing and Testing Microservices with Docker

Often, when developing applications with a microservice architecture, you cannot fully test out all services until you deploy to a staging server. This takes much too long to get feedback. Docker helps to speed up this process by making it easier to link together small, independent services locally.

**In this article we'll look at how to configure and test a number of services locally with [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose/). We'll also look at workflow and how to interact with and debug containers.**

ADD IMAGE OF ARCHITECTURE

This post assumes prior knowledge of the following topics. Refer to the resources for more info:

| Topic            | Resource |
|------------------|----------|
| Docker           | [Get started with Docker](https://docs.docker.com/engine/getstarted/) |
| Docker Compose   | [Get started with Docker Compose](https://docs.docker.com/compose/gettingstarted/) |
| Node/Express API | [Testing Node and Express](http://mherman.org/blog/2016/09/12/testing-node-and-express) |

## Contents

1. Objectives
1. Project Setup
1. Docker Config
1. Postgres Setup
1. Users Service Setup
1. Locations Service Setup
1. Web Setup
1. Workflow
1. Testing
1. Test Setup
1. Next Steps

## Objectives

By the end of this tutorial, you should be able to...

1. Configure and run a set of microservices locally with Docker and Docker Compose
1. Utilize [volumes](https://docs.docker.com/engine/tutorials/dockervolumes/) to mount your code into a container
1. Run unit and integration tests inside a Docker container
1. Set up a separate container for functional tests
1. Debug a running Docker container
1. Utilize [links](https://docs.docker.com/compose/compose-file/#links) for inter-container communication (AJAX)
1. Secure your services via JWT-based authentication

## Project Setup

Start by cloning the base project:

ADD CLONE URL

```sh
$ git clone ???
```

Take a quick look at the structure, broken down by service:

ADD TREE

Before we Dockerize the services, feel free to test the locations and/or users services...

Users:

1. Navigate to "services/users"
1. `npm install`
1. `node src/server.js`
1. Open [http://localhost:3000/users/ping](http://localhost:3000/users/ping) in you browser

Locations:

1. Navigate to "services/locations"
1. `npm install`
1. `node src/server.js`
1. Open [http://localhost:3001/locations/ping](http://localhost:3001/locations/ping) in you browse

Kill the servers once done.

## Docker Config

Add a *docker-compose.yml* file to the project root, which is a config file used by Docker Compose to link multiple services together:

```
version: '2.1'
```

> **NOTE:** Why 2.1? [Answer](https://docs.docker.com/compose/compose-file/compose-file-v2/#version-21).

Then add a *.dockerignore* to the "services/locations", ""services/locations/db", "services/users", ""services/users", "tests", and "web" directories:

```
.git
.gitignore
README.md
docker-compose.yml
node_modules
```

With that, let's set up each service individually, testing as we go...

## Postgres Setup

Add a *Dockerfile* to "services/locations/db" and "services/locations/db":

```
FROM postgres

# run create.sql on init
ADD create.sql /docker-entrypoint-initdb.d
```

Then update *docker-compose.yml*:

```
version: '2.1'

services:

  users-db:
    container_name: users-db
    build: ./services/users/src/db
    ports:
      - '5433:5432'
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=admin

  locations-db:
    container_name: locations-db
    build: ./services/locations/src/db
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=admin
```

Here, we create two new containers called `users-db` and `locations-db, from the *Dockerfile*s found in "services/users/src/db" and "services/locations/src/db", respectively. We also add environment variables and expose ports.

To fire up the containers, run:

```sh
$ docker-compose up --build -d
```

Once up, you can get a quick sanity check, by entering the shell:

```sh
$ docker-compose run users-db bash
# exit
$ docker-compose run locations-db bash
# exit
```

## Users Service Setup

Again, add a *Dockerfile* to "services/users", making sure to review the comments:

```
FROM node:latest

# set working directory
RUN mkdir /src
WORKDIR /src

# install app dependencies
ENV PATH /src/node_modules/.bin:$PATH
ADD package.json /src/package.json
RUN npm install

# start app
CMD ["npm", "start"]
```

Add the `users-service` to the *docker-compose.yml* file:

```
users-service:
  container_name: users-service
  build: ./services/users/
  volumes:
    - './services/users:/src/app'
    - './services/users/package.json:/src/package.json'
  ports:
    - '3000:3000'
  environment:
    - DATABASE_URL=postgres://admin:admin@users-db:5432/node_docker_api_users_dev
    - DATABASE_TEST_URL=postgres://admin:admin@users-db:5432/node_docker_api_users_test
    - NODE_ENV=${NODE_ENV}
    - TOKEN_SECRET=changeme
  depends_on:
    users-db:
      condition: service_started
  links:
    - users-db
```

What's new here?

1. `volumes`: [volumes](https://docs.docker.com/engine/tutorials/dockervolumes/) are used to mount a directory into a container, so that you can make changes to the code without having to build a new image. This should be a default in your local development environment so you can get quick feedback on code changes.
1. `depends_on`: [depends_on](https://docs.docker.com/compose/compose-file/#dependson) is used to start services in a specific order. So, the `users-service` will wait for the `users-db` to be up before starting.
1. `links`: With [links](https://docs.docker.com/compose/compose-file/#links), code inside the `users-service` can access the database via `users-db:5432`.

Set the `NODE_ENV` environment variable:

```sh
$ export NODE_ENV=development
```

Spin up the container:

```sh
$ docker-compose up --build -d users-service
```

Once up, create a new file in the project root called *migrate.sh* and add the Knex migrate and seed commands:

```sh
#!/bin/sh

docker-compose run users-service knex migrate:latest --env development --knexfile app/knexfile.js
docker-compose run users-service knex seed:run --env development --knexfile app/knexfile.js
```

Then run it:

```sh
$ sh migrate.sh
```

Test:

| Endpoint        | HTTP Method | CRUD Method | Result        |
|-----------------|-------------|-------------|---------------|
| /users/ping     | GET         | READ        | `pong`        |
| /users/register | POST        | CREATE      | add a user    |
| /users/login    | POST        | CREATE      | log in a user |
| /users/user     | GET         | READ        | get user info |

```sh
$ http POST http://localhost:3000/users/register username=michael password=herman
$ http POST http://localhost:3000/users/login username=michael password=herman
```

> **NOTE:** `http` in the above commands is part of the [HTTPie](https://httpie.org/) library, which is a wrapper on top of cURL.

## Locations Service Setup

Add the *Dockerfile*:

```
FROM node:latest

# set working directory
RUN mkdir /src
WORKDIR /src

# install app dependencies
ENV PATH /src/node_modules/.bin:$PATH
ADD package.json /src/package.json
RUN npm install

# start app
CMD ["npm", "start"]
```

Add the service to *docker-compose*:

```
locations-service:
  container_name: locations-service
  build: ./services/locations/
  volumes:
    - './services/locations:/src/app'
    - './services/locations/package.json:/src/package.json'
  ports:
    - '3001:3001'
  environment:
    - DATABASE_URL=postgres://admin:admin@locations-db:5432/node_docker_api_locations_dev     
    - DATABASE_TEST_URL=postgres://admin:admin@locations-db:5432/node_docker_api_locations_test
    - NODE_ENV=${NODE_ENV}
    - TOKEN_SECRET=changeme
    - OPENWEATHERMAP_API_KEY=${OPENWEATHERMAP_API_KEY}
  depends_on:
    locations-db:
      condition: service_started
    users-service:
      condition: service_started
  links:
    - locations-db
    - users-service
```

Register with the [OpenWeatherMap API](https://openweathermap.org/api), and add the key as an environment variable:

```sh
$ export OPENWEATHERMAP_API_KEY=YOUR_KEY_HERE
```

Spin up the container:

```sh
$ docker-compose up --build -d locations-service
```

Add the migrate and seed commands to *migrate.sh*:

```sh
docker-compose run locations-service knex migrate:latest --env development --knexfile app/knexfile.js
docker-compose run locations-service knex seed:run --env development --knexfile app/knexfile.js
```

Test:

| Endpoint         | HTTP Method | CRUD Method | Result                    |
|------------------|-------------|-------------|---------------------------|
| /locations/ping  | GET         | READ        | `pong`                    |
| /locations       | GET         | READ        | get all locations         |
| /locations/user  | GET         | READ        | get all locations by user |
| /locations/:id   | GET         | READ        | get a single job          |
| /locations       | POST        | CREATE      | add a single job          |
| /locations/:id   | PUT         | UPDATE      | update a single job       |
| /locations/:id   | DELETE      | DELETE      | delete a single job       |

```sh
$ http GET http://localhost:3001/locations/ping
```

## Web Services Setup

Moving right along...

Add the *Dockerfile*:

```
FROM node:latest

# set working directory
RUN mkdir /src
WORKDIR /src

# install app dependencies
ENV PATH /src/node_modules/.bin:$PATH
ADD package.json /src/package.json
RUN npm install

# start app
CMD ["npm", "start"]
```

Add the service to *docker-compose*:

```
web:
  container_name: web
  build: ./web/
  volumes:
    - './web:/src/app'
    - './web/package.json:/src/package.json'
  ports:
    - '3003:3003'
  environment:
    - NODE_ENV=${NODE_ENV}
    - SECRET_KEY=changeme
  depends_on:
    users-service:
      condition: service_started
    locations-service:
      condition: service_started
  links:
    - users-service
    - locations-service
```

Spin up the container:

```sh
$ docker-compose up --build -d web
```

Navigate to [http://localhost:3003](http://localhost:3003) in your browser and you should see the login page. Register a new user. Once redirected, you should see:

ADD IMAGE

Take a look at the AJAX request in the GET `/` route in *web/src/routes/index.js*. Why does the `uri` point to `locations-service` and not `localhost`?

ADD EXPLANATION

## Testing

Did you notice the unit and integration tests in the "services/users/tests" and "services/locations/tests" folders? Well, to run the tests properly, we need to update the `NODE_ENV` environment variable, since it is configured for the development environment.

```sh
$ export NODE_ENV=test
```

Update the containers:

```sh
$ docker-compose up -d
```

Then run the tests:

```sh
$ docker-compose -f docker-compose-test.yml run users-service npm test
$ docker-compose -f docker-compose-test.yml run locations-service npm test
```

Ready to develop again?

1. Update the env variable - `export NODE_ENV=development`
1. Update the containers - `docker-compose up -d`

## Workflow

Let's quickly look at how to work with code inside the containers...

HERE

Examples:

1. livereload
1. `console.log` for debugging
1. Accessing logs
1. dev to test

## Test Setup

Finally, to set up the last service, add the *Dockerfile* to the "tests" folder:

```
FROM node:latest

# set working directory
RUN mkdir /src
WORKDIR /src

# install app dependencies
ENV PATH /src/node_modules/.bin:$PATH
ADD package.json /src/package.json
RUN npm install
```

Then update the *docker-compose.yml* file:

```
tests:
  container_name: tests
  build: ./tests/
  volumes:
    - './tests:/src/app'
    - './tests/package.json:/src/package.json'
  depends_on:
    users-service:
      condition: service_started
    locations-service:
      condition: service_started
  links:
    - users-service
    - locations-service
    - web
```

Fire up the container:

```sh
$ docker-compose up --build -d tests
```

Update the environment variables, and then run the tests:

```sh
$ export NODE_ENV=test
$ docker-compose -f docker-compose-test.yml run tests npm test
```

## Next Steps

What's next?

1. **Microservices**: What is a microservice? Does the DB from one service need to be separate from another service? Notice how the migrations and seeds are set up in the `users` and `locations` services. This is a problem. The developers working on one service should not have to care about seeds and migration files for a different service. How do you refactor this?
1. **Dependency management**: Right now we're installing many of the same dependencies over and over again, in multiple containers. How can we manage this better? How about a data-only container that just houses dependencies?
1. **Deployment prep**: Set up Docker Machine and nginx for load balancing, Consul for service discover, update environment variables for the base URL since these will be different in production, add a data-only container for piping logs to
1. **Error handling**: Right now errors are being thrown, but there really isn't much info as to why, which makes debugging difficult. Be a good citizen and handle your errors properly since you may not always have access to the code base from a different service.
1. **DRY**: The code could be refactored in places, especially the tests.
