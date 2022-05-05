require("dotenv").config({ path: "../.env" });
const db = require("./db_config");
const express = require("express");
const app = express();
const PORT = process.env.SERVER_port || 3001;
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const SECRET_TOKEN = process.env.SECRET_TOKEN;
const jwt = require("jsonwebtoken");
const { default: jwtDecode } = require("jwt-decode");
const tokenCheck = require("./routes/tokenCheck");

const myLogger = function (req, res, next) {
  console.log("log");
  req.userId = "id입니다";
  next();
};

db.connect((err) => {
  if (err) console.log("MySQL 연결 실패 : ", err);
  console.log("MySQL Connected!!!");
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
const mustit = require("./routes/mustit_router");
app.use("/api/mustitApiData", mustit);

//올리브영 router
const oliveyoung = require("./routes/oliveyoung_router");
app.use("/api/oliveyoungApiData", oliveyoung);

//에이랜드 router
const aland = require("./routes/aland_router");
app.use("/api/alandApiData", aland);

//로그인 인증 router
const auth = require("./routes/auth_router");
const { find } = require("domutils");
app.use("/api/authApiData", auth);

//게시판 router
const board = require("./routes/board_router");
app.use("/api/boardApiData", board);

//공통api 댓글 비밀번호와 브랜드명 확인 후 삭제진행
app.post("/api/comment_password_check", (req, res) => {
  const idx = req.body.idx;
  const password = req.body.hash;
  const brandName = req.body.brandName;
  const sqlQuery = `DELETE FROM ${brandName}_comment WHERE (idx = ?) AND (password = ?)`;
  db.query(sqlQuery, [idx, password], (err, result) => {
    console.log(result);
  });
});

//프로필 변경api
app.post("/api/authApiData/changeprofile", (req, res) => {
  console.log(req.body);
  const { id, profile } = req.body;
  console.log(profile);
  //s3에서 공백을 +로 치환하기때문에 DB에도 치환하여 저장해준다.
  const removeSpace = profile.replace(" ", "+");
  const userProfile = removeSpace.replace(
    "https://saemoi.s3.amazonaws.com",
    "https://saemoi.s3.ap-northeast-2.amazonaws.com",
  );
  console.log(userProfile);
  const changeQuery = `UPDATE users SET profile = ? WHERE id = ?`;
  db.query(changeQuery, [userProfile, id]);

  //이미지 주소를 응답해준다.
  res.send(userProfile);
});

//마이페이지 프로필주소 api
app.post("/getProfile", (req, res) => {
  // console.log(req);
  const { id } = req.body;
  console.log("프로필 넘겨줄 아이디");
  console.log(id);
  const profileQuery = "SELECT profile FROM users WHERE id = ?";
  db.query(profileQuery, [id], function (err, rows) {
    console.log(rows);
    res.send(rows);
  });
});

//렌더링때 마다 호출하여 토큰체크 미들웨어를 실행시키고,
//헤더에 새로운 리프레쉬토큰을 담아서 응답해준다.
app.post("/api/middlewere", (req, res) => {
  // console.log(`${req.headers.authorization}`);
  // console.log(req.authorization);
  // console.log(req.userId);

  // 미들웨어에서 생성한 헤더속 토큰값을 응답해준다.
  res.send(req.authorization);
});

app.post("/tokenCheck", (req, res) => {
  res.send(req.authorization);
});

app.listen(PORT, () => {
  console.log(`${PORT}열림`);
});
