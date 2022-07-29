FROM node:16.14 as dev

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build
RUN npm run build-env

EXPOSE 3000
CMD ["npm", "run", "start"]
