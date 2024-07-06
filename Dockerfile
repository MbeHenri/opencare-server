FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn install

EXPOSE 8013

CMD [ "yarn", "start" ]
