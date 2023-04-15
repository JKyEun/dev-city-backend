const express = require('express');

const router = express.Router();

const {
  getBoard,
  addPost,
  deletePost,
  modifyPost,
  addComment,
  deleteComment,
} = require('../controllers/boardController');

router.get('/get/:id', getBoard);
router.post('/add/:id', addPost);
router.post('/delete/:id', deletePost);
router.post('/modify/:id', modifyPost);
router.post('/add/comment/:id', addComment);
router.post('/delete/comment/:id', deleteComment);

module.exports = router;
