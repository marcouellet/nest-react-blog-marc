FROM node:16-alpine as blog-marc-server-build

WORKDIR /usr/src/app


COPY package.json package-lock.json ./
RUN npm install

COPY . .
COPY .env.docker .env
RUN  npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]

