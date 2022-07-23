FROM node:16.14 as dev

WORKDIR /usr/src/app


COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN  npm run build
RUN  npm run build-env

EXPOSE 5000
CMD ["npm", "run", "start"]

# FROM nginx:alpine
# COPY --from=dev /usr/src/app/dist /usr/share/nginx/html
# EXPOSE 80
