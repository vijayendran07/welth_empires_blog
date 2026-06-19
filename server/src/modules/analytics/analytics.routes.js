const express = require('express');
const { getAnalytics } = require('./analytics.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

router.use(protect);
router.get('/', authorize('ADMIN', 'AUTHOR'), getAnalytics);

module.exports = router;
