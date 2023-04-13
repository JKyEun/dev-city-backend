const client = require('./mongoConnect');

const getUserInfo = async (req, res) => {
  try {
    await client.connect();
    const userDB = client.db('dev-city').collection('user');
    const userInfo = await userDB.findOne({ userId: req.params.id });
    if (!userInfo) {
      res.status(404).send('404번 에러입니다.');
      return;
    }
    res.status(200).json(userInfo);
  } catch (err) {
    console.error(err);
    res.status(500).send('500번 에러입니다.');
  }
};

const setTodoList = async (req, res) => {
  try {
    await client.connect();
    const userDB = client.db('dev-city').collection('user');
    await userDB.updateOne(
      { userId: req.params.id },
      { $push: { todoList: req.body } },
    );
    console.log('성공');
    res.send('투두리스트 추가 성공');
  } catch (err) {
    console.error(err);
    res.status(500).send('500번 에러입니다.');
  }
};

const deleteTodoList = async (req, res) => {
  try {
    await client.connect();
    const userDB = client.db('dev-city').collection('user');
    await userDB.updateOne(
      { userId: req.params.id },
      { $pull: { todoList: { id: req.body.id } } },
      (updateErr, updateResult) => {
        if (updateErr) throw updateErr;
        console.log(updateResult);
      },
    );
    res.status(200).send('투두리스트 삭제 성공');
  } catch (err) {
    console.error(err);
    res.status(500).send('500번 에러입니다.');
  }
};

const updateTodoList = async (req, res) => {
  try {
    await client.connect();
    const userDB = client.db('dev-city').collection('user');
    await userDB.updateOne(
      { userId: req.params.id, 'todoList.id': req.body.id },
      { $set: { 'todoList.$': req.body } },
      (updateErr, updateResult) => {
        if (updateErr) throw updateErr;
        console.log(updateResult);
      },
    );
    res.status(200).send('투두리스트 업데이트 성공');
  } catch (err) {
    console.error(err);
    res.status(500).send('500번 에러입니다.');
  }
};

const updateUserInfo = async (req, res) => {
  try {
    await client.connect();
    const userDB = client.db('dev-city').collection('user');
    const { _id, ...updateFields } = req.body;
    await userDB.updateOne(
      { userId: req.params.id },
      { $set: updateFields },
      (updateErr, updateResult) => {
        if (updateErr) throw updateErr;
        console.log(updateResult);
      },
    );
    res.status(200).send('유저 정보 업데이트 성공');
  } catch (err) {
    console.error(err);
    res.status(500).send('500번 에러입니다.');
  }
};

module.exports = {
  getUserInfo,
  setTodoList,
  deleteTodoList,
  updateTodoList,
  updateUserInfo,
};
