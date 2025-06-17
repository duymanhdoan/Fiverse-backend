FROM node:12.22-alpine

WORKDIR /src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY package*.json /src/app/
RUN npm install

COPY . /src/app

ENV PORT 9000
EXPOSE $PORT
CMD [ "npm", "start" ]
