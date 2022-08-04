FROM node:16-alpine as blog-marc-client-build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY ./public ./public
COPY ./src ./src

ENV REACT_APP_API_URI=http://192.168.99.100:31577/api

RUN npm run build

FROM nginx:latest

LABEL maintainer=Marc-Ouellet

COPY --from=blog-marc-client-build /usr/src/app/build /usr/share/nginx/html

EXPOSE 3000



