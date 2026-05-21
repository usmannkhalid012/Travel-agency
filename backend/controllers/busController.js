const mongoose = require('mongoose');
const Bus = require('../models/Bus');
const Booking = require('../models/Booking');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');

const isServerlessRuntime = () => Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);

// Helper to save buffer locally and return a public URL
// Accepts `req` so we can construct the correct host/protocol when
// BACKEND_URL is not provided.
const saveBufferLocally = async (req, buffer, mimetype) => {
  const fs = require('fs');
  const path = require('path');

  // organize uploads into date-based folders: uploads/YYYY/MM/DD/
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const uploadsDir = path.join(__dirname, '..', 'uploads', year, month, day);
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const ext = (mimetype && mimetype.split('/')[1]) || 'jpg';
  const filename = `bus-${Date.now()}.${ext}`;
  const filePath = path.join(uploadsDir, filename);

  // Try to optimize image with sharp if available
  try {
    const sharp = require('sharp');
    const outBuffer = await sharp(buffer)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    fs.writeFileSync(filePath, outBuffer);
  } catch (e) {
    // sharp not available or failed — fallback to writing original buffer
    fs.writeFileSync(filePath, buffer);
  }

  const backendUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
  const relativePath = `${year}/${month}/${day}/${filename}`;
  return `${backendUrl}/uploads/${relativePath}`;
};

const buildBusQuery = (query) => {
  const filters = {};

  if (query.departureCity) filters.departureCity = new RegExp(query.departureCity, 'i');
  if (query.arrivalCity) filters.arrivalCity = new RegExp(query.arrivalCity, 'i');
  if (query.busType) filters.busType = query.busType;
  if (query.status) filters.status = query.status;

  return filters;
};

const getAllBuses = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const sortBy = req.query.sortBy || '-createdAt';
  const filters = buildBusQuery(req.query);

  if (req.query.search) {
    filters.$or = [
      { busName: new RegExp(req.query.search, 'i') },
      { route: new RegExp(req.query.search, 'i') },
      { busNumber: new RegExp(req.query.search, 'i') }
    ];
  }

  const [buses, total] = await Promise.all([
    Bus.find(filters).sort(sortBy).skip((page - 1) * limit).limit(limit),
    Bus.countDocuments(filters)
  ]);

  apiResponse(res, 200, 'Buses fetched successfully', buses, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  });
});

const getSingleBus = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(404, 'Bus not found');
  }

  const bus = await Bus.findById(req.params.id);
  if (!bus) throw new ApiError(404, 'Bus not found');
  apiResponse(res, 200, 'Bus loaded successfully', bus);
});

const createBus = asyncHandler(async (req, res) => {
  console.log('createBus request received:', {
    body: req.body,
    hasFile: !!req.file,
    file: req.file ? { originalname: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype } : null
  });

  const payload = { ...req.body };

  // Parse amenities from comma-separated string to array
  if (payload.amenities && typeof payload.amenities === 'string') {
    payload.amenities = payload.amenities.split(',').map((item) => item.trim()).filter((item) => item);
  }

  if (req.file) {
    if (isServerlessRuntime()) {
      throw new ApiError(400, 'Image upload is not supported on serverless deployments without external storage. Send an image URL instead.');
    }
    try {
      payload.image = await saveBufferLocally(req, req.file.buffer, req.file.mimetype);
      console.log('Saved image locally for new bus:', payload.image);
    } catch (err) {
      console.error('Local image save failed:', err?.message || err);
      payload.image = undefined;
    }
  }

  payload.availableSeats = Number(payload.availableSeats || payload.totalSeats);
  const bus = await Bus.create(payload);
  apiResponse(res, 201, 'Bus created successfully', bus);
});

const updateBus = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(404, 'Bus not found');
  }

  console.log('updateBus request received:', {
    params: req.params,
    body: req.body,
    hasFile: !!req.file,
    file: req.file ? { originalname: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype } : null
  });

  const bus = await Bus.findById(req.params.id);
  if (!bus) throw new ApiError(404, 'Bus not found');

  // Normalize input: parse amenities and numeric fields to avoid mongoose cast errors
  const payload = { ...req.body };
  if (payload.amenities && typeof payload.amenities === 'string') {
    payload.amenities = payload.amenities.split(',').map((item) => item.trim()).filter((item) => item);
  }
  ['totalSeats', 'availableSeats', 'price'].forEach((key) => {
    if (payload[key] !== undefined) {
      const n = Number(payload[key]);
      if (!Number.isNaN(n)) payload[key] = n;
      else delete payload[key];
    }
  });

  Object.assign(bus, payload);
  if (req.file) {
    if (isServerlessRuntime()) {
      throw new ApiError(400, 'Image upload is not supported on serverless deployments without external storage. Send an image URL instead.');
    }
    try {
      bus.image = await saveBufferLocally(req, req.file.buffer, req.file.mimetype);
      console.log('Saved image locally for updated bus:', bus.image);
    } catch (err) {
      console.error('Local image save failed:', err?.message || err);
      // leave existing image untouched if saving fails
    }
  }

  try {
    await bus.save();
    apiResponse(res, 200, 'Bus updated successfully', bus);
  } catch (err) {
    console.error('Error saving updated bus:', err);
    throw new ApiError(500, err.message || 'Failed to save bus');
  }
});

const deleteBus = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(404, 'Bus not found');
  }

  const bus = await Bus.findByIdAndDelete(req.params.id);
  if (!bus) throw new ApiError(404, 'Bus not found');
  apiResponse(res, 200, 'Bus deleted successfully');
});

const getPopularRoutes = asyncHandler(async (req, res) => {
  const routes = await Bus.aggregate([
    { $match: { status: 'active' } },
    { $group: { _id: { departureCity: '$departureCity', arrivalCity: '$arrivalCity' }, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 6 }
  ]);

  apiResponse(res, 200, 'Popular routes fetched successfully', routes);
});

module.exports = { getAllBuses, getSingleBus, createBus, updateBus, deleteBus, getPopularRoutes };