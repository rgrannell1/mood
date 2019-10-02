FROM node:12

EXPOSE 3000

WORKDIR /usr/src/web

COPY client ./client
COPY routes ./routes
COPY tools ./tools
COPY build ./build
COPY api ./api
COPY .env package.json package-lock.json pulpfile.mjs webpack.common.mjs webpack.dev.mjs webpack.prod.mjs ./

RUN apt-get update && apt install dumb-init --assume-yes
RUN npm install
RUN npm run build

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD npm run run:client
