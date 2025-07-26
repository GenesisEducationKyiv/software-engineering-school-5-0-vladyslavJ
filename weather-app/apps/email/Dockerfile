FROM node:20-alpine

WORKDIR /app

COPY ../../package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8888

CMD ["node", "dist/apps/email/main.js"]