const express = require('express');

const router = express.Router();
const getRecentStudies = require('../controllers/recentStudyController');

router.get('/', getRecentStudies);

module.exports = router;
