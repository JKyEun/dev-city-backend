const client = require('./mongoConnect'); // 몽고 디비 접속용 모듈 불러오기

const getStudyInfo = async (req, res) => {
  try {
    await client.connect();
    const studyDB = client.db('dev-city').collection('study-test');

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
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving study');
  }
};

module.exports = {postStudyInfo,getStudyInfo };
