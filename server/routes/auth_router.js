const express = require("express");
const router = express.Router();
const db = require("../db_config");
const jwt = require("jsonwebtoken");
const { default: jwtDecode } = require("jwt-decode");
const crypto = require("crypto-js");
const SECRET_TOKEN = process.env.SECRET_TOKEN;

// 토큰 유효성 검사
// router.post('/tokenVerify', (req, res) => {
//   const tokenCheck = async () => {
//     if (req.headers.authorization) {
//       const token = jwtDecode(req.headers.authorization);
//       const accessToken = token.accessToken;
//       const { userId } = token;
//       try {
//         jwt.verify(accessToken, SECRET_TOKEN, (error, decoded) => {
//           if (error) {
//             console.log('만료된 액세스토큰입니다. 토큰을 재발급합니다.');
//             let user = {};
//             const accessToken = jwt.sign({ userId: userId }, SECRET_TOKEN, {
//               expiresIn: '10s',
//             });
//             const refreshToken = jwt.sign(
//               { userId: userId, accessToken },
//               SECRET_TOKEN,
//               { expiresIn: '1d' },
//             );
//             user.refreshToken = refreshToken;
//             user.auth = true;
//             res.send(user);
//           }
//           if (decoded) {
//             console.log('유효한 액세스토큰');
//           }
//         });
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   };
//   tokenCheck();
// });

//라우팅 미들웨어
router.post("/middle", (req, res) => {
  if (req.authorization) {
    res.send(req.authorization);
  }
});

//회원가입
router.post("/join", (req, res) => {
  console.log("회원가입 정상 통신");
  const { id, password } = req.body;
  const salt = crypto.lib.WordArray.random(128 / 8).toString(crypto.enc.Hex);

  const hashPassword = crypto.HmacSHA256(password, salt).toString();
  console.log(`해쉬 완료! ${hashPassword}`);

  const sqlQuery = "INSERT INTO users (id,password,salt) VALUES (?,?,?)";
  db.query(sqlQuery, [id, hashPassword, salt]);
  console.log(`${id}님 회원가입 완료`);
});

//아이디 중복체크
router.post("/idCheck", (req, res) => {
  console.log("아이디 중복확인 정상 통신");
  const id = req.body.id;
  console.log(`받아온 아이디 ${req.body.id}`);

  const idCheck = "SELECT * FROM users WHERE ID = ?"; //  login 테이블에서 WHERE 조건값 찾아서 SELECT한 값 찾아오기

  db.query(idCheck, [id], function (err, rows, fields) {
    console.log(err);
    console.log(rows); //찾은 rows 값 확인
    let checkId = {}; // 클라이언트에게 전달해줄 객체 생성
    checkId.auth = false; // 기본값은 false

    if (rows[0] === undefined) {
      // rows 0인덱스에 아무것도 없으면, 찾은 값이 없다는것이므로 udfined와 동일함 생성가능, true를 전달
      checkId.auth = true;
      res.send(checkId);
    } else if (rows[0]) {
      checkId.auth = false; // row 인덱스값이 들어있으면 중복된 ID가 있다는 것, false를 전달
      res.send(checkId);
    }
  });
});

//로그인
router.post("/login", (req, res) => {
  // console.log(`받아온 정보 계정${req.body.id} 비밀번호${req.body.password}`);
  const { id, password } = req.body;
  const loginQuery = "SELECT * FROM users WHERE ID = ?";

  db.query(loginQuery, [id, password], function (err, rows, fields) {
    let user = {};
    console.log(err);
    user.auth = false;
    // db조회값이 없을 시
    if (rows[0] === undefined) {
      console.log("없는 계정으로 로그인 시도");
      res.send(user);
    }
    // db조회값이 있을 시
    else if (rows[0]) {
      const dbSalt = rows[0].salt;
      const dbPassword = rows[0].password;
      const userHashPassword = crypto.HmacSHA256(password, dbSalt).toString();
      console.log(`db암호 ${dbPassword}`);
      console.log(`유저암호 ${userHashPassword}`);
      if (dbPassword === userHashPassword) {
        console.log("패스워드가 일치합니다.");

        const accessToken = jwt.sign(
          { userId: id, TokenAuth: true },
          SECRET_TOKEN,
          {
            expiresIn: "10s",
          },
        );
        const refreshToken = jwt.sign(
          { userId: id, accessToken: accessToken },
          SECRET_TOKEN,
          { expiresIn: "1d" },
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

//비밀번호 변경
router.post("/passwordChange", (req, res) => {
  const { id, newPassword, newPasswordCheck } = req.body;
  console.log(id);
  console.log(newPassword);
  console.log(newPasswordCheck);
  const salt = crypto.lib.WordArray.random(128 / 8).toString(crypto.enc.Hex);
  const hashPassword = crypto.HmacSHA256(newPassword, salt).toString();

  const sqlQuery = ` UPDATE users SET password = ? , salt = ? WHERE id = ?`;
  db.query(sqlQuery, [hashPassword, salt, id], function (err, rows, fields) {});

  res.send("통신");
});

module.exports = router;
