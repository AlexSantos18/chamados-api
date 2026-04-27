FROM node:18-alpine

WORKDIR /usr/app

COPY package*.json ./
RUN npm install --quiet

COPY . .

ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build for production
RUN npm run build

EXPOSE 3000

# Use nginx for serving static files in production
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
