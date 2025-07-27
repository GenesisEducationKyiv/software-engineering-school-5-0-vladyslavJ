FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY apps/api-gateway ./apps/api-gateway

COPY libs ./libs    

COPY tsconfig*.json ./

RUN npm run build

EXPOSE 3000

CMD ["node", "./dist/apps/api-gateway/src/main.js"]