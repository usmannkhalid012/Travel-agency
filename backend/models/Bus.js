const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busName: { type: String, required: true, trim: true },
  busNumber: { type: String, required: true, unique: true, trim: true },
  driverName: { type: String, required: true, trim: true },
  route: { type: String, required: true, trim: true },
  departureCity: { type: String, required: true, trim: true },
  arrivalCity: { type: String, required: true, trim: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  totalSeats: { type: Number, required: true, min: 1 },
  availableSeats: { type: Number, required: true, min: 0 },
  busType: { type: String, enum: ['Economy', 'Business', 'Sleeper', 'Luxury'], default: 'Economy' },
  price: { type: Number, required: true, min: 0 },
  amenities: [{ type: String }],
  image: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);