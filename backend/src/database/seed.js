require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

    if (!mongoUri) {
      throw new Error('Defina MONGO_URI ou MONGO_URL no arquivo .env');
    }

    await mongoose.connect(mongoUri);
    console.log('Conectado ao MongoDB para execucao do seed...');

    const adminEmail = 'admin@admin.com';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = new User({
        name: 'Administrador do Sistema',
        email: adminEmail,
        password: 'adminpassword123',
        role: 'admin'
      });
      console.log('Usuario administrador criado com sucesso!');
    } else {
      admin.password = 'adminpassword123';
      console.log('Usuario administrador ja existe. Senha resetada para o padrao!');
    }

    await admin.save();
  } catch (error) {
    console.error('Erro ao popular o banco de dados:', error);
  } finally {
    mongoose.connection.close();
  }
}

seed();
