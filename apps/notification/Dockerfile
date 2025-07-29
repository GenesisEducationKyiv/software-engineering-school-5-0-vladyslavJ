FROM node:20-alpine

WORKDIR /app

COPY ../../package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 6600

CMD ["node", "dist/apps/notification/main.js"]