const express = require('express');

const router = express.Router();

const {
  postStudyInfo,
  getStudyDetail,
  getStudyInfo,
  updateStudyInfo,
  pushLikedStudy,
  deleteStudyInfo,
  leaveStudy,
  closeStudy,
  openStudy,
  modifyStudyInfo,
} = require('../controllers/studyController');

router.get('/', getStudyInfo);
router.post('/like', pushLikedStudy);
router.post('/create_study', postStudyInfo);
router.get('/detail/:id', getStudyDetail);
router.post('/detail/:id/close', closeStudy);
router.post('/detail/:id/open', openStudy);
router.put('/update/:id', updateStudyInfo);
router.delete('/delete/:id', deleteStudyInfo);
router.delete('/leave/:id', leaveStudy);
router.post('/modify/:id', modifyStudyInfo);

module.exports = router;
