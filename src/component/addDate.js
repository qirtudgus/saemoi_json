export const addDate = () => {
  let hours = new Date().getHours();
  hours = hours >= 10 ? hours : '0' + hours;

  let minute = new Date().getMinutes();
  minute = minute >= 10 ? minute : '0' + minute;

  let time = hours + ':' + minute;

  let day = new Date().getDate();
  day = day >= 10 ? day : '0' + day;

  let month = new Date().getMonth() + 1;
  month = month >= 10 ? month : '0' + month;

  let today = month + '.' + day;
  let submitDate = today + ' ' + time;
  return submitDate;
};
