FROM node:12

WORKDIR /usr/src/client

COPY api ./api
COPY routes ./routes
COPY tools ./tools
COPY build ./build
COPY api ./api
COPY .env package.json package-lock.json pulpfile.mjs webpack.common.mjs webpack.dev.mjs webpack.prod.mjs ./

RUN npm install
RUN npm run build

CMD npm run serve:api
