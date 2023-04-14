const { ObjectId } = require('mongodb');
const client = require('./mongoConnect');

const getBoard = async (req, res) => {
  const { id } = req.params;
  try {
    await client.connect();
    const studyDB = client.db('dev-city').collection('study');
    const myStudy = await studyDB.findOne({ _id: new ObjectId(id) });

    res.status(200).json(myStudy);
  } catch (err) {
    console.error(err);
    res.status(500).send('500번 에러');
  }
};

const addPost = async (req, res) => {
  const { id } = req.params;
  try {
    await client.connect();
    const studyDB = client.db('dev-city').collection('study');
    await studyDB.updateOne(
      { _id: new ObjectId(id) },
      { $push: { board: req.body } },
      (updateErr, updateResult) => {
        if (updateErr) throw updateErr;
        console.log(updateResult);
      },
    );

    res.status(201).send('게시글 생성 성공');
  } catch (err) {
    console.error(err);
    res.status(500).send('500번 에러');
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await client.connect();
    const studyDB = client.db('dev-city').collection('study');
    await studyDB.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { board: { id: req.body.id } } },
      (updateErr, updateResult) => {
        if (updateErr) throw updateErr;
        console.log(updateResult);
      },
    );

    res.status(200).send('게시글 삭제 성공');
  } catch (err) {
    console.error(err);
    res.status(500).send('500번 에러');
  }
};

const modifyPost = async (req, res) => {
  const { id } = req.params;
  try {
    await client.connect();
    const studyDB = client.db('dev-city').collection('study');
    await studyDB.updateOne(
      { userId: id, 'board.id': req.body.id },
      { $set: { 'board.$': req.body } },
      (updateErr, updateResult) => {
        if (updateErr) throw updateErr;
        console.log(updateResult);
      },
    );

    res.status(200).send('게시글 수정 성공');
  } catch (err) {
    console.error(err);
    res.status(500).send('500번 에러');
  }
};

// const addComment = async (req, res) => {};

// const deleteComment = async (req, res) => {};

// const modifyComment = async (req, res) => {};

module.exports = {
  getBoard,
  addPost,
  deletePost,
  modifyPost,
  // addComment,
  // deleteComment,
  // modifyComment,
};
