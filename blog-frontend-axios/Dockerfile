FROM node:16-alpine as blog-marc-client-build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY ./public ./public
COPY ./src ./src
COPY .env.docker .env

ENV REACT_APP_API_URI=http://api/api

RUN npm run build

FROM nginx:latest

LABEL maintainer=Marc-Ouellet

COPY --from=blog-marc-client-build /usr/src/app/build /usr/share/nginx/html

EXPOSE 80



