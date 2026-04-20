FROM node:18-alpine

# Instala dependências necessárias para pacotes nativos
RUN apk add --no-cache python3 make g++ gcc

# Cria o diretório de trabalho
WORKDIR /usr/app

# Copia os arquivos de dependências
COPY package*.json ./
RUN npm install --quiet

# Copia o restante do código
COPY . .
RUN mkdir -p uploads && chmod 777 uploads

EXPOSE 5000

CMD ["npm", "start"]