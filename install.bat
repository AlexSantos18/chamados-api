@echo off
echo Instalando Chamados API...

echo Criando pasta uploads...
if not exist uploads mkdir uploads

echo Criando .env...
if not exist .env (
echo JWT_SECRET=segredo_super_seguro_123>>.env
echo MONGO_URI=mongodb://mongodb:27017/chamados>>.env
)

echo Subindo Docker...
docker-compose up --build -d

echo Sistema pronto!
pause