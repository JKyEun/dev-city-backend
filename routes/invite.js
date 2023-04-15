const express = require('express');

const router = express.Router();

const {
  getRequest,
  removeRequest,
  addRequest,
} = require('../controllers/inviteController');

router.get('/get/:id', getRequest);
router.post('/remove/:id', removeRequest);
router.post('/add/:id', addRequest);

module.exports = router;
