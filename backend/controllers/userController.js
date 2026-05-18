const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort('-createdAt');
  apiResponse(res, 200, 'Users fetched successfully', users);
});

const getProfile = asyncHandler(async (req, res) => {
  apiResponse(res, 200, 'Profile loaded successfully', req.user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) throw new ApiError(404, 'User not found');

  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone ?? user.phone;

  // If a file was uploaded, save it locally and set profileImage to its URL
  if (req.file && req.file.buffer) {
    try {
      // reuse local save logic similar to buses
      const fs = require('fs');
      const path = require('path');

      const now = new Date();
      const year = now.getFullYear().toString();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');

      const uploadsDir = path.join(__dirname, '..', 'uploads', year, month, day);
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      const ext = (req.file.mimetype && req.file.mimetype.split('/')[1]) || 'jpg';
      const filename = `user-${req.user._id}-${Date.now()}.${ext}`;
      const filePath = path.join(uploadsDir, filename);

      try {
        const sharp = require('sharp');
        const outBuffer = await sharp(req.file.buffer)
          .rotate()
          .resize({ width: 800, withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();
        fs.writeFileSync(filePath, outBuffer);
      } catch (e) {
        fs.writeFileSync(filePath, req.file.buffer);
      }

      const backendUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
      const relativePath = `${year}/${month}/${day}/${filename}`;
      user.profileImage = `${backendUrl}/uploads/${relativePath}`;
    } catch (err) {
      console.error('Failed to save profile image:', err);
    }
  } else {
    user.profileImage = req.body.profileImage ?? user.profileImage;
  }

  await user.save();

  apiResponse(res, 200, 'Profile updated successfully', user);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  apiResponse(res, 200, 'User deleted successfully');
});

module.exports = { getAllUsers, getProfile, updateProfile, deleteUser };