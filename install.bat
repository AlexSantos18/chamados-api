@echo off
echo Instalando Chamados API...

echo Criando pasta backend\uploads...
if not exist backend\uploads mkdir backend\uploads

echo Criando backend\.env...
if not exist backend\.env (
echo JWT_SECRET=segredo_super_seguro_123>>backend\.env
echo MONGO_URI=mongodb://mongodb:27017/chamados>>backend\.env
)

echo Instalando dependencias do backend e frontend...
npm install --prefix backend
npm install --prefix frontend

echo Subindo Docker...
docker-compose up --build -d

echo Sistema pronto!
pause
