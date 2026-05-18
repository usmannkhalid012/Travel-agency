const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { createBooking, getUserBookings, getAllBookings, updateBookingApproval, cancelBooking } = require('../controllers/bookingController');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/me', protect, getUserBookings);
router.get('/', protect, authorizeRoles('admin'), getAllBookings);
router.patch('/:id/approval', protect, authorizeRoles('admin'), updateBookingApproval);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;