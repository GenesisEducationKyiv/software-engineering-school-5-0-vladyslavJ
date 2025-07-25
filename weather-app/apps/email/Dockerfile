FROM node:20-alpine

WORKDIR /app

COPY ../../package*.json ./

RUN npm install

# Копіюємо весь код сервісу weather
COPY . .

RUN npm run build

EXPOSE 4650

CMD ["node", "dist/apps/email/main.js"]