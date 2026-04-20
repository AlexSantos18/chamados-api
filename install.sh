#!/bin/bash

echo "Instalando Chamados API..."

echo "Instalando dependencias..."
npm install --prefix backend
npm install --prefix frontend

echo "Criando pasta backend/uploads..."
mkdir -p backend/uploads

if [ ! -f backend/.env ]; then
  echo "Criando backend/.env..."
  cat <<EOT >> backend/.env
JWT_SECRET=segredo
MONGO_URL=mongodb://localhost:27017/chamados
EOT
fi

echo "Subindo containers..."
docker-compose up --build -d

echo "Sistema pronto!"
echo "Acesse: http://localhost:3000"
