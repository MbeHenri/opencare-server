FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY src .

EXPOSE 3001

CMD [ "nodemon", "--watch", "*.ts", "--exec", "ts-node", "./src/server.ts" ]