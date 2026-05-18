const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { getAllUsers, getProfile, updateProfile, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.get('/me', protect, getProfile);
router.put('/me', protect, upload.single('profileImage'), updateProfile);
router.get('/', protect, authorizeRoles('admin'), getAllUsers);
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

module.exports = router;