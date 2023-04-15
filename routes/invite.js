const express = require('express');

const router = express.Router();

const { removeRequest } = require('../controllers/inviteController');

router.post('/remove/:id', removeRequest);

module.exports = router;
