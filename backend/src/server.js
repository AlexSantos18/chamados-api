require('dotenv').config();
const { server } = require('./app');

try {
  require('./database/connection');

  // Mantem a API de pe quando o agendador ainda nao estiver instalado.
  const startCleanupTask = require('./services/cleanupTask');
  startCleanupTask();
} catch (error) {
  console.error('Erro ao iniciar servicos dependentes:', error.message);
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
