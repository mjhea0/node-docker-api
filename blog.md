# Developing and Testing Microservices with Docker

Often, when developing applications with a microservice architecture, you cannot fully test out all services until you deploy to a staging server. This takes much too long to get feedback. Docker helps to speed up this process by making it easier to link together small, independent services.

**In this article we'll look at how to configure and test a number of services locally with [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose/). We'll also look at workflow and how to interact with and debug containers.**

This post assumes prior knowledge of the following topics. Refer to the resources for more info:

| Topic            | Resource |
|------------------|----------|
| Docker           | [Get started with Docker](https://docs.docker.com/engine/getstarted/) |
| Docker Compose   | [Get started with Docker Compose](https://docs.docker.com/compose/gettingstarted/) |
| Node/Express API | [Testing Node and Express](http://mherman.org/blog/2016/09/12/testing-node-and-express) |
| TestCafe         | [Functional Testing With TestCafe](http://mherman.org/blog/2017/03/19/functional-testing-with-testcafe) |  

## Contents

1. Objectives
1. Project Setup

## Objectives

By the end of this tutorial, you should be able to...

1. Configure and run a set of microservices locally with Docker and Docker Compose

## Project Setup

Start by cloning the base project:

```sh
$ git clone
```

Take a quick look at the structure:

```sh
```

Install the dependencies, and then fire up the app by running npm start to make sure all is well. Navigate to http://localhost:3000/ in your browser and you should see a list of jobs in HTML. Experiment with the app. Add a job. Update a job. Delete a job. This is what we will be testing. Kill the server when done.
