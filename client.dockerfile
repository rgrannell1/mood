FROM node:12

WORKDIR /usr/src/client

COPY client ./client
COPY build ./build
COPY .env package.json package-lock.json pulpfile.mjs webpack.common.mjs webpack.dev.mjs webpack.prod.mjs ./

RUN npm install
RUN npm run build
