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
