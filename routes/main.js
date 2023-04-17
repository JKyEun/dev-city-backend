const express = require('express');

const router = express.Router();
const getAllUsers = require('../controllers/mainController');

router.get('/:id', getAllUsers);
module.exports = router;
