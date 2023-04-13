const express = require('express');

const router = express.Router();

const {
  getUserInfo,
  setTodoList,
  deleteTodoList,
<<<<<<< Updated upstream
=======
  updateTodoList,
  updateUserInfo,
>>>>>>> Stashed changes
} = require('../controllers/userController');

const {
  signUp,
  signIn,
  kakaoLogin,
} = require('../controllers/loginController');

router.get('/:id', getUserInfo);
router.post('/setlist/:id', setTodoList);
router.post('/deletelist/:id', deleteTodoList);
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/kakaologin', kakaoLogin);
router.post('/updateuser/:id', updateUserInfo);

module.exports = router;
