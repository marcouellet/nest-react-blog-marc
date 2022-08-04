FROM node:16-alpine as blog-marc-server-build

WORKDIR /usr/src/app


COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN  npm run build
RUN  npm run build-env

EXPOSE 5000

CMD ["npm", "run", "start"]

