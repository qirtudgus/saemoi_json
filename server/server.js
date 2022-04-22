require('dotenv').config({ path: '../.env' });
const db = require('./db_config');
const express = require('express');
const app = express();
const PORT = process.env.SERVER_port || 3001;
const cors = require('cors');

db.connect((err) => {
  if (err) console.log('MySQL 연결 실패 : ', err);
  console.log('MySQL Connected!!!');
}); // 오류해결 https://www.inflearn.com/questions/3637

app.use(cors());
app.use(express.json());

//머스트잇 router
const mustit = require('./mustit/mustit_router');
app.use('/api/mustitApiData', mustit);

//올리브영 받은 배열을 마이쿼리 테이블에 전송
app.post('/api/oliveApiData/get', function (req, res) {
  req.body.map((i) => {
    // console.log(i.link);
    const title = i.title;
    const date = i.date;
    const img = i.img;
    const link = i.link;
    const sqlQuery =
      'INSERT INTO oliveyoung_table (title,date,img,link) VALUES (?,?,?,?)';
    db.query(sqlQuery, [title, date, img, link], (err, result) => {
      console.log(err);
    });
  });
  res.send('succ');
});

//올리브영 테이블 api에 뿌려주기
app.get('/api/oliveApiData', (req, res) => {
  const sqlQuery = 'SELECT * FROM oliveyoung_table;';
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

//올리브영 종료된 이벤트 테이블에서 삭제하기
app.post('/api/oliveApiData/end', (req, res) => {
  req.body.map((i) => {
    const idx = i.idx;
    const sqlQuery = 'DELETE FROM oliveyoung_table WHERE (`idx` = ?);';
    db.query(sqlQuery, [idx], (err, result) => {
      console.log(err);
    });
  });
});

//올리브영 조회수
app.post('/api/oliveApiData/views', function (req, res) {
  // console.log(req.body);
  const idx = req.body.idx;
  const sqlQuery =
    'update oliveyoung_table set view = view + 1 where idx = (?)'; //https://blog.serpongs.net/24
  db.query(sqlQuery, [idx], (err, result) => {
    console.log(err);
  });
  res.send('succ');
});

//올리브영 댓글 가져오기
app.get('/api/oliveApiData/comment', function (req, res) {
  const sqlQuery = 'SELECT * FROM oliveyoung_comment;';
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

//올리브영 댓글 api 전송하기
app.post('/api/oliveApiData/comment/post', function (req, res) {
  const content = req.body.value;
  const date = req.body.submitDate;
  const password = req.body.hashPassword;
  // console.log(content);
  // console.log(date);
  const sqlQuery =
    'INSERT INTO oliveyoung_comment ( date, content, password) VALUES (?,?,?)';
  db.query(sqlQuery, [date, content, password], (err, result) => {});
});

//올리브영 받은 배열을 마이쿼리 테이블에 전송
app.post('/api/oliveApiData/get', function (req, res) {
  req.body.map((i) => {
    // console.log(i.link);
    const title = i.title;
    const date = i.date;
    const img = i.img;
    const link = i.link;
    const sqlQuery =
      'INSERT INTO oliveyoung_table (title,date,img,link) VALUES (?,?,?,?)';
    db.query(sqlQuery, [title, date, img, link], (err, result) => {
      console.log(err);
    });
  });
  res.send('succ');
});

//올리브영 테이블 api에 뿌려주기
app.get('/api/oliveApiData', (req, res) => {
  const sqlQuery = 'SELECT * FROM oliveyoung_table;';
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

//올리브영 종료된 이벤트 테이블에서 삭제하기
app.post('/api/oliveApiData/end', (req, res) => {
  req.body.map((i) => {
    const idx = i.idx;
    const sqlQuery = 'DELETE FROM oliveyoung_table WHERE (`idx` = ?);';
    db.query(sqlQuery, [idx], (err, result) => {
      console.log(err);
    });
  });
});

// 에이랜드 api 수정!!!!!!!!!!!!
// 에이랜드 테이블 api에 뿌려주기
app.get('/api/alandApiData', (req, res) => {
  const sqlQuery = 'SELECT * FROM aland_table;';
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

//에이랜드 종료된 이벤트 테이블에서 삭제하기
app.post('/api/alandApiData/end', (req, res) => {
  req.body.map((i) => {
    const idx = i.idx;
    const sqlQuery = 'DELETE FROM aland_table WHERE (`idx` = ?);';
    db.query(sqlQuery, [idx], (err, result) => {
      console.log(err);
    });
  });
});

//에이랜드 조회수
app.post('/api/alandApiData/views', function (req, res) {
  // console.log(req.body);
  const idx = req.body.idx;
  const sqlQuery = 'update aland_table set view = view + 1 where idx = (?)'; //https://blog.serpongs.net/24
  db.query(sqlQuery, [idx], (err, result) => {
    console.log(err);
  });
  res.send('succ');
});

//에이랜드 댓글 가져오기
app.get('/api/alandApiData/comment', function (req, res) {
  const sqlQuery = 'SELECT * FROM aland_comment;';
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

//에이랜드 댓글 api 전송하기
app.post('/api/alandApiData/comment/post', function (req, res) {
  const date = req.body.submitDate;
  const content = req.body.value;
  const password = req.body.hashPassword;
  // console.log(content);
  // console.log(date);
  const sqlQuery =
    'INSERT INTO aland_comment ( date, content, password) VALUES (?,?,?)';
  db.query(sqlQuery, [date, content, password], (err, result) => {});
});

//에이랜드 받은 배열을 마이쿼리 테이블에 전송
app.post('/api/alandApiData/get', function (req, res) {
  req.body.map((i) => {
    // console.log(i.link);
    const title = i.title;
    const date = i.date;
    const img = i.img;
    const link = i.link;
    const sqlQuery =
      'INSERT INTO aland_table (title,date,img,link) VALUES (?,?,?,?)';
    db.query(sqlQuery, [title, date, img, link], (err, result) => {
      console.log(err);
    });
  });
  res.send('succ');
});

//에이랜드 테이블 api에 뿌려주기
app.get('/api/alandApiData', (req, res) => {
  const sqlQuery = 'SELECT * FROM aland_table;';
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

//에이랜드 종료된 이벤트 테이블에서 삭제하기
app.post('/api/alandApiData/end', (req, res) => {
  req.body.map((i) => {
    const idx = i.idx;
    const sqlQuery = 'DELETE FROM aland_table WHERE (`idx` = ?);';
    db.query(sqlQuery, [idx], (err, result) => {
      console.log(err);
    });
  });
});

//통합 댓글 비밀번호와 브랜드명 확인 후 삭제 api
app.post('/api/comment_password_check', (req, res) => {
  const idx = req.body.idx;
  const password = req.body.hash;
  const brandName = req.body.brandName;
  const sqlQuery = `DELETE FROM ${brandName}_comment WHERE (idx = ?) AND (password = ?)`;
  db.query(sqlQuery, [idx, password], (err, result) => {
    console.log(result);
  });
});

//에이랜드 댓글 비밀번호 비교용 get api
app.get('/api/comment_password_check_aland', (req, res) => {
  const idx = req.body.idx;
  const password = req.body.hash;
  const sqlQuery = 'SELECT * FROM aland_comment;';
  db.query(sqlQuery, [idx, password], (err, result) => {
    res.send(result);
  });
});

//올리브영 댓글 비밀번호 비교용 get api
app.get('/api/comment_password_check_oliveyoung', (req, res) => {
  const idx = req.body.idx;
  const password = req.body.hash;
  const sqlQuery = 'SELECT * FROM oliveyoung_comment;';
  db.query(sqlQuery, [idx, password], (err, result) => {
    res.send(result);
  });
});

//머스트잇 댓글 비밀번호 비교용 get api
app.get('/api/comment_password_check_mustit', (req, res) => {
  const idx = req.body.idx;
  const password = req.body.hash;
  const sqlQuery = 'SELECT * FROM mustit_comment;';
  db.query(sqlQuery, [idx, password], (err, result) => {
    res.send(result);
  });
});

app.listen(PORT, () => {
  console.log(`3001 열림`);
});
