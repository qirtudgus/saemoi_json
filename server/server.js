require('dotenv').config({ path: '../.env' });
const db = require('./db_config');
const express = require('express');
const app = express();
const PORT = process.env.SERVER_port || 3001;
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const SECRET_TOKEN = process.env.SECRET_TOKEN;
const jwt = require('jsonwebtoken');
const { default: jwtDecode } = require('jwt-decode');
const tokenCheck = require('./routes/tokenCheck');

const myLogger = function (req, res, next) {
  console.log('log');
  req.userId = 'id입니다';
  next();
};

db.connect((err) => {
  if (err) console.log('MySQL 연결 실패 : ', err);
  console.log('MySQL Connected!!!');
}); // 오류해결 https://www.inflearn.com/questions/3637

app.use(
  cors({
    credentials: true,
  }),
);
app.use(express.json());
app.use(myLogger);
app.use(tokenCheck);
//머스트잇 router
const mustit = require('./routes/mustit_router');
app.use('/api/mustitApiData', mustit);

//올리브영 router
const oliveyoung = require('./routes/oliveyoung_router');
app.use('/api/oliveyoungApiData', oliveyoung);

//에이랜드 router
const aland = require('./routes/aland_router');
app.use('/api/alandApiData', aland);

//로그인 인증 router
const auth = require('./routes/auth_router');
const { find } = require('domutils');
app.use('/api/authApiData', auth);

//게시판 router
const board = require('./routes/board_router');
app.use('/api/boardApiData', board);

//공통api 댓글 비밀번호와 브랜드명 확인 후 삭제진행
app.post('/api/comment_password_check', (req, res) => {
  const idx = req.body.idx;
  const password = req.body.hash;
  const brandName = req.body.brandName;
  const sqlQuery = `DELETE FROM ${brandName}_comment WHERE (idx = ?) AND (password = ?)`;
  db.query(sqlQuery, [idx, password], (err, result) => {
    console.log(result);
  });
});

app.post('/api/middlewere', (req, res) => {
  // console.log(`${req.headers.authorization}`);
  console.log(req.authorization);
  // console.log(req.userId);

  res.send(req.authorization);
});

app.post('/tokenCheck', (req, res) => {
  res.send(req.authorization);
});

app.listen(PORT, () => {
  console.log(`${PORT}열림`);
});
