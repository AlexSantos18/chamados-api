const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define o diretório de upload
const uploadDir = path.resolve(__dirname, '..', '..', 'uploads');

// Garante que o diretório de upload exista
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB por arquivo (ajuste conforme necessário)
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg', 'image/pjpeg', 'image/png', 'image/gif',
      'application/pdf',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .doc e .docx
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xls e .xlsx
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .ppt e .pptx
      'text/plain'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido. Apenas imagens, PDFs, documentos Office e texto são permitidos.'));
    }
  },
});

module.exports = upload;