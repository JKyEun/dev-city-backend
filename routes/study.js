const express = require('express');

const router = express.Router();

const {
  postStudyInfo,
  getStudyDetail,
  getStudyInfo,
  updateStudyInfo,
  pushLikedStudy,
} = require('../controllers/studyController');

router.get('/', getStudyInfo);
router.post('/like', pushLikedStudy);
router.post('/create_study', postStudyInfo);
router.get('/detail/:id', getStudyDetail);
router.put('/update/:id', updateStudyInfo);

module.exports = router;
