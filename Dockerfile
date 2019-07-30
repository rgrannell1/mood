FROM node:alpine

RUN mkdir public && mkdir app
WORKDIR /app

COPY public public
COPY dist server
COPY package.json package-lock.json server/

WORKDIR /app/server
RUN npm install

RUN node index.js
