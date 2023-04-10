const express = require('express');

const router = express.Router();
const {
  getUserInfo,
  setTodoList,
  deleteTodoList,
} = require('../controllers/userController');

router.get('/:id', getUserInfo);
router.post('/setlist/:id', setTodoList);
router.post('/deletelist/:id', deleteTodoList);

module.exports = router;
