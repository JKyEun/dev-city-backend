const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
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
      field: '관심분야 없음',
      userName: '이름을 입력하세요',
      studyList: [],
      likeStudyList: [],
      follower: [],
      following: [],
    });

    const token = jwt.sign({ userId }, process.env.JWT_SECRET);
    res.status(201).json({ token });
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

const kakaoLogin = async (req, res) => {
  try {
    const { userId } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await client.connect();
    const userDB = client.db('dev-city').collection('user');
    const user = await userDB.findOne({ userId });
    if (user) {
      // 이미 가입했으므로 로그인 처리
      const token = jwt.sign({ userId }, process.env.JWT_SECRET);
      res.status(200).json({ token });
    } else {
      // 카카오 로그인이 처음이므로 회원가입 처리
      await userDB.insertOne({
        userId,
        password: hashedPassword,
        nickName: '닉네임을 설정하세요',
        level: 1,
        profileImg: req.body.profileImg,
        githubAddress: '깃허브 주소를 설정하세요',
        email: '이메일을 설정하세요',
        todoList: [],
        field: '관심분야 없음',
        userName: '이름을 입력하세요',
        studyList: [],
        likeStudyList: [],
        follower: [],
        following: [],
      });

      const token = jwt.sign({ userId }, process.env.JWT_SECRET);
      res.status(201).json({ token });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('회원가입 에러');
  }
};

const githubLoginFetch = async (req, res) => {
  try {
    const ACCESS_TOKEN_URL = `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${req.body.code}`;

    const resCode = await axios.post(ACCESS_TOKEN_URL, {
      Accept: 'application/json',
    });

    console.log(resCode);

    if (resCode.data.indexOf('access_token') === -1)
      return res.status(400).json('토큰 발행 실패');

    console.log('깃헙 엑세스 토큰 전체 String', resCode.data);

    const tokenStr = resCode.data;
    const startIndex = tokenStr.indexOf('n=') + 2;
    const endIndex = tokenStr.indexOf('&scope');
    const accessToken = tokenStr.substring(startIndex, endIndex);
    console.log('깃헙 엑세스 토큰', accessToken);

    const resToken = await axios.get('https://api.github.com/user', {
      headers: {
        authorization: `token ${accessToken}`,
      },
    });

    return res.status(200).json(resToken.data);
  } catch (err) {
    console.error(err);
  }
};

const githubLogin = async (req, res) => {
  try {
    const { userId } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await client.connect();
    const userDB = client.db('dev-city').collection('user');
    const user = await userDB.findOne({ userId });
    if (user) {
      // 이미 가입했으므로 로그인 처리
      const token = jwt.sign({ userId }, process.env.JWT_SECRET);
      res.status(200).json({ token });
    } else {
      // 깃허브 로그인이 처음이므로 회원가입 처리
      await userDB.insertOne({
        userId,
        password: hashedPassword,
        nickName: '닉네임을 설정하세요',
        level: 1,
        profileImg: req.body.profileImg,
        githubAddress: req.body.githubAddress,
        email: req.body.email,
        todoList: [],
        field: '관심분야 없음',
        userName: req.body.userName,
        studyList: [],
        likeStudyList: [],
        follower: [],
        following: [],
      });

      const token = jwt.sign({ userId }, process.env.JWT_SECRET);
      res.status(201).json({ token });
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  signUp,
  signIn,
  kakaoLogin,
  githubLoginFetch,
  githubLogin,
};
