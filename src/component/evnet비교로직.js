const db_Title = ['첫째', '둘째', '셋째', '넷째', '다섯째', 'haha'];
const new_Title = ['첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째', 'haha'];

const pareTitle = db_Title.filter((i) => !new_Title.includes(i));

console.log(pareTitle);

const tableDataTitle = ['첫째', '둘째', '셋째', '넷째', '다섯째', 'haha'];
const newData = ['첫째', '둘째', '셋째', '넷째', '여섯째'];

const compareNewData = newData.filter((i) => {
  const title = i;
  return !tableDataTitle.includes(title);
});
console.log(compareNewData);

const delData = tableDataTitle.filter((i) => {
  const title = i;
  return !newData.includes(title);
});

console.log(delData);
