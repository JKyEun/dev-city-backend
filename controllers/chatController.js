const client = require('./mongoConnect');

const getChatLog = async (req, res) => {
  const { id } = req.params;
  try {
    await client.connect();
    const chatDB = client.db('dev-city').collection('chat');
    const chat = await chatDB.findOne({ roomId: id });

    if (!chat) {
      const newChat = await chatDB.insertOne({ roomId: id, chatLog: [] });
      return res.status(201).json(newChat);
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).send('500번 에러입니다.');
  }
};

const pushChatLog = async (req, res) => {
  const { id } = req.params;
  try {
    await client.connect();
    const chatDB = client.db('dev-city').collection('chat');
    await chatDB.updateOne(
      { roomId: id },
      { $push: { chatLog: req.body } },
      (updateErr, updateResult) => {
        if (updateErr) throw updateErr;
        console.log(updateResult);
      },
    );

    res.status(201).send('업데이트 성공');
  } catch (err) {
    console.error(err);
    res.status(500).send('500번 에러입니다.');
  }
};

module.exports = { getChatLog, pushChatLog };
