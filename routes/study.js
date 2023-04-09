const express = require('express');

const router = express.Router();

const postStudyInfo = require('../controllers/studyController');
const getStudyInfo = require('../controllers/studyController');


router.get('/', getStudyInfo);
router.post('/create_study', postStudyInfo);

module.exports = router;
