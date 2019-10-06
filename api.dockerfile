FROM node:12

EXPOSE 3001

WORKDIR /usr/src/api

# COPY package.json package-lock.json pulpfile.mjs webpack.common.mjs webpack.dev.mjs webpack.prod.mjs .env /usr/src/api/

RUN apt-get update && apt install dumb-init entr --assume-yes

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD find . | entr -r sh -c "npm install && npm run build && npm run run:api"
