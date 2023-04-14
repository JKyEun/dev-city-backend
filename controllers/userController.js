const { ObjectId } = require('mongodb');
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

const joinStudy = async (req, res) => {
  try {
    await client.connect();
    const userDB = client.db('dev-city').collection('user');
    const studyDB = client.db('dev-city').collection('study');
    const { userId, studyId } = req.body;
    const user = await userDB.findOne({ userId });
    const findStudy = await studyDB.findOne({ _id: new ObjectId(studyId) });

    // 빌딩 숫자 1~9와 빌딩 위치 숫자 1~9
    const buildingNum = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const locationNum = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    let existBuildingArr = [];
    let existLocationArr = [];

    // tetz, 빌딩 안겹치는 코드
    if (user.joinedStudy?.length > 0) {
      existBuildingArr = user.joinedStudy.map((el) => el.building);
      existLocationArr = user.joinedStudy.map((el) => el.buildingLocation);
    }

    const possibleBuildingArr = buildingNum.filter(
      (el) => !existBuildingArr.includes(el),
    );

    // tetz, 로케이션 안겹치는 코드
    const possibleLocationArr = locationNum.filter(
      (el) => !existLocationArr.includes(el),
    );

    // building을 랜덤으로 추출하여 스터디 생성에 활용
    const building =
      possibleBuildingArr[
        Math.floor(Math.random() * possibleBuildingArr.length)
      ];
    const buildingLocation =
      possibleLocationArr[
        Math.floor(Math.random() * possibleLocationArr.length)
      ];

    const joinedStudy = {
      building,
      buildingLocation,
      studyName: findStudy.studyName,
      createDate: findStudy.createDate,
      skills: findStudy.skills,
      field: findStudy.field,
      objectId: findStudy._id,
      leaderId: findStudy.leaderId,
    };

    await userDB.updateOne(
      { userId },
      { $push: { joinedStudy } },
      (updateErr, updateResult) => {
        if (updateErr) throw updateErr;
        console.log(updateResult);
      },
    );
    res.status(200).send('스터디 참여하기 성공');
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
  joinStudy,
};
