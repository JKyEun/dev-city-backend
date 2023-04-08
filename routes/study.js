const express = require('express');

const router = express.Router();
const postStudyInfo = require('../controllers/studyController');

router.post('/create_study', postStudyInfo);

module.exports = router;
