const client = require('./mongoConnect');

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

module.exports = getStudyInfo;
