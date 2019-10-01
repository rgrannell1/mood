FROM node:12

WORKDIR /usr/src/client

COPY api ./api
COPY build ./build
COPY routes ./routes
COPY .env package.json package-lock.json pulpfile.mjs ./

RUN npm install
RUN npm run build
