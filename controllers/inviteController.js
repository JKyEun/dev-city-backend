const { ObjectId } = require('mongodb');
const client = require('./mongoConnect');

const removeRequest = async (req, res) => {
  const { id } = req.params;
  try {
    await client.connect();
    const studyDB = client.db('dev-city').collection('study');
    await studyDB.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { request: req.body.userId } },
    );

    res.status(200).send('요청목록 삭제 성공');
  } catch (err) {
    console.error(err);
    res.status(500).send('500번 에러');
  }
};

module.exports = {
  removeRequest,
};
