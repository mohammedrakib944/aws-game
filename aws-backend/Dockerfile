FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 8001
CMD ["yarn", "start"]