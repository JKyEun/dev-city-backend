const express = require('express');

const router = express.Router();
const getUserInfo = require('../controllers/userController');

router.get('/:id', getUserInfo);

module.exports = router;
