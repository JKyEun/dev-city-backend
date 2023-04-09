const express = require('express');

const router = express.Router();
const getStudyInfo = require('../controllers/studyController');

router.get('/', getStudyInfo);

module.exports = router;
