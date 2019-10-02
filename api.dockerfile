FROM node:12

EXPOSE 3001

WORKDIR /usr/src/api

COPY .env package.json package-lock.json pulpfile.mjs webpack.common.mjs webpack.dev.mjs webpack.prod.mjs ./

RUN apt-get update && apt install dumb-init --assume-yes
RUN npm install

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD npm run run:api
