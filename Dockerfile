FROM node:current-alpine3.18
WORKDIR /usr/src/app
COPY package*.json src/* ./
RUN npm install
EXPOSE 3000
CMD ["node", "src/app.js"]
