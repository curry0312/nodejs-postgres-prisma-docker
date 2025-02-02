FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=development

COPY . .

EXPOSE 8383

CMD ["npx", "nodemon", "src/server.js"]