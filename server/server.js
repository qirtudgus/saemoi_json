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

//즐겨찾기 api 생성
app.post('/api/favorites/addfavorites', (req, res) => {
  console.log(req.body);
  const { id, favoritesName } = req.body;
  let favoritesList = [];
  let userFavoritesList;
  let userFavoritesListFinal;

  const listQuery = 'SELECT favorites FROM users WHERE id = ?';

  // 먼저 들어온 id컬럼에서 이벤트명이 favorites컬럼에 들어있는지 조회한다.
  const idQuery = 'SELECT id = ? FROM users WHERE favorites = ?;';

  // 1.따옴표로 감싼 아이디끝에 쉼표로 구분하여 컬럼의 데이터값을 이어붙여준다
  // 2.필드값이 null일 경우에 대비하여 CONCAT_WS 사용 //http://daplus.net/mysql-%ED%95%84%EB%93%9C%EC%97%90-null%EC%9D%B4-%ED%8F%AC%ED%95%A8-%EB%90%9C-%EA%B2%BD%EC%9A%B0-mysql-concat%EB%8A%94-null%EC%9D%84-%EB%B0%98%ED%99%98%ED%95%A9%EB%8B%88%EB%8B%A4/
  const favoriteAddQuery = `UPDATE users SET favorites = CONCAT_WS("",favorites, ''?',') WHERE id =(?)`; //https://kkkapuq.tistory.com/52

  // 추천취소 로직
  // 리스트를 불러오고, 아이디를 정규표현식으로 제거 후 다시 db에 넣어준다.
  const favoriteRemoveQuery = `UPDATE users SET favorites = (?) WHERE id =(?)`; //https://kkkapuq.tistory.com/52

  const queryName = `'${favoritesName}',`;
  // console.log(queryName);

  function reg(userId, flags) {
    return new RegExp(`'${userId}',`, flags);
  }

  db.query(listQuery, [id], function (err, result) {
    favoritesList = [...result];

    userFavoritesList = favoritesList[0].favorites;
  });

  db.query(idQuery, [id, queryName], function (err, result) {
    // favoritesList.result = result[0];

    if (reg(favoritesName, 'g').test(favoritesList[0].favorites)) {
      console.log('추가되있으니 삭제하시는걸로 합니다.');
      userFavoritesListFinal = userFavoritesList.replace(queryName, '');
      db.query(favoriteRemoveQuery, [userFavoritesListFinal, id]);

      db.query(listQuery, [id], function (err, result) {
        console.log('추가할 리스트');

        res.send(result[0].favorites);
      });
    } else {
      console.log('없는값이니 추가하겠습니다.');
      db.query(favoriteAddQuery, [favoritesName, id]);

      db.query(listQuery, [id], function (err, result) {
        console.log('추가할 리스트');
        res.send(result[0].favorites);
      });
    }
  });
});

//즐겨찾기 token생성용 api
app.post('/api/favorites/favoritesData', (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  const listQuery = 'SELECT favorites FROM users WHERE id = ?';
  db.query(listQuery, [id], function (err, result) {
    console.log('리스트쿼리');
    console.log(result);
    console.log('유저 즐겨찾기값 텍스트');
    res.send(result);
  });
});

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
    'https://saemoi2.s3.amazonaws.com',
    'https://saemoi2.s3.ap-northeast-2.amazonaws.com',
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
app.post('/api/newolive', (req, res) => {
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
    res.send(eventList);
  }

  newOlive();
});

// 올리브영 DB데이터
app.post('/api/dbolive', (req, res) => {
  const oliveQuery = 'SELECT * FROM newolive_table';
  db.query(oliveQuery, function (err, result) {
    res.send(result);
  });
});

//이벤트 인덱스 번호를 받아와서 DB에서 삭제시키기.
app.post('/api/newolive/remove', (req, res) => {
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
app.post('/api/newolive/add', function (req, res) {
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
app.post('/api/newolive/views', function (req, res) {
  // console.log(req.body);
  const idx = req.body.idx;
  const sqlQuery =
    'UPDATE newolive_table SET event_view = event_view + 1 WHERE event_index = (?)'; //https://blog.serpongs.net/24
  db.query(sqlQuery, [idx], (err, result) => {
    console.log(err);
  });
  res.send('succ');
});

//랭킹닭컴 데이터
app.post('/api/rangkingdak', (req, res) => {
  async function dak() {
    const html = await axios.get(
      'https://www.rankingdak.com/promotion/event/list?nowPageNo=&keywordType=&keyword=&status=200&eventCd=&eventType=',
    );
    let eventList = [];
    let titleList = [];
    let dateList = [];
    let linkList = [];
    let imgList = [];

    const $ = cheerio.load(html.data);

    const title = $('.event-item .txt .tit');
    const date = $('.event-item .txt .date');
    const link = $('.btn-blank');
    const img = $('.event-item .img img');

    title.each(function (i) {
      titleList[i] = {
        event_title: $(this).text(),
      };
    });

    // DB에선 YY.MM.DD- YY.MM.DD의 양식을 유지한다.
    date.each(function (i) {
      dateList[i] = {
        event_date: $(this)
          .text()
          .replace('-\n', '-')
          .replace('\n', '')
          .replace(/ /g, '')
          .substring(2)
          .replace(/-20/g, '- '),
      };
    });

    link.each(function (i) {
      linkList[i] = {
        event_link: `https://www.rankingdak.com/promotion/event/view?nowPageNo=&keywordType=&keyword=&status=200&eventCd=${$(
          this,
        ).attr('id')}&eventType=E07`,
      };
    });

    img.each(function (i) {
      imgList[i] = {
        event_img: $(this).attr('src'),
      };
    });

    // console.log(titleList);
    eventList = titleList.map((item, i) => ({
      ...item,
      ...dateList[i],
      ...imgList[i],
      ...linkList[i],
    }));

    res.send(eventList);
  }
  dak();
});

//랭킹닭컴 DB
app.post('/api/dbrangkingdak', (req, res) => {
  const dakQuery = 'SELECT * FROM rangkingdak_table';
  db.query(dakQuery, function (err, result) {
    res.send(result);
  });
});

//이벤트 인덱스 번호를 받아와서 DB에서 삭제시키기.
app.post('/api/rangkingdak/remove', (req, res) => {
  req.body.map((i) => {
    console.log(i.event_index);
    const idx = i.event_index;
    const sqlQuery = 'DELETE FROM rangkingdak_table WHERE (`event_index` = ?);';
    db.query(sqlQuery, [idx], (err, result) => {
      console.log(err);
    });
  });
  res.send('del');
});

//새로운 이벤트 배열을 DB에 저장
app.post('/api/rangkingdak/add', function (req, res) {
  req.body.map((i) => {
    // console.log(i.link);
    const title = i.event_title;
    const date = i.event_date;
    const img = i.event_img;
    const link = i.event_link;
    const sqlQuery =
      'INSERT INTO rangkingdak_table (event_title,event_date,event_img,event_link) VALUES (?,?,?,?)';
    db.query(sqlQuery, [title, date, img, link], (err, result) => {
      console.log(err);
    });
  });
  res.send('succ');
});

//랭킹닭컴 조회수
app.post('/api/rangkingdak/views', function (req, res) {
  // console.log(req.body);
  const idx = req.body.idx;
  const sqlQuery =
    'UPDATE rangkingdak_table SET event_view = event_view + 1 WHERE event_index = (?)'; //https://blog.serpongs.net/24
  db.query(sqlQuery, [idx], (err, result) => {
    console.log(err);
  });
  res.send('succ');
});

//스타필드 코엑스몰 데이터 안된다..
app.post('/api/starfield', (req, res) => {
  let eventList = [];
  let titleList = [];
  let dateList = [];
  let linkList = [];
  let imgList = [];

  async function ak() {
    const html = await axios.get(
      'https://starfield.ssg.com/event/eventMain.ssg?strId=02',
    );

    const $ = cheerio.load(html.data);
    // console.log(html.data);
    const title = $('.evt_osmu_unit .eo_detail .eo_tit strong');
    const date = $('.evt_osmu_unit .eo_detail .eo_period em');
    const img = $('.evt_osmu_unit .eo_thmb .thmb img');
    const link = $('.evt_osmu_unit .eo_link');
    title.each(function (i) {
      titleList[i] = {
        event_title: $(this).text(),
      };
    });

    // DB에선 YY.MM.DD- YY.MM.DD의 양식을 유지한다.
    // 날짜가 아예 없는 이벤트가 문제라 DB에 이상하게 들어간다. 데이터가 없을시에 대한 예외처리를 해줘야한다.
    date.each(function (i) {
      dateList[i] = {
        event_date: $(this).text().replace(' - 20', '- ').substring(2),
      };
    });

    img.each(function (i) {
      imgList[i] = {
        event_img: $(this).attr('src'),
      };
    });

    link.each(function (i) {
      linkList[i] = {
        event_link: 'https://starfield.ssg.com' + $(this).attr('href'),
      };
    });

    eventList = titleList.map((item, i) => ({
      ...item,
      ...dateList[i],
      ...imgList[i],
      ...linkList[i],
    }));

    //실제 이벤트요소는 n개인데 n*2개가 반환된다.. 배열길이의 절반을 잘라서 저장.
    let eventList2 = eventList.slice(eventList.length / 2);
    res.send(eventList2);
  }
  ak();
});

//스타필드 DB
app.post('/api/dbstarfield', (req, res) => {
  const dakQuery = 'SELECT * FROM starfield_table';
  db.query(dakQuery, function (err, result) {
    res.send(result);
  });
});

//이벤트 인덱스 번호를 받아와서 DB에서 삭제시키기.
app.post('/api/starfield/remove', (req, res) => {
  req.body.map((i) => {
    console.log(i.event_index);
    const idx = i.event_index;
    const sqlQuery = 'DELETE FROM starfield_table WHERE (`event_index` = ?);';
    db.query(sqlQuery, [idx], (err, result) => {
      console.log(err);
    });
  });
  res.send('del');
});

//새로운 이벤트 배열을 DB에 저장
app.post('/api/starfield/add', function (req, res) {
  req.body.map((i) => {
    // console.log(i.link);
    const title = i.event_title;
    const date = i.event_date;
    const img = i.event_img;
    const link = i.event_link;
    const sqlQuery =
      'INSERT INTO starfield_table (event_title,event_date,event_img,event_link) VALUES (?,?,?,?)';
    db.query(sqlQuery, [title, date, img, link], (err, result) => {
      console.log(err);
    });
  });
  res.send('succ');
});

//스타필드 조회수
app.post('/api/starfield/views', function (req, res) {
  // console.log(req.body);
  const idx = req.body.idx;
  const sqlQuery =
    'UPDATE starfield_table SET event_view = event_view + 1 WHERE event_index = (?)'; //https://blog.serpongs.net/24
  db.query(sqlQuery, [idx], (err, result) => {
    console.log(err);
  });
  res.send('succ');
});

app.listen(PORT, () => {
  console.log(`${PORT}열림`);
});
