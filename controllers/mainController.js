const client = require('./mongoConnect'); // 몽고 디비 접속용 모듈 불러오기

const getAllUsers = async (req, res) => {
  try {
    await client.connect();
    const userDB = client.db('dev-city').collection('user');
    const allUsers = await userDB
      .aggregate([{ $sample: { size: 4 } }])
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
