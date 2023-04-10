const express = require('express');

const router = express.Router();

const {
  postStudyInfo,
  getStudyDetail,
  getStudyInfo,
} = require('../controllers/studyController');

router.get('/', getStudyInfo);
router.post('/create_study', postStudyInfo);
router.get('/detail/:id', getStudyDetail);

module.exports = router;
