FROM mhart/alpine-node:10 as Base

WORKDIR /app

COPY package.json yarn.lock ./

RUN apk add --no-cache make gcc g++ python

RUN yarn

COPY . .

FROM mhart/alpine-node:10

WORKDIR /app

COPY --from=Base /app .

CMD [ "yarn", "start" ]