require('dotenv').config({ path: '../.env' });
const db = require('./db_config');
const express = require('express');
const app = express();
const PORT = process.env.SERVER_port || 3001;
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { Builder, By, Key, until } = require('selenium-webdriver');

(async function example() {
  let driver = await new Builder().forBrowser('chrome').build();
  let titleList = [];
  try {
    // 네이버 실행
    await driver.get('https://www.h-point.co.kr/benefit/evntList.nhd');

    // Javascript를 실행하여 UserAgent를 확인한다.
    let userAgent = await driver.executeScript('return navigator.userAgent;');

    console.log('[UserAgent]', userAgent);

    // 네이버 검색창의 id는 query이다. By.id로 #query Element를 얻어온다.
    // let searchInput = await driver.findElement(By.id('query'));

    // 검색창에 '회 숙성하는 법'을 치고 엔터키를 누른다.
    // let keyword = '회 숙성하는 법';
    // searchInput.sendKeys(keyword, Key.ENTER);

    // css selector로 가져온 element가 위치할때까지 최대 10초간 기다린다.
    await driver.wait(
      until.elementLocated(
        By.css('.wrap_paging .pagination .page-item .page-link'),
      ),
      10000,
    );

    // total_tit라는 클래스 명을 가진 element들을 받아온다.
    let resultElements = await driver.findElements(By.className('subject'));
    console.log('[resultElements.length]', resultElements.length);

    console.log(typeof resultElements);
    // 검색 결과의 text를 가져와서 콘솔에 출력한다.
    console.log('== Search results ==');
    for (var i = 0; i < resultElements.length; i++) {
      console.log(await resultElements[i].getText());
    }

    // 검색결과의 첫번째 링크를 클릭한다.
    if (resultElements.length > 0) {
      await resultElements[1].click();
    }

    // 4초를 기다린다.
    try {
      await driver.wait(() => {
        return false;
      }, 4000);
    } catch (err) {}
  } finally {
    // 종료한다.
    driver.quit();
  }
})();

db.connect((err) => {
  if (err) console.log('MySQL 연결 실패 : ', err);
  console.log('MySQL Connected!!!');
}); // 오류해결 https://www.inflearn.com/questions/3637

app.use(
  cors({
    credentials: true,
  }),
);
app.use(express.json());

//머스트잇 router
const mustit = require('./routes/mustit_router');
app.use('/api/mustitApiData', mustit);

//올리브영 router
const oliveyoung = require('./routes/oliveyoung_router');
app.use('/api/oliveyoungApiData', oliveyoung);

//에이랜드 router
const aland = require('./routes/aland_router');
app.use('/api/alandApiData', aland);

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

app.listen(PORT, () => {
  console.log(`${PORT}열림`);
});
