const express = require('express');

const router = express.Router();

const {
  getBoard,
  addPost,
  deletePost,
  modifyPost,
} = require('../controllers/boardController');

router.get('/get/:id', getBoard);
router.post('/add/:id', addPost);
router.post('/delete/:id', deletePost);
router.post('/modify/:id', modifyPost);

module.exports = router;
