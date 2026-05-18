const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  // Prefer Authorization header (Bearer) over cookie to avoid stale cookie values.
  // If header token exists but fails verification, fall back to cookie token.
  const headerToken = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null;
  const cookieToken = req.cookies?.token || null;
  let token = headerToken || cookieToken;

  // Dev: log token sources to help debug missing/invalid token during uploads
  if (process.env.NODE_ENV !== 'production') {
    try {
      console.debug('authMiddleware: Authorization header=', req.headers.authorization);
      console.debug('authMiddleware: Cookie token=', req.cookies?.token);
      console.debug('authMiddleware: headerToken present=', !!headerToken, 'cookieToken present=', !!cookieToken);
    } catch (e) {
      // ignore
    }
  }

  if (!headerToken && !cookieToken) {
    throw new ApiError(401, 'Not authorized, token missing');
  }

  let decoded;
  // Try header token first if present
  if (headerToken) {
    try {
      decoded = jwt.verify(headerToken, process.env.JWT_SECRET);
      token = headerToken;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') console.error('authMiddleware: header token jwt.verify error', err.message);
      // fall back to cookie token if available
      if (cookieToken) {
        try {
          decoded = jwt.verify(cookieToken, process.env.JWT_SECRET);
          token = cookieToken;
        } catch (err2) {
          if (process.env.NODE_ENV !== 'production') console.error('authMiddleware: cookie token jwt.verify error', err2.message);
          throw new ApiError(401, 'Not authorized, token invalid');
        }
      } else {
        throw new ApiError(401, 'Not authorized, token invalid');
      }
    }
  } else {
    // no header token, try cookie
    try {
      decoded = jwt.verify(cookieToken, process.env.JWT_SECRET);
      token = cookieToken;
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') console.error('authMiddleware: cookie token jwt.verify error', err.message);
      throw new ApiError(401, 'Not authorized, token invalid');
    }
  }
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    throw new ApiError(401, 'Not authorized, user not found');
  }

  req.user = user;
  next();
});

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, 'Access denied');
  }
  next();
};

module.exports = { protect, authorizeRoles };