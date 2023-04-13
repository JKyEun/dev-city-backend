/* eslint-disable indent */
const { ObjectId } = require('mongodb');
const client = require('./mongoConnect');

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
    const userDB = client.db('dev-city').collection('user');

    const { userId } = req.body; // 로컬스토리지에 있는 userId

    // user 컬렉션에서 현재 내가 로그인한 userId로 접근
    // 동일한 userId에 생성한 스터디 정보 일부 추가
    const user = await userDB.findOne({ userId });

    // 스터디 생성 제한: 한 유저는 9개 이하의 스터디만 생성할 수 있음
    if (user.studyList && user.studyList.length >= 9) {
      return res
        .status(404)
        .json(
          '더 이상 스터디를 생성할 수 없습니다. \n최대 9개의 스터디를 생성할 수 있습니다.',
        );
    }

    const newStudy = {
      studyName: req.body.study_name,
      studyIntro: req.body.study_intro,
      studySystem: req.body.study_system,
      field: req.body.study_field,
      skills: req.body.skills,
      memberNum: req.body.member_num,
      member: req.body.member,
      board: req.body.board,
      structureImg: req.body.structureImg,
      createDate: date,
      leaderId: userId,
      etc: req.body.study_etc,
    };

    // study 컬렉션에 새로운 스터디 생성
    const insertResult = await studyDB.insertOne(newStudy);

    // 빌딩 숫자 1~9와 빌딩 위치 숫자 1~9
    const buildingNum = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const locationNum = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // 이미 생성된 스터디들 중에서 buildingNum에 있는 숫자들을 뽑아오기
    const existBuilding = await userDB.find({}, { building: 1 }).toArray();
    const usedBuilding = existBuilding.map((study) => study.building);

    const existLocation = await userDB
      .find({}, { buildingLocation: 1 })
      .toArray();
    const usedLocation = existLocation.map((study) => study.buildingLocation);

    // buildingNum과 usedBuilding을 비교
    // 사용하지 않은 숫자 뽑아오기
    const availableNum = buildingNum.filter(
      (num) => !usedBuilding.includes(num),
    );

    const availableLocationNum = locationNum.filter(
      (num) => !usedLocation.includes(num),
    );
    // 사용 가능한 숫자가 없으면 오류 메시지를 반환하고 함수를 종료
    if (availableNum.length === 0 || availableLocationNum.length === 0) {
      return res.status(404).json('더 이상 스터디를 생성할 수 없습니다.');
    }

    // building을 랜덤으로 추출하여 스터디 생성에 활용
    const building =
      availableNum[Math.floor(Math.random() * availableNum.length)];
    const buildingLocation =
      availableLocationNum[
        Math.floor(Math.random() * availableLocationNum.length)
      ];

    const updatedUser = {
      ...user,
      // user.studyList가 undefined인 경우 새로운 배열로 만들어서 추가
      // 이미 값이 있으면 기존 스터디 목록에 새로운 스터디를 추가
      studyList: user.studyList
        ? [
            ...user.studyList,
            {
              building,
              buildingLocation,
              studyName: newStudy.studyName,
              createDate: newStudy.createDate,
              skills: newStudy.skills,
              field: newStudy.field,
              objectId: insertResult.insertedId,
            },
          ]
        : [
            {
              building,
              buildingLocation,
              studyName: newStudy.studyName,
              createDate: newStudy.createDate,
              skills: newStudy.skills,
              field: newStudy.field,
              objectId: insertResult.insertedId,
            },
          ],
    };

    // 사용자 컬렉션에서 해당 사용자의 정보 업데이트
    await userDB.updateOne({ userId }, { $set: updatedUser });

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

const updateStudyInfo = async (req, res) => {
  const { id } = req.params;
  const { updatedMember } = req.body;
  try {
    await client.connect();
    const studyDB = client.db('dev-city').collection('study');
    const updateStudy = await studyDB.updateOne(
      { _id: new ObjectId(id) },
      { $push: { member: updatedMember } },
    );

    if (updateStudy.modifiedCount === 1) {
      res.status(200).json('스터디 멤버 업데이트 성공!');
      console.log({ updatedMember });
    } else {
      res.status(404).json('스터디를 찾을 수 없음');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('스터디 멤버 업데이트 실패');
  }
};

module.exports = {
  postStudyInfo,
  getStudyInfo,
  getStudyDetail,
  updateStudyInfo,
};
