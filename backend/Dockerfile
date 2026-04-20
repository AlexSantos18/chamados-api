FROM node:18-alpine

RUN apk add --no-cache python3 make g++ gcc

WORKDIR /usr/app

COPY package*.json ./
RUN npm install --quiet

COPY . .
RUN mkdir -p uploads && chmod 777 uploads

EXPOSE 5000

CMD ["npm", "start"]
