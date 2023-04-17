const express = require('express');

const router = express.Router();

const { getChatLog, pushChatLog } = require('../controllers/chatController');

router.get('/get/:id', getChatLog);
router.post('/push/:id', pushChatLog);

module.exports = router;
