const ApiError = require('../utils/apiError');

const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not found - ${req.originalUrl}`);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  // Handle Multer file upload errors (file size, invalid file, etc.)
  if (error) {
    // Log the error for debugging
    console.error('Global error handler caught:', error);
    // Multer errors (size, unexpected fields)
    if (error.code === 'LIMIT_FILE_SIZE' || error.name === 'MulterError') {
      return res.status(400).json({ success: false, message: error.message || 'File upload error' });
    }

    // File filter or validation produced an Error with a helpful message
    if (typeof error.message === 'string' && /file|upload|extension|type/i.test(error.message)) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // Handle Mongo duplicate key errors (E11000) and return a friendly 400
  if (error && (error.code === 11000 || error.name === 'MongoServerError')) {
    const key = error.keyValue ? Object.keys(error.keyValue)[0] : 'field';
    const value = error.keyValue ? error.keyValue[key] : undefined;
    const message = value ? `${key} '${value}' already exists` : 'Duplicate key error';
    return res.status(400).json({ success: false, message });
  }

  // Handle common FS errors (permission, no space) with clearer messages
  if (error && error.code && (error.code === 'EACCES' || error.code === 'ENOSPC' || error.code === 'ENOENT')) {
    return res.status(500).json({ success: false, message: 'Server file system error: ' + (error.message || error.code) });
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
  });
};

module.exports = { notFound, errorHandler };