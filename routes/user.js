const express = require('express');

const router = express.Router();
const {
  getUserInfo,
  setTodoList,
  deleteTodoList,
} = require('../controllers/userController');

router.get('/:id', getUserInfo);
router.post('/todolist/:id', setTodoList);
router.delete('/todolist/:id', deleteTodoList);

module.exports = router;
