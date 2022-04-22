const db = require('../db_config');
const express = require('express');
const router = express.Router();

//올리브영 받은 배열을 마이쿼리 테이블에 전송
router.post('/get', function (req, res) {
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
router.get('/', (req, res) => {
  const sqlQuery = 'SELECT * FROM oliveyoung_table;';
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

//올리브영 종료된 이벤트 테이블에서 삭제하기
router.post('/end', (req, res) => {
  req.body.map((i) => {
    const idx = i.idx;
    const sqlQuery = 'DELETE FROM oliveyoung_table WHERE (`idx` = ?);';
    db.query(sqlQuery, [idx], (err, result) => {
      console.log(err);
    });
  });
});

//올리브영 조회수
router.post('/views', function (req, res) {
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
router.get('/comment', function (req, res) {
  const sqlQuery = 'SELECT * FROM oliveyoung_comment;';
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

//올리브영 댓글 api 전송하기
router.post('/comment/post', function (req, res) {
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
router.post('/get', function (req, res) {
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
router.get('', (req, res) => {
  const sqlQuery = 'SELECT * FROM oliveyoung_table;';
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

//올리브영 종료된 이벤트 테이블에서 삭제하기
router.post('/end', (req, res) => {
  req.body.map((i) => {
    const idx = i.idx;
    const sqlQuery = 'DELETE FROM oliveyoung_table WHERE (`idx` = ?);';
    db.query(sqlQuery, [idx], (err, result) => {
      console.log(err);
    });
  });
});

//올리브영 댓글 비밀번호 비교용 get api
router.get('/comment_password_check_oliveyoung', (req, res) => {
  const idx = req.body.idx;
  const password = req.body.hash;
  const sqlQuery = 'SELECT * FROM oliveyoung_comment;';
  db.query(sqlQuery, [idx, password], (err, result) => {
    res.send(result);
  });
});

module.exports = router;
