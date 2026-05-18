const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');

const createBooking = asyncHandler(async (req, res) => {
  const { busId, seatNumber, customerCNIC, customerPhone, advancePayment = 0 } = req.body;

  if (!mongoose.isValidObjectId(busId)) {
    throw new ApiError(404, 'Bus not found');
  }

  const bus = await Bus.findById(busId);

  if (!bus) throw new ApiError(404, 'Bus not found');
  if (bus.availableSeats <= 0) throw new ApiError(400, 'No seats available');
  if (!seatNumber || !customerCNIC || !customerPhone) {
    throw new ApiError(400, 'Seat, CNIC, and phone are required');
  }

  const numericAdvancePayment = Number(advancePayment);
  if (Number.isNaN(numericAdvancePayment) || numericAdvancePayment < 0) {
    throw new ApiError(400, 'Advance payment must be a valid non-negative number');
  }

  if (numericAdvancePayment > bus.price) {
    throw new ApiError(400, 'Advance payment cannot be greater than fare');
  }

  const alreadyBooked = await Booking.findOne({
    bus: busId,
    seatNumber,
    approvalStatus: { $in: ['pending', 'approved'] },
    ticketStatus: { $ne: 'cancelled' }
  });
  if (alreadyBooked) throw new ApiError(400, 'Seat already booked');

  const remainingPayment = Math.max(bus.price - numericAdvancePayment, 0);
  const paymentStatus = numericAdvancePayment >= bus.price ? 'paid' : numericAdvancePayment > 0 ? 'partial' : 'pending';

  const booking = await Booking.create({
    user: req.user._id,
    bus: busId,
    seatNumber,
    customerCNIC,
    customerPhone,
    advancePayment: numericAdvancePayment,
    remainingPayment,
    paymentStatus,
    ticketStatus: 'pending',
    approvalStatus: 'pending'
  });

  apiResponse(res, 201, 'Booking request submitted for admin approval', booking);
});

const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('bus').sort('-createdAt');
  apiResponse(res, 200, 'Bookings fetched successfully', bookings);
});

const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'name email phone role')
    .populate('bus')
    .populate('reviewedBy', 'name email')
    .sort('-createdAt');
  apiResponse(res, 200, 'All bookings fetched successfully', bookings);
});

const updateBookingApproval = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(404, 'Booking not found');
  }

  const { status, note = '' } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    throw new ApiError(400, 'Status must be approved or rejected');
  }

  const booking = await Booking.findById(req.params.id).populate('bus');
  if (!booking) throw new ApiError(404, 'Booking not found');

  if (booking.approvalStatus !== 'pending') {
    throw new ApiError(400, 'Booking request already reviewed');
  }

  if (status === 'approved') {
    const bus = await Bus.findById(booking.bus._id);
    if (!bus) throw new ApiError(404, 'Bus not found for booking');
    if (bus.availableSeats <= 0) throw new ApiError(400, 'No seats available to approve this request');

    const seatConflict = await Booking.findOne({
      _id: { $ne: booking._id },
      bus: booking.bus._id,
      seatNumber: booking.seatNumber,
      approvalStatus: 'approved',
      ticketStatus: { $ne: 'cancelled' }
    });

    if (seatConflict) {
      throw new ApiError(400, 'Seat already approved for another booking');
    }

    booking.approvalStatus = 'approved';
    booking.ticketStatus = 'booked';
    booking.adminReviewNote = note;
    booking.reviewedBy = req.user._id;
    booking.reviewedAt = new Date();
    await booking.save();

    bus.availableSeats -= 1;
    await bus.save();

    return apiResponse(res, 200, 'Booking approved successfully', booking);
  }

  booking.approvalStatus = 'rejected';
  booking.ticketStatus = 'rejected';
  booking.adminReviewNote = note;
  booking.reviewedBy = req.user._id;
  booking.reviewedAt = new Date();
  await booking.save();

  return apiResponse(res, 200, 'Booking rejected successfully', booking);
});

const cancelBooking = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(404, 'Booking not found');
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, 'Booking not found');

  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied');
  }

  if (booking.ticketStatus === 'cancelled') {
    throw new ApiError(400, 'Booking already cancelled');
  }

  booking.ticketStatus = 'cancelled';
  await booking.save();

  if (booking.approvalStatus === 'approved') {
    const bus = await Bus.findById(booking.bus);
    if (bus) {
      bus.availableSeats += 1;
      await bus.save();
    }
  }

  apiResponse(res, 200, 'Booking cancelled successfully', booking);
});

module.exports = { createBooking, getUserBookings, getAllBookings, updateBookingApproval, cancelBooking };