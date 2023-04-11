const express = require('express');

const router = express.Router();
const getRecentStudies = require('../controllers/mainController');

router.get('/', getRecentStudies);
module.exports = router;
