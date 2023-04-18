/* eslint-disable indent */
const { ObjectId } = require('mongodb');
const CryptoJS = require('crypto-js');
const axios = require('axios');
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

    console.log({ userId });
    console.log(userId);
    console.log(user);
    // user 컬렉션에 있는 nickName 가져오기
    const { nickName } = user;

    // 스터디 생성 제한: 한 유저는 9개 이하의 스터디만 생성할 수 있음
    if (user.joinedStudy && user.joinedStudy.length >= 9) {
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
      request: req.body.request,
      isClosed: req.body.isClosed,
      nickName,
    };

    // study 컬렉션에 새로운 스터디 생성
    const insertResult = await studyDB.insertOne(newStudy);

    // 빌딩 숫자 1~9와 빌딩 위치 숫자 1~9
    const buildingNum = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const locationNum = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // tetz, 빌딩 안겹치는 코드
    const existBuildingArr = user.joinedStudy
      ? user.joinedStudy.map((el) => el.building)
      : [];
    const possibleBuildingArr = buildingNum.filter(
      (el) => !existBuildingArr.includes(el),
    );

    // tetz, 로케이션 안겹치는 코드
    const existLocationArr = user.joinedStudy
      ? user.joinedStudy.map((el) => el.buildingLocation)
      : [];
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

    const updatedUser = {
      ...user,
      // user.joinedStudy가 undefined인 경우 새로운 배열로 만들어서 추가
      // 이미 값이 있으면 기존 스터디 목록에 새로운 스터디를 추가
      joinedStudy: user.joinedStudy
        ? [
            ...user.joinedStudy,
            {
              building,
              buildingLocation,
              studyName: newStudy.studyName,
              createDate: newStudy.createDate,
              skills: newStudy.skills,
              field: newStudy.field,
              objectId: insertResult.insertedId,
              leaderId: newStudy.leaderId,
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
              leaderId: newStudy.leaderId,
            },
          ],
    };

    // 사용자 컬렉션에서 해당 사용자의 정보 업데이트
    await userDB.updateOne({ userId }, { $set: updatedUser });

    res.status(200).send({
      message: '스터디 생성 성공',
      nickName,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('스터디 생성 에러');
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
    const study = await studyDB.findOne({ _id: new ObjectId(id) });
    const currentNum2 = study.memberNum.currentNum;
    const updateStudy = await studyDB.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { member: updatedMember },
        $set: { 'memberNum.currentNum': currentNum2 + 1 },
      },
    );

    if (updateStudy.modifiedCount === 1) {
      res.status(200).json('스터디 멤버 업데이트 성공!');
    } else {
      res.status(404).json('스터디를 찾을 수 없음');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('스터디 멤버 업데이트 실패');
  }
};

const pushLikedStudy = async (req, res) => {
  try {
    await client.connect();
    const userDB = client.db('dev-city').collection('user');
    if (!req.body.isDelete) {
      await userDB.updateOne(
        { userId: req.body.userId },
        { $push: { likedStudy: req.body.studyId } },
      );
      res.status(200).json('좋아요 항목 추가 성공');
    } else {
      await userDB.updateOne(
        { userId: req.body.userId },
        { $pull: { likedStudy: req.body.studyId } },
      );
      res.status(200).json('좋아요 항목 제거 성공');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error' });
  }
};

const deleteStudyInfo = async (req, res) => {
  const { id } = req.params;
  try {
    await client.connect();
    const studyDB = client.db('dev-city').collection('study');
    const userDB = client.db('dev-city').collection('user');

    const deleteStudy = await studyDB.deleteOne({ _id: new ObjectId(id) });

    if (deleteStudy.deletedCount === 0) {
      return res.status(404).send('스터디를 삭제할 수 없습니다.');
    }

    // user 컬렉션에서 해당 스터디를 참여하고 있는 모든 사용자를 찾아서 joinedStudy 배열에서 삭제
    const users = await userDB
      .find({ 'joinedStudy.objectId': new ObjectId(id) })
      .toArray();

    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];
      const updatedJoinedStudy = user.joinedStudy.filter(
        (study) => String(study.objectId) !== id,
      );
      // eslint-disable-next-line no-await-in-loop
      await userDB.updateOne(
        { _id: user._id },
        { $set: { joinedStudy: updatedJoinedStudy } },
      );
    }

    res.status(200).send('스터디가 삭제되었습니다.');
  } catch (err) {
    console.error(err);
    res.status(500).send('스터디 삭제 에러');
  }
};

const leaveStudy = async (req, res) => {
  const { id } = req.params; // 탈퇴하려는 스터디의 ID 값
  const { userId } = req.body; // 탈퇴하려는 사용자의 ID 값

  try {
    await client.connect();
    const studyDB = client.db('dev-city').collection('study');
    const userDB = client.db('dev-city').collection('user');

    // 스터디가 존재하는지 확인
    const study = await studyDB.findOne({ _id: new ObjectId(id) });

    // 사용자가 있는지 확인
    const user = await userDB.findOne({ userId });

    const joinedStudy = user.joinedStudy.find(
      // eslint-disable-next-line no-shadow
      (study) => String(study.objectId) === id,
    );

    console.log('user:', user);
    console.log('study:', study);
    console.log('joinedStudy:', joinedStudy);

    // user 컬렉션에서 joinedStudy 배열에서 해당 스터디 정보 삭제
    const leaveJoinedStudy = user.joinedStudy.filter(
      // eslint-disable-next-line no-shadow
      (study) => String(study.objectId) !== id,
    );

    // 해당 사용자의 joinedStudy를 업데이트
    await userDB.updateOne(
      { userId },
      { $set: { joinedStudy: leaveJoinedStudy } },
    );

    // study 컬렉션에서 member 배열에서 사용자 정보 삭제
    const updatedMembers = study.member
      ? study.member.filter((member) => String(member.memberId) !== userId)
      : [];

    // memberNum 배열 안의 currentNum 값을 1 감소시킴
    const updatedMemberNum = {
      ...study.memberNum,
      currentNum: study.memberNum.currentNum - 1,
    };
    console.log('leaveJoinedStudy:', leaveJoinedStudy);

    await studyDB.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          member: updatedMembers,
          memberNum: updatedMemberNum,
        },
      },
    );
    res.status(200).send({
      message: '스터디 탈퇴 성공',
      updatedMembers,
      updatedMemberNum,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('스터디 탈퇴 에러');
  }
};

const closeStudy = async (req, res) => {
  const { id } = req.params;
  try {
    const studyDB = client.db('dev-city').collection('study');
    await studyDB.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isClosed: true } },
    );
    res.status(200).json('모집 중단 완료');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error' });
  }
};

const openStudy = async (req, res) => {
  const { id } = req.params;
  try {
    const studyDB = client.db('dev-city').collection('study');
    await studyDB.updateOne(
      { _id: new ObjectId(id) },
      { $set: { isClosed: false } },
    );
    res.status(200).json('모집 활성화 완료');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error' });
  }
};

const modifyStudyInfo = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    await client.connect();
    const studyDB = client.db('dev-city').collection('study');
    const userDB = client.db('dev-city').collection('user');

    const findStudy = await studyDB.findOne({ _id: new ObjectId(id) });
    const user = await userDB.findOne({ userId });

    console.log(user.joinedStudy);
    const updateModifyData = {
      studyName: req.body.modifyData.studyName,
      studyIntro: req.body.modifyData.studyIntro,
      studySystem: req.body.modifyData.studySystem,
      field: req.body.modifyData.field,
      skills: req.body.modifyData.skills,
      etc: req.body.modifyData.etc,
      modified: true,
    };

    await studyDB.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateModifyData },
      { returnOriginal: false },
    );

    const updateUserData = {
      joinedStudy: user.joinedStudy.map((study) => {
        if (study.studyName === findStudy.studyName) {
          return {
            ...study,
            studyName: updateModifyData.studyName,
            field: updateModifyData.field,
            skills: updateModifyData.skills,
          };
        }
        return study;
      }),
    };

    await userDB.findOneAndUpdate(
      { userId },
      { $set: updateUserData },
      { returnOriginal: false },
    );

    res.status(200).json('스터디 수정이 완료되었습니다.');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '스터디 수정 에러' });
  }
};

const { SERVICE_ID, API_ACCESS_KEY, API_SECRET_KEY } = process.env;
const space = ' ';
const newLine = '\n';
const method = 'POST';
const url2 = `/sms/v2/services/${SERVICE_ID}/messages`;
const TIMESTAMP = (Date.now() + 1000 * 60).toString();

const sendSms = async (req, res) => {
  console.log(
    'req.body.phone??????????',
    req.body.phone,
    req.body.studyName,
    TIMESTAMP,
  );
  try {
    const hmac = CryptoJS.algo.HMAC.create(
      CryptoJS.algo.SHA256,
      API_SECRET_KEY,
    );
    hmac.update(method);
    hmac.update(space);
    hmac.update(url2);
    hmac.update(newLine);
    hmac.update(TIMESTAMP);
    hmac.update(newLine);
    hmac.update(API_ACCESS_KEY);
    const hash = hmac.finalize();
    const API_GATEWAY_SIGNATURE = hash.toString(CryptoJS.enc.Base64);

    const url = `https://sens.apigw.ntruss.com/sms/v2/services/${SERVICE_ID}/messages`;
    axios({
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-ncp-apigw-timestamp': TIMESTAMP,
        'x-ncp-iam-access-key': `${API_ACCESS_KEY}`,
        'x-ncp-apigw-signature-v2': `${API_GATEWAY_SIGNATURE}`,
      },
      data: {
        type: 'SMS',
        countryCode: '82',
        from: '01035414199',
        content: `[Dev-City] "${req.body.studyName}"에 새로운 참가신청이 도착했습니다`,
        messages: [
          {
            to: `${req.body.phone}`,
          },
        ],
      },
    })
      .then((result) => {
        console.log('200');
        console.log(result);
      })
      .catch((err) => {
        console.log('400');
        console.log(err.response.data);
      });
    res.status(200).json('전송완료');
  } catch (err) {
    console.error(`실패하였습니다. ${err.data}`);
  }
};

module.exports = {
  postStudyInfo,
  getStudyInfo,
  getStudyDetail,
  updateStudyInfo,
  pushLikedStudy,
  deleteStudyInfo,
  leaveStudy,
  closeStudy,
  openStudy,
  modifyStudyInfo,
  sendSms,
};
