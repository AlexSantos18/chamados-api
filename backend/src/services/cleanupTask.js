const cron = require('node-cron');
const Notification = require('../models/Notification');

/**
 * Inicia a tarefa agendada para limpeza de notificações.
 * Mesmo que você mude para um banco SQL no futuro, a lógica de agendamento 
 * permanece a mesma, alterando apenas a sintaxe da query do ORM.
 */
const startCleanupTask = () => {
  // Agenda a execução para todo dia à meia-noite ('0 0 * * *')
  cron.schedule('0 0 * * *', async () => {
    console.log('--- Iniciando limpeza diária de notificações antigas ---');
    
    try {
      const seteDiasAtras = new Date();
      seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

      const resultado = await Notification.deleteMany({
        read: true,
        updatedAt: { $lt: seteDiasAtras }
      });

      console.log(`Limpeza concluída: ${resultado.deletedCount} notificações removidas.`);
    } catch (err) {
      console.error('Falha na execução do cron de limpeza:', err);
    }
  });
};

module.exports = startCleanupTask;