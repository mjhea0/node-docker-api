# Developing and Testing Microservices with Docker

**In this article we'll look at how to configure and test a number of small, independent services locally with [Docker](https://docs.docker.com/) and [Docker Compose](https://docs.docker.com/compose/).**

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
