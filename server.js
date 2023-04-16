const express = require('express');
const cors = require('cors');
require('dotenv').config();

const server = express();
const { PORT } = process.env;

server.use(cors());
server.use(express.json({ limit: 5000000 }));
server.use(express.urlencoded({ extended: false }));

server.use(express.static('public'));
server.use('/uploads', express.static('uploads'));

const userRouter = require('./routes/user');
const studyRouter = require('./routes/study');
const mainRouter = require('./routes/main');
const boardRouter = require('./routes/board');
const inviteRouter = require('./routes/invite');

server.use('/user', userRouter);
server.use('/study', studyRouter);
server.use('/allUser', mainRouter);
server.use('/board', boardRouter);
server.use('/invite', inviteRouter);

// eslint-disable-next-line no-unused-vars
server.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode);
  res.send(err.message);
});

server.listen(PORT, () => {
  console.log(`${PORT}번에서 서버가 작동 중입니다!`);
});
