const client = require('./mongoConnect'); // 몽고 디비 접속용 모듈 불러오기

// const getRecentStudies = async (req, res) => {
//   try {
//     await client.connect();
//     const studyDB = client.db('dev-city').collection('study');
//     const studies = await studyDB
//       .find()
//       .sort({ createDate: -1 })
//       .limit(5)
//       .toArray();

//     res.status(200).json(studies);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error retrieving studies');
//   }
// };

const getAllUsers = async (req, res) => {
  const { id } = req.params;
  try {
    await client.connect();
    const userDB = client.db('dev-city').collection('user');
    const allUsers = await userDB
      .aggregate([
        {
          $match: {
            userId: { $ne: id }, // userId가 id가 아닌 document 선택
          },
        },
        { $sample: { size: 4 } }, // 선택된 document 중 랜덤으로 4개 선택
      ])
      .toArray();
    if (!allUsers) {
      res.status(404).send('No users found');
      return;
    }
    res.status(200).json(allUsers);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving users');
  }
};

module.exports = getAllUsers;
