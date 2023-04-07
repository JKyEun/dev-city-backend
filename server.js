const express = require('express');
const cors = require('cors');
require('dotenv').config();

const server = express();
const { PORT } = process.env;

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// eslint-disable-next-line no-unused-vars
server.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.statusCode);
  res.send(err.message);
});

server.listen(PORT, () => {
  console.log(`${PORT}번에서 서버가 작동 중입니다!`);
});
