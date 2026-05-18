const express = require('express');
const upload = require('../middleware/upload');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { getAllBuses, getSingleBus, createBus, updateBus, deleteBus, getPopularRoutes } = require('../controllers/busController');

const router = express.Router();

router.get('/popular-routes', getPopularRoutes);
router.get('/', getAllBuses);
router.get('/:id', getSingleBus);
router.post('/', protect, authorizeRoles('admin'), upload.single('image'), createBus);
router.put('/:id', protect, authorizeRoles('admin'), upload.single('image'), updateBus);
router.delete('/:id', protect, authorizeRoles('admin'), deleteBus);

module.exports = router;