FROM node:10-alpine

RUN mkdir /app
RUN mkdir /tmp
WORKDIR /app

COPY package.json ./

RUN npm install
COPY . .

EXPOSE 3000
