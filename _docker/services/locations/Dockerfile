FROM node:latest

RUN mkdir /src

WORKDIR /src
ENV PATH /src/node_modules/.bin:$PATH
ADD package.json /src/package.json
RUN npm install

CMD ["npm", "start"]
