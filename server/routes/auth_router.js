const express = require('express');
const router = express.Router();
const db = require('../db_config');
const jwt = require('jsonwebtoken');
const { default: jwtDecode } = require('jwt-decode');
const crypto = require('crypto-js');
const SECRET_TOKEN = process.env.SECRET_TOKEN;
const tokenVerify = require('../../src/component/auth/tokenVerify');

//토큰 유효성 검사
router.post('/tokenVerify', (req, res) => {
  const token = req.headers.authorization;
  const newToken = tokenVerify(token);

  console.log('===server// 3단계 유효성 검사를 하고 받아온 토큰입니다. ===');
  console.log(newToken); // undifined
  // res에 새로 발급한 토큰을 넣어야한다....
  tokenVerify(token).then((token) => {
    console.log(token);
  });
  //   res.send(newToken); // undifined
});

//회원가입
router.post('/join', (req, res) => {
  console.log('회원가입 정상 통신');
  const { id, password } = req.body;
  const salt = crypto.lib.WordArray.random(128 / 8).toString(crypto.enc.Hex);

  const hashPassword = crypto.HmacSHA256(password, salt).toString();
  console.log(`해쉬 완료! ${hashPassword}`);

  const sqlQuery = 'INSERT INTO users (id,password,salt) VALUES (?,?,?)';
  db.query(sqlQuery, [id, hashPassword, salt]);
  console.log(`${id}님 회원가입 완료`);
});

//아이디 중복체크
router.post('/idCheck', (req, res) => {
  console.log('아이디 중복확인 정상 통신');
  const id = req.body.id;
  console.log(`받아온 아이디 ${req.body.id}`);

  const idCheck = 'SELECT * FROM users WHERE ID = ?'; //  login 테이블에서 WHERE 조건값 찾아서 SELECT한 값 찾아오기

  db.query(idCheck, [id], function (err, rows, fields) {
    console.log(rows); //찾은 rows 값 확인
    let checkId = {}; // 클라이언트에게 전달해줄 객체 생성
    checkId.auth = false; // 기본값은 false

    if (rows[0] === undefined) {
      // rows 0인덱스에 아무것도 없으면, 찾은 값이 없다는것이므로 udfined와 동일함 생성가능, true를 전달
      checkId.auth = true;
      res.send(checkId);
    } else {
      checkId.auth = false; // row 인덱스값이 들어있으면 중복된 ID가 있다는 것, false를 전달
      res.send(checkId);
    }
  });
});

//로그인
router.post('/login', (req, res) => {
  console.log(`받아온 정보 계정${req.body.id} 비밀번호${req.body.password}`);
  const { id, password } = req.body;
  const loginQuery = 'SELECT * FROM users WHERE ID = ?';

  db.query(loginQuery, [id, password], function (err, rows, fields) {
    let user = {};
    user.auth = false;
    user.falseMessage = '없는 아이디입니다. 아이디를 확인해 주세요!';
    user.trueMessage = '계정 확인 완료 로그인 성공!';
    if (rows[0] === undefined) {
      console.log('없는 계정으로 로그인 시도');
      res.send(user);
    } else if (rows) {
      const dbSalt = rows[0].salt;
      const dbPassword = rows[0].password;
      const userHashPassword = crypto.HmacSHA256(password, dbSalt).toString();
      console.log(`db암호 ${dbPassword}`);
      console.log(`유저암호 ${userHashPassword}`);
      if (dbPassword === userHashPassword) {
        console.log('패스워드가 일치합니다.');

        const accessToken = jwt.sign(
          { userId: id, TokenAuth: true },
          SECRET_TOKEN,
          {
            expiresIn: '10s',
          },
        );
        const refreshToken = jwt.sign(
          { userId: id, accessToken: accessToken },
          SECRET_TOKEN,
          { expiresIn: '1d' },
        );

        user.auth = true;
        user.refreshToken = refreshToken;

        res.send(user);
      } // 아이디는 있지만 비밀번호가 틀렸을 때
      else if ((dbPassword === userHashPassword) === false) {
        user.auth = false;
        user.authPassword = false;
        res.send(user);
      }
    }
  });
});

module.exports = router;
