#!/bin/bash

echo "🚀 Instalando Chamados API..."

# Atualizar dependências
echo "📦 Instalando dependências..."
npm install

# Criar pasta uploads
echo "📁 Criando pasta uploads..."
mkdir -p uploads

# Criar .env se não existir
if [ ! -f .env ]; then
  echo "⚙️ Criando .env..."
  cat <<EOT >> .env
JWT_SECRET=segredo
MONGO_URL=mongodb://localhost:27017/chamados
EOT
fi

echo "🐳 Subindo containers..."
docker-compose up --build -d

echo "✅ Sistema pronto!"
echo "👉 Acesse: http://localhost:3000"