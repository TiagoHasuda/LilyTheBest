FROM node:18.14.0 AS lilythebest

WORKDIR /lilythebest

COPY package.json ./

RUN yarn

COPY . .

RUN yarn build

CMD ["yarn", "start", "-p", "80"]
