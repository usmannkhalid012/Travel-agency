const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const sendEmail = require('../services/emailService');

const generateToken = (res, user) => {
  const token = require('jsonwebtoken').sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // Allow cross-site cookies in production via 'none' with secure; use 'lax' in development
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return token;
};

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  profileImage: user.profileImage,
  createdAt: user.createdAt
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  const existing = await User.findOne({ email });

  if (existing) {
    throw new ApiError(400, 'Email already exists');
  }

  const user = await User.create({ name, email, password, phone, role: role || 'customer' });
  const token = generateToken(res, user);

  const meta = process.env.NODE_ENV === 'production' ? null : { token };
  apiResponse(res, 201, 'User registered successfully', sanitizeUser(user), meta);
});

const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  let isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid && user.password === password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ _id: user._id }, { password: hashedPassword });
    user.password = hashedPassword;
    isPasswordValid = true;
  }

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = require('jsonwebtoken').sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? '30d' : (process.env.JWT_EXPIRES_IN || '7d')
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // Allow cross-site cookies in production via 'none' with secure; use 'lax' in development
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000
  });

  // In development provide the token in the response body as a fallback
  // so frontends can set an Authorization header when cookies are blocked.
  const meta = process.env.NODE_ENV === 'production' ? null : { token };

  apiResponse(res, 200, 'Login successful', sanitizeUser(user), meta);
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  apiResponse(res, 200, 'Logout successful');
});

const me = asyncHandler(async (req, res) => {
  const token = generateToken(res, req.user);
  const meta = process.env.NODE_ENV === 'production' ? null : { token };
  apiResponse(res, 200, 'Profile loaded', sanitizeUser(req.user), meta);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Bus Ticket Management - Reset Password',
    text: `Reset your password: ${resetUrl}`
  });

  apiResponse(res, 200, 'Password reset link sent');
});

const resetPassword = asyncHandler(async (req, res) => {
  const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new ApiError(400, 'Reset token is invalid or has expired');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = generateToken(res, user);
  const meta = process.env.NODE_ENV === 'production' ? null : { token };
  apiResponse(res, 200, 'Password reset successful', sanitizeUser(user), meta);
});

module.exports = { register, login, logout, me, forgotPassword, resetPassword, sanitizeUser, generateToken };