require('dotenv').config({ path: '../.env' });
const db = require('./db_config');
const express = require('express');
const app = express();
const PORT = process.env.SERVER_port || 3001;
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

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
app.use('/api/authApiData', auth);

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

app.listen(PORT, () => {
  console.log(`${PORT}열림`);
});
