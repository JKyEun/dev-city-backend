const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const client = require('./mongoConnect');

const signUp = async (req, res) => {
  try {
    const { userId } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await client.connect();
    const userDB = client.db('dev-city').collection('user');
    const user = await userDB.findOne({ userId });
    if (user) {
      return res.status(409).send('이미 존재하는 유저입니다.');
    }

    await userDB.insertOne({
      userId,
      password: hashedPassword,
      nickName: '닉네임을 설정하세요',
      level: 1,
      profileImg: '',
      githubAddress: '깃허브 주소를 설정하세요',
      email: '이메일을 설정하세요',
      todoList: [],
      field: '관심 분야를 설정하세요',
      userName: '이름을 입력하세요',
    });

    res.status(201).send('회원가입 성공');
  } catch (err) {
    console.error(err);
    res.status(500).send('회원가입 에러');
  }
};

const signIn = async (req, res) => {
  try {
    const { userId, password } = req.body;

    await client.connect();
    const userDB = client.db('dev-city').collection('user');
    const user = await userDB.findOne({ userId });
    if (!user) {
      return res.status(401).send('아이디가 잘못되었습니다.');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).send('비밀번호가 잘못되었습니다.');
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send('로그인 에러');
  }
};

module.exports = { signUp, signIn };
