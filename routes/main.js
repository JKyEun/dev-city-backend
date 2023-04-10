const express = require('express');

const router = express.Router();
const {
  getRecentStudies,
  getAllUsers,
} = require('../controllers/mainController');

router.get('/', getRecentStudies);
router.get('/', getAllUsers);

module.exports = router;
