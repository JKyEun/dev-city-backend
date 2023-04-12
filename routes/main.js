const express = require('express');

const router = express.Router();
const getAllUsers = require('../controllers/mainController');

router.get('/', getAllUsers);
module.exports = router;
