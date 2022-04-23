import axios from 'axios';
import cheerio from 'cheerio';
import Recat, { useState, useEffect } from 'react';
import eventForm from './eventForm';
import loading from './loading';

const LotteOn = () => {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(false);
  const brandName = 'lotteon';
  const getEventListApi = 'https://sungtt.com/api/lotteonApiData';
  const getViews = 'https://sungtt.com/api/lotteonApiData/views';

  //롯데온에서 이벤트정보 받아와 배열생성하기
  const getApi = axios
    .get('https://www.h-point.co.kr/benefit/evntList.nhd')
    .then((res) => {
      console.log(res.data);
    });

  return (
    <>
      <div>zz</div>
    </>
  );
};
export default LotteOn;
