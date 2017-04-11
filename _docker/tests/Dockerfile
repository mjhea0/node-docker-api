FROM node:latest

RUN mkdir /src

RUN npm install gulp -g

WORKDIR /src
ENV PATH /src/node_modules/.bin:$PATH
ADD package.json /src/package.json
RUN npm install
