const client = require('./mongoConnect');

const getUserInfo = async (req, res) => {
  try {
    await client.connect();
    const userDB = client.db('dev-city').collection('user');
    const userInfo = await userDB.findOne({ userId: req.params.id });
    if (!userInfo) {
      res.status(404).send('User not found');
      return;
    }
    res.status(200).json(userInfo);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving user');
  }
};

module.exports = getUserInfo;
