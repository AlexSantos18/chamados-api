const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const uploadsFolder = path.resolve(__dirname, '..', '..', 'uploads');

module.exports = {
  dest: uploadsFolder, // Destino padrão para os arquivos
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsFolder);
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const fileName = `${hash.toString('hex')}-${file.originalname}`;
        cb(null, fileName);
      });
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024, // Limite de 2MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido.'));
    }
  },
};