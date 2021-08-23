FROM mhart/alpine-node:12.22.3 as Base

WORKDIR /app

COPY package.json yarn.lock ./

RUN apk add --no-cache make gcc g++ python

RUN yarn

COPY . .

FROM mhart/alpine-node:12.22.3

WORKDIR /app

COPY --from=Base /app .

RUN yarn build:tsc

CMD [ "yarn", "start" ]