FROM node:current-alpine3.18
WORKDIR /usr/src/app
COPY .env package*.json src/* ./
RUN npm install
EXPOSE 3000
CMD ["node", "--experimental-specifier-resolution=node", "app.js"]
