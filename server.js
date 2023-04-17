const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const server = express();
const { PORT } = process.env;
const httpServer = http.createServer(server);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('소켓 연결 성공');

  socket.on('join', (data) => {
    socket.join(data.roomId);
    console.log(`${data.userName}님이 ${data.roomId}방에 참가하였습니다.`);
  });

  socket.on('send_message', (data) => {
    console.log(
      `${data.roomId}방에서 ${data.userName}님이 메시지를 보냈습니다: ${data.message}`,
    );
    socket.to(data.roomId).emit('receive_message', data);
  });
});

server.use(cors());
server.use(express.json({ limit: 5000000 }));
server.use(express.urlencoded({ extended: false }));

const userRouter = require('./routes/user');
const studyRouter = require('./routes/study');
const mainRouter = require('./routes/main');
const boardRouter = require('./routes/board');
const chatRouter = require('./routes/chat');

server.use('/user', userRouter);
server.use('/study', studyRouter);
server.use('/allUser', mainRouter);
server.use('/board', boardRouter);
server.use('/chat', chatRouter);

// eslint-disable-next-line no-unused-vars
server.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode);
  res.send(err.message);
});

httpServer.listen(PORT, () => {
  console.log(`${PORT}번에서 서버가 작동 중입니다!`);
});
