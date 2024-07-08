FROM node

WORKDIR /app

COPY . .

RUN apt update -y && apt install nano vim-tiny iputils-ping -y && yarn install

EXPOSE 8001

CMD [ "yarn", "start" ]
