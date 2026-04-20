const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

if (!mongoUri) {
  throw new Error('Defina MONGO_URI ou MONGO_URL no arquivo .env');
}

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.log(err));

module.exports = mongoose;
