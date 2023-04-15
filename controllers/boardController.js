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
  const { id: boardId, content, date } = req.body; // 수정할 게시글의 id와 content를 추출

  try {
    await client.connect();
    const studyDB = client.db('dev-city').collection('study');
    await studyDB.updateOne(
      { _id: new ObjectId(id), 'board.id': boardId },
      {
        $set: {
          'board.$.content': content,
          'board.$.date': date,
          'board.$.isModified': true,
        },
      }, // 해당 게시글의 content와 date, isModified 수정
    );

    res.status(200).send('게시글 수정 성공');
  } catch (err) {
    console.error(err);
    res.status(500).send('500번 에러');
  }
};

const addComment = async (req, res) => {
  const { id } = req.params;
  try {
    await client.connect();
    const studyDB = client.db('dev-city').collection('study');
    await studyDB.updateOne(
      {
        _id: new ObjectId(id),
        'board.id': req.body.boardId,
      },
      {
        $push: {
          'board.$.comment': req.body,
        },
      },
    );

    res.status(200).send('댓글 추가 성공');
  } catch (err) {
    console.error(err);
    res.status(500).send('500번 에러');
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    await client.connect();
    const studyDB = client.db('dev-city').collection('study');
    await studyDB.updateOne(
      {
        _id: new ObjectId(id),
        'board.id': req.body.boardId,
      },
      {
        $pull: {
          'board.$.comment': { id: req.body.id },
        },
      },
    );

    res.status(200).send('댓글 삭제 성공');
  } catch (err) {
    console.error(err);
    res.status(500).send('500번 에러');
  }
};

// const modifyComment = async (req, res) => {};

module.exports = {
  getBoard,
  addPost,
  deletePost,
  modifyPost,
  addComment,
  deleteComment,
  // modifyComment,
};
