const express = require('express');

const router = express.Router();

const {
  getUserInfo,
  setTodoList,
  deleteTodoList,
  updateTodoList,
} = require('../controllers/userController');

const {
  signUp,
  signIn,
  kakaoLogin,
} = require('../controllers/loginController');

router.get('/:id', getUserInfo);
router.post('/setlist/:id', setTodoList);
router.post('/deletelist/:id', deleteTodoList);
router.post('/updatelist/:id', updateTodoList);
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/kakaologin', kakaoLogin);

module.exports = router;
