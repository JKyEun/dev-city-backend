const { ObjectId } = require('mongodb');
const client = require('./mongoConnect'); // 몽고 디비 접속용 모듈 불러오기

const getStudyInfo = async (req, res) => {
  try {
    await client.connect();
    const studyDB = client.db('dev-city').collection('study');

    const allStudyCursor = studyDB.find({});
    const studies = await allStudyCursor.toArray();
    if (!studies) {
      return res.status(404).send('Server Error');
    }
    res.status(200).json(studies);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving user');
  }
};

const postStudyInfo = async (req, res) => {
  const date = new Date();
  try {
    await client.connect();
    const studyDB = client.db('dev-city').collection('study');
    console.log(req.body);

    const newStudy = {
      studyName: req.body.study_name,
      studyIntro: req.body.study_intro,
      field: req.body.study_field,
      skills: req.body.skills,
      memberNum: req.body.member_num,
      member: req.body.member,
      board: req.body.board,
      structureImg: req.body.structureImg,
      createDate: date,
    };
    await studyDB.insertOne(newStudy);
    res.status(200).json('스터디 생성 성공');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving study');
  }
};

const getStudyDetail = async (req, res) => {
  const { id } = req.params;
  try {
    await client.connect();
    const studyDB = client.db('dev-city').collection('study');
    const findStudy = await studyDB.findOne({ _id: new ObjectId(id) });
    if (!findStudy) {
      return res.status(404).send('Server Error');
    }
    res.status(200).json(findStudy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving study' });
  }
};

module.exports = { postStudyInfo, getStudyInfo, getStudyDetail };
