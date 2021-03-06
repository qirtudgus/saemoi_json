const express = require('express');
const router = express.Router();
const db = require('../db_config');

//댓글 불러오기 1.게시물index
router.post('/comment', (req, res) => {
  const index = req.body.index;
  console.log(index);
  const findQuery = 'SELECT * FROM comment_table WHERE board_index = (?)';

  // join문 id값으로 댓글데이터와 프로필주소 불러오기
  const joinCommentQuery =
    'SELECT board_index, comment_index, comment_date, comment_writer,  comment_content, profile FROM comment_table LEFT JOIN users ON comment_table.comment_writer = users.id WHERE board_index = (?)';

  db.query(joinCommentQuery, [index], function (err, rows, fields) {
    // console.log('조인쿼리 결과');
    // console.log(rows);
    res.send(rows);
  });

  // db.query(findQuery, [index], function (err, rows, fields) {
  //   // console.log(rows);
  //   res.send(rows);
  // });
});

//댓글 작성하기 1.게시물index 2.날짜 3.작성자 4.내용
router.post('/addComment', (req, res) => {
  const board_index = req.body.key;
  const id = req.body.id;
  const date = req.body.date;
  const content = req.body.content;

  const countQuery =
    'UPDATE board_table SET board_commentCount = board_commentCount + 1 WHERE board_index = ?';
  const insertQuery =
    'INSERT INTO comment_table (board_index,comment_content,comment_date,comment_writer) VALUES  ( ?,?,?,?)';
  db.query(insertQuery, [board_index, content, date, id]);
  db.query(countQuery, [board_index]);

  res.send('');
});

//댓글 삭제
router.post('/removeComment', (req, res) => {
  const { comment_index, board_index } = req.body;
  const removeQuery = 'DELETE FROM comment_table WHERE comment_index = ?';
  const unCountQuery =
    'UPDATE board_table SET board_commentCount = board_commentCount - 1 WHERE board_index = ?';
  db.query(removeQuery, [comment_index]);
  db.query(unCountQuery, [board_index]);
  res.send('댓글 삭제');
});

//추천한 유저인지 확인 후 boolean 값 반환해주기 로직짜기
// 들어간 게시물 인덱스의 userList 불러오고, id랑 비교했을 때 있으면 true를 줘서 state에 true설정해주기
// 게시물에서 새로고침 시 아이디값을 바로 가져오지못하여 오류가 난다..해결방법을 생각해보자
router.post('/checkLikeUser', (req, res) => {
  const id = req.body.id;
  const index = req.body.index;
  // console.log(index);
  // console.log(id);
  //들어온 게시물의 데이터를 불러온다.
  const findQuery =
    'SELECT board_listList FROM board_table WHERE board_index = ?';

  db.query(findQuery, [index], function (err, rows, fields) {
    // console.log(rows);
  });

  res.send('good');
});

//글 작성하기
router.post('/write', (req, res) => {
  const token = req.authorization;
  const { board_title, board_content, board_writer, board_date } = req.body;

  const writeQuery =
    'INSERT INTO board_table (board_title,board_content,board_writer, board_date) VALUES (?,?,?,?)';

  db.query(writeQuery, [board_title, board_content, board_writer, board_date]);
  res.send('글 작성 통신');
});

//글 수정하기
router.post('/updatewrite', (req, res) => {
  const { board_title, board_content, board_writer, board_index } = req.body;

  // console.log(board_title, board_content, board_writer);

  // 'update board_table set board_views = board_views + 1 where board_index = (?)'; //https://blog.serpongs.net/24

  const writeQuery =
    'UPDATE board_table SET board_title = ?, board_content = ?, board_writer = ? WHERE board_index = ?';

  db.query(
    writeQuery,
    [board_title, board_content, board_writer, board_index],
    function (err) {
      console.log(err);
    },
  );

  res.send('글 수정 통신');
});

//글 삭제하기
router.post('/removeBoard', (req, res) => {
  const index = req.body.key;
  const removeQuery = 'DELETE FROM board_table WHERE board_index = ?';
  db.query(removeQuery, [index]);

  res.send('글삭제');
});

//게시판리스트 뿌려주기
router.post('/getBoard', (req, res) => {
  const sqlQuery = 'SELECT * FROM board_table;';

  // 이상한 5개가 조인됨...차이를 알아보자
  const joinQuery =
    'SELECT * FROM users LEFT OUTER JOIN board_table ON users.id = board_table.board_writer;';

  // 게시판은 조인이되지만 계정 password, salt까지 불러와진다..해결하자
  const joinQuery2 =
    'SELECT * FROM board_table LEFT OUTER JOIN users ON board_table.board_writer = users.id;';

  // 필요한 컬럼만 선택해서 조회 후 보내준다. (아직까진 제일 적절하다.)
  const joinQuery3 =
    'SELECT board_index, board_title, board_content, board_writer, profile, board_views, board_commentCount, board_like, board_date, board_likeList FROM board_table LEFT OUTER JOIN users ON board_table.board_writer = users.id;';

  db.query(sqlQuery, (err, result) => {
    // res.send(result);
  });
  db.query(joinQuery3, (err, result) => {
    res.send(result);
  });
});

//게시물 확인
router.post('/viewBoard', (req, res) => {
  //게시물의 번호를 받아온다.
  const num = req.body.key;
  // console.log(num);
  const board_profile = {};
  //받아온 번호의 작성자를 받아온다.
  const writerQuery =
    'SELECT board_writer FROM board_table WHERE board_index = ?';

  //작성자의 프로필을 받아온다.
  const profileQuery = 'SELECT profile FROM users WHERE id = ?';

  db.query(writerQuery, [num], function (err, rows) {
    const writer = rows[0].board_writer;
    // console.log(writer);
    // 작성자를 이용해 프로필을 받아온다.
    db.query(profileQuery, [writer], function (err, rows) {
      // console.log(rows);
      // console.log(rows[0]);

      board_profile.profile = rows[0].profile || null;
      // console.log(board_profile);

      //프로필주소와 보드내용이 들어있는것을 응답해준다.
      res.send(board_profile);
    });
  });

  const sqlQuery = 'SELECT * FROM board_table WHERE board_index = ?;';
  db.query(sqlQuery, [num], (err, result, fields) => {
    // console.log(result);
    board_profile.result = result;
    // res.send(result);
  });
});

//게시물 조회수
router.post('/views', (req, res) => {
  const num = req.body.index;
  // console.log(num);
  const sqlQuery =
    'update board_table set board_views = board_views + 1 where board_index = (?)'; //https://blog.serpongs.net/24
  db.query(sqlQuery, [num], (err, result, fields) => {
    // console.log(result);
    res.send(result);
  });
});

//게시물 추천(중복 방지)
router.post('/like', (req, res) => {
  const index = req.body.key;
  const id = req.body.id;
  // 먼저 들어온 index번호컬럼에서 추천한 유저의 닉네임이 likelist컬럼에 들어있는지 조회한다.
  const idQuery =
    'SELECT board_index = (?) FROM board_table WHERE board_likeList = (?);';

  //아이디리스트를 값으로 불러올 쿼리문
  const findQuery = 'SELECT * FROM board_table WHERE board_index = ?';

  // idQeury값이 0이라면 추천수 +1 유저값을 추가 해준다.
  const likeQuery =
    'update board_table set board_like = board_like + 1 where board_index = (?)';

  // idQeury값이 0이라면 추천수 +1 유저값을 추가 해준다.
  const unLikeQuery =
    'update board_table set board_like = board_like - 1 where board_index = (?)';

  // 1.따옴표로 감싼 아이디끝에 쉼표로 구분하여 컬럼의 데이터값을 이어붙여준다
  // 2.필드값이 null일 경우에 대비하여 CONCAT_WS 사용 //http://daplus.net/mysql-%ED%95%84%EB%93%9C%EC%97%90-null%EC%9D%B4-%ED%8F%AC%ED%95%A8-%EB%90%9C-%EA%B2%BD%EC%9A%B0-mysql-concat%EB%8A%94-null%EC%9D%84-%EB%B0%98%ED%99%98%ED%95%A9%EB%8B%88%EB%8B%A4/
  const likeUserQuery = `UPDATE board_table SET board_likeList = CONCAT_WS("",board_likeList, ''?',') WHERE board_index =(?)`; //https://kkkapuq.tistory.com/52

  // 추천취소 로직
  // 리스트를 불러오고, 아이디를 정규표현식으로 제거 후 다시 db에 넣어준다.
  const unLikeUserQuery = `UPDATE board_table SET board_likeList = (?) WHERE board_index =(?)`; //https://kkkapuq.tistory.com/52

  // 해당 index컬럼의 likeList를 조회하기 위함이다.
  db.query(findQuery, [index], function (err, rows, fields) {
    // console.log(rows);
    //문자열을 전부 가져온다.
    let list = rows[0].board_likeList;

    // console.log(`유저리스트 ${list}`);
    // http://daplus.net/javascript-javascript-regex-%EC%A0%95%EA%B7%9C%EC%8B%9D-%EC%95%88%EC%97%90-%EB%B3%80%EC%88%98%EB%A5%BC-%EB%84%A3%EB%8A%94-%EB%B0%A9%EB%B2%95/
    // 변수를 넣은 정규표현식으로, 뽑아온 유저리스트에 추천한 아이디가 있는지 찾는다.
    function reg(userId, flags) {
      return new RegExp(`'${userId}',`, flags);
    }

    if (reg(id, 'g').test(list)) {
      console.log('이미 추천한 유저입니다.');
      let del = list.replace(reg(id), '');
      db.query(unLikeQuery, [index]);
      db.query(unLikeUserQuery, [del, index]);

      res.send(false);
    } else {
      console.log('추천하지않은 유저입니다.');
      db.query(likeQuery, [index], function (err, rows, fields) {
        // console.log(rows);
      });
      db.query(likeUserQuery, [id, index]);
      res.send(true);
    }
  });

  //   console.log(req.body);
});

router.post('/checkLikeUser2', (req, res) => {
  console.log('=========================');
  console.log(req.body);
  const { key } = req.body;

  const listQuery =
    'SELECT board_likeList FROM board_table WHERE board_index = ?';
  db.query(listQuery, [key], function (err, result) {
    console.log(result[0].board_likeList);
    let likeUserList = result[0].board_likeList;
    res.send(likeUserList);
  });
});

module.exports = router;
