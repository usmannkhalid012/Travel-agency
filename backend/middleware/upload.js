const multer = require('multer');

const storage = multer.memoryStorage();

const MAX_MB = Number(process.env.MAX_UPLOAD_SIZE_MB) || 10;
const upload = multer({
  storage,
  limits: { fileSize: MAX_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    try {
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

      // If multer didn't provide a file object for some reason, treat as "no file" (not a hard error)
      if (!file) {
        return cb(null, false);
      }

      // Prefer MIME type check when available
      if (file.mimetype) {
        if (allowed.includes(file.mimetype.toLowerCase())) return cb(null, true);
      }

      // Fallback to extension check when mimetype is missing or unreliable
      const original = (file.originalname || '').toLowerCase();
      if (original.match(/\.(jpe?g|png|webp)$/)) {
        return cb(null, true);
      }

      // Reject with a descriptive message so client gets 400
      console.warn('Upload rejected by fileFilter:', { mimetype: file.mimetype, originalname: file.originalname });
      return cb(new Error('Invalid file type. Allowed types: .jpg, .jpeg, .png, .webp'));
    } catch (err) {
      console.error('fileFilter error:', err);
      return cb(new Error('File validation error'));
    }
  }
});

module.exports = upload;