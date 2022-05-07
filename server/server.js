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

app.use(cors());
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

//프로필 변경api
app.post('/api/authApiData/changeprofile', (req, res) => {
  console.log(req.body);
  const { id, profile } = req.body;
  console.log(profile);
  //s3에서 공백을 +로 치환하기때문에 DB에도 치환하여 저장해준다.
  const removeSpace = profile.replace(' ', '+');
  const userProfile = removeSpace.replace(
    'https://saemoi.s3.amazonaws.com',
    'https://saemoi.s3.ap-northeast-2.amazonaws.com',
  );
  console.log(userProfile);
  const changeQuery = `UPDATE users SET profile = ? WHERE id = ?`;
  db.query(changeQuery, [userProfile, id]);

  //이미지 주소를 응답해준다.
  res.send(userProfile);
});

//마이페이지 프로필주소 api
app.post('/api/authApiData/goProfile', (req, res) => {
  // console.log(req);
  const { id } = req.body;
  console.log('프로필 넘겨줄 아이디');
  console.log(id);
  const profileQuery = 'SELECT profile FROM users WHERE id = ?';
  db.query(profileQuery, [id], function (err, rows) {
    console.log(rows);
    res.send(rows);
  });
});

//렌더링때 마다 호출하여 토큰체크 미들웨어를 실행시키고,
//헤더에 새로운 리프레쉬토큰을 담아서 응답해준다.
app.post('/api/middlewere', (req, res) => {
  // 미들웨어에서 생성한 헤더속 토큰값을 응답해준다.
  res.send(req.authorization);
});

app.post('/tokenCheck', (req, res) => {
  res.send(req.authorization);
});

//새로운 올리브영
app.post('/newolive', (req, res) => {
  console.log(req.body.url);

  const oliveQuery = 'SELECT * FROM newolive_table';

  let eventList = [];

  async function newOlive() {
    const html = await axios.get(`${req.body.url}`);

    let titleList = [];
    let dateList = [];
    let imgList = [];
    let linkList = [];

    const $ = cheerio.load(html.data);
    const title = $('div.event_tab_cont ul.event_thumb_list li p.evt_tit');
    const date = $('div.event_tab_cont ul.event_thumb_list li p.evt_date');
    const img = $('ul.event_thumb_list li a').children('img');
    const link = $('ul.event_thumb_list li input[name=urlInfo]');

    //각각의 배열에 해당 값을 추가한다.
    title.each(function (i) {
      titleList[i] = {
        event_title: $(this).text(),
      };
    });
    date.each(function (i) {
      dateList[i] = {
        event_date: $(this).text(),
      };
    });
    img.each(function (i) {
      imgList[i] = {
        event_img: $(this).attr('data-original'),
      };
    });
    link.each(function (i) {
      linkList[i] = {
        event_link:
          'https://www.oliveyoung.co.kr/store/' + $(this).attr('value'),
      };
    });
    // eventList = titleList
    //   .map((item, i) => ({ ...item, ...dateList[i] }))
    //   .map((item, i) => ({ ...item, ...imgList[i] }))
    //   .map((item, i) => ({ ...item, ...linkList[i] }));

    eventList = titleList.map((item, i) => ({
      ...item,
      ...dateList[i],
      ...imgList[i],
      ...linkList[i],
    }));
    // return eventList;
    //eventList에 최신값이 담겨있다.
    // console.log(eventList);
    res.send(eventList);
  }

  // db.query(oliveQuery, function (err, result) {
  //   dbData = [...result];
  // });

  // newOlive().then((resp) => {
  //   console.log('========DB데이타===========');
  //   // console.log(dbData);
  //   console.log('========새로운 데이타===========');
  //   // console.log(eventList);

  //   console.log(dbData.length); // db데이터 길이
  //   console.log(eventList.length); // new데이터 길이

  //   const dbTitle = dbData.map((i) => i.event_title); // db데이터 타이틀
  //   const newTitle = eventList.map((i) => i.event_title); // new데이터 타이틀

  //   // console.log(dbTitle);
  //   // console.log(newTitle);

  //   const pareTitle = dbTitle.filter((i) => !newTitle.includes(i)); // db에만 있는값을 출력해줌 => 삭제
  //   const pareTitle2 = newTitle.filter((i) => !dbTitle.includes(i)); // db에는 없는값을 출력해줌 => 추가

  //   delCount = pareTitle.length; // 종료된 이벤트 개수

  //   newCount = pareTitle2.length; // 새로 생긴 이벤트 개수

  //   if (pareTitle2.length > 0) {
  //     console.log(`새로 생긴 이벤트 ${newCount}개 있어요`);
  //   }
  //   if (pareTitle.length > 0) {
  //     console.log(`종료된 이벤트 ${delCount}개 있어요`);
  //   }

  //   console.log('========비교값===========');

  // res.send(delCount);
  // console.log(pareTitle); // 비교값
  // console.log(pareTitle2); // 비교값
  // });
  newOlive();
});

app.post('/dbolive', (req, res) => {
  const oliveQuery = 'SELECT * FROM newolive_table';
  db.query(oliveQuery, function (err, result) {
    res.send(result);
  });
});

//이벤트 인덱스 번호를 받아와서 DB에서 삭제시키기.
app.post('/newolive/remove', (req, res) => {
  req.body.map((i) => {
    console.log(i.event_index);
    const idx = i.event_index;
    const sqlQuery = 'DELETE FROM newolive_table WHERE (`event_index` = ?);';
    db.query(sqlQuery, [idx], (err, result) => {
      console.log(err);
    });
  });
  res.send('del');
});

//새로운 이벤트 배열을 DB에 저장
app.post('/newolive/add', function (req, res) {
  req.body.map((i) => {
    // console.log(i.link);
    const title = i.event_title;
    const date = i.event_date;
    const img = i.event_img;
    const link = i.event_link;
    const sqlQuery =
      'INSERT INTO newolive_table (event_title,event_date,event_img,event_link) VALUES (?,?,?,?)';
    db.query(sqlQuery, [title, date, img, link], (err, result) => {
      console.log(err);
    });
  });
  res.send('succ');
});

//올리브영 조회수
app.post('/newolive/views', function (req, res) {
  // console.log(req.body);
  const idx = req.body.idx;
  const sqlQuery =
    'UPDATE newolive_table SET event_view = event_view + 1 WHERE event_index = (?)'; //https://blog.serpongs.net/24
  db.query(sqlQuery, [idx], (err, result) => {
    console.log(err);
  });
  res.send('succ');
});

app.listen(PORT, () => {
  console.log(`${PORT}열림`);
});
