const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  seatNumber: { type: String, required: true },
  bookingDate: { type: Date, default: Date.now },
  bookingTime: { type: String, default: () => new Date().toLocaleTimeString() },
  customerCNIC: { type: String, required: true },
  customerPhone: { type: String, required: true },
  advancePayment: { type: Number, default: 0 },
  remainingPayment: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['pending', 'partial', 'paid'], default: 'pending' },
  ticketStatus: { type: String, enum: ['pending', 'booked', 'cancelled', 'completed', 'rejected'], default: 'pending' },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminReviewNote: { type: String, default: '' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date
}, { timestamps: true });

bookingSchema.index({ bus: 1, seatNumber: 1 });

module.exports = mongoose.model('Booking', bookingSchema);