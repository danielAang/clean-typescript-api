FROM node:12
WORKDIR /usr/src/mp-back
COPY ./package*.json ./
RUN npm install --only=prod
