const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');

const debugToken = asyncHandler(async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Not allowed in production' });
  }

  const headerToken = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null;
  const cookieToken = req.cookies?.token || null;

  const result = {
    headerTokenPresent: !!headerToken,
    cookieTokenPresent: !!cookieToken
  };

  if (!headerToken && !cookieToken) {
    return res.status(400).json({ success: false, message: 'No token provided', result });
  }

  if (headerToken) {
    try {
      result.header = jwt.verify(headerToken, process.env.JWT_SECRET);
    } catch (err) {
      result.headerError = err.message;
    }
  }

  if (cookieToken) {
    try {
      result.cookie = jwt.verify(cookieToken, process.env.JWT_SECRET);
    } catch (err) {
      result.cookieError = err.message;
    }
  }

  res.json({ success: true, result });
});

module.exports = { debugToken };
