const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('画像ファイルのみ許可されています', false));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = upload;