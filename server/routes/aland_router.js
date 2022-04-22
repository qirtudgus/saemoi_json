const db = require('../db_config');
const express = require('express');
const router = express.Router();

// 에이랜드 api 수정!!!!!!!!!!!!
// 에이랜드 테이블 api에 뿌려주기
router.get('/', (req, res) => {
  const sqlQuery = 'SELECT * FROM aland_table;';
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

//에이랜드 종료된 이벤트 테이블에서 삭제하기
router.post('/end', (req, res) => {
  req.body.map((i) => {
    const idx = i.idx;
    const sqlQuery = 'DELETE FROM aland_table WHERE (`idx` = ?);';
    db.query(sqlQuery, [idx], (err, result) => {
      console.log(err);
    });
  });
});

//에이랜드 조회수
router.post('/views', function (req, res) {
  // console.log(req.body);
  const idx = req.body.idx;
  const sqlQuery = 'update aland_table set view = view + 1 where idx = (?)'; //https://blog.serpongs.net/24
  db.query(sqlQuery, [idx], (err, result) => {
    console.log(err);
  });
  res.send('succ');
});

//에이랜드 댓글 가져오기
router.get('/comment', function (req, res) {
  const sqlQuery = 'SELECT * FROM aland_comment;';
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

//에이랜드 댓글 api 전송하기
router.post('/comment/post', function (req, res) {
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
router.post('/get', function (req, res) {
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

//에이랜드 종료된 이벤트 테이블에서 삭제하기
router.post('/end', (req, res) => {
  req.body.map((i) => {
    const idx = i.idx;
    const sqlQuery = 'DELETE FROM aland_table WHERE (`idx` = ?);';
    db.query(sqlQuery, [idx], (err, result) => {
      console.log(err);
    });
  });
});

//에이랜드 댓글 비밀번호 비교용 get api
router.get('/comment_password_check_aland', (req, res) => {
  const idx = req.body.idx;
  const password = req.body.hash;
  const sqlQuery = 'SELECT * FROM aland_comment;';
  db.query(sqlQuery, [idx, password], (err, result) => {
    res.send(result);
  });
});

module.exports = router;
