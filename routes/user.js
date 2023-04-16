const express = require('express');
const multer = require('multer');
const fs = require('fs');

const router = express.Router();

const {
  getUserInfo,
  setTodoList,
  deleteTodoList,
  updateTodoList,
  updateUserInfo,
  joinStudy,
  updateUserImg,
} = require('../controllers/userController');

const {
  signUp,
  signIn,
  kakaoLogin,
  githubLoginFetch,
  githubLogin,
} = require('../controllers/loginController');

const dir = './uploads'; // node.js가 하는것이므로 상대경로로 작성해줘야함
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now());
  },
});

const upload = multer({ storage });

if (!fs.existsSync(dir)) fs.mkdirSync(dir);

router.get('/:id', getUserInfo);
router.post('/setlist/:id', setTodoList);
router.post('/deletelist/:id', deleteTodoList);
router.post('/updatelist/:id', updateTodoList);
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/kakaologin', kakaoLogin);
router.post('/githublogin', githubLogin);
router.post('/githublogin/fetch', githubLoginFetch);
router.post('/updateuser/:id', updateUserInfo);
router.post('/joinstudy', joinStudy);
router.post('/updateuser/images/:id', upload.single('img'), updateUserImg);

module.exports = router;
