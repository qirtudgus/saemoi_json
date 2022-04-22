const db = require('../db_config');
const express = require('express');
const router = express.Router();

//머스트잇 댓글 가져오기
router.get('/comment', function (req, res) {
  const sqlQuery = 'SELECT * FROM mustit_comment;';
  db.query(sqlQuery, (err, result) => {
    res.send(result);
  });
});

//머스트잇 댓글 api 전송하기
router.post('/comment/post', function (req, res) {
  const date = req.body.submitDate;
  const content = req.body.value;
  const password = req.body.hashPassword;
  // console.log(content);
  // console.log(date);
  const sqlQuery =
    'INSERT INTO mustit_comment ( date, content, password) VALUES (?,?,?)';
  db.query(sqlQuery, [date, content, password], (err, result) => {});
});

//머스트잇 댓글 비밀번호 비교용 get api
router.get('/comment_password_check_mustit', (req, res) => {
  const idx = req.body.idx;
  const password = req.body.hash;
  const sqlQuery = 'SELECT * FROM mustit_comment;';
  db.query(sqlQuery, [idx, password], (err, result) => {
    res.send(result);
  });
});

module.exports = router;
