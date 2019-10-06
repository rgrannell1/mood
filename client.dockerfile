FROM node:12

EXPOSE 3000

WORKDIR /usr/src/web

# COPY package.json package-lock.json pulpfile.mjs webpack.common.mjs webpack.dev.mjs webpack.prod.mjs .env /usr/src/web/

RUN apt-get update && apt install dumb-init entr --assume-yes

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

CMD find . | entr -r sh -c "npm install && npm run build && npm run run:client"
