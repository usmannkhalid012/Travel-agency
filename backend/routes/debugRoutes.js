const express = require('express');
const { debugToken } = require('../controllers/debugController');

const router = express.Router();

// Dev-only: GET /api/debug/token
router.get('/token', debugToken);

module.exports = router;
