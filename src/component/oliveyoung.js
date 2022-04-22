import React, { useState, useEffect } from 'react';
import Comment from './comment';
import EventForm from './eventForm';
import Axios from 'axios';
import cheerio from 'cheerio';
import Loading from './loading';

const Oliveyoung = () => {
  const brandName = 'oliveyoung';
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(false);

  //json데이터를 받아올 api 주소
  const getApi = 'https://sungtt.com/api/oliveyoungApiData';
  //조회수를 전송할 api 주소
  const getView = 'https://sungtt.com/api/oliveyoungApiData/views';

  //테이블에 있는 데이터 가져오기
  function getOliveData() {
    return Axios.get('https://sungtt.com/api/oliveyoungApiData');
  }

  //올리브영의 새로운 배열을 생성하여 리턴
  function getNewOliveData() {
    return Axios.get(
      'https://www.oliveyoung.co.kr/store/main/getEventList.do',
    ).then((html) => {
      let titleList = [];
      let dateList = [];
      let imgList = [];
      let linkList = [];
      let eventList = [];

      const $ = cheerio.load(html.data);
      const title = $('div.event_tab_cont ul.event_thumb_list li p.evt_tit');
      const date = $('div.event_tab_cont ul.event_thumb_list li p.evt_date');
      const img = $('ul.event_thumb_list li a').children('img');
      const link = $('ul.event_thumb_list li input[name=urlInfo]');

      title.each(function (i) {
        titleList[i] = {
          title: $(this).text(),
        };
      });

      date.each(function (i) {
        dateList[i] = {
          date: $(this).text(),
        };
      });

      img.each(function (i) {
        imgList[i] = {
          img: $(this).attr('data-original'),
        };
      });

      link.each(function (i) {
        linkList[i] = {
          link: 'https://www.oliveyoung.co.kr/store/' + $(this).attr('value'),
        };
      });

      eventList = titleList
        .map((item, i) => ({ ...item, ...dateList[i] }))
        .map((item, i) => ({ ...item, ...imgList[i] }))
        .map((item, i) => ({ ...item, ...linkList[i] }));

      // setEventData([...eventList]);
      return eventList;
    });
  }

  useEffect(() => {
    Axios.get('https://sungtt.com/api/oliveyoungApiData').then((res) => {
      setEventData([...res.data]);
    });

    Axios.all([getOliveData(), getNewOliveData()]).then(
      Axios.spread(function (tableData, newData) {
        const tableDataTitle = tableData.data.map((i) => i.title);
        const newDataTitle = newData.map((i) => i.title);
        const pareTitle = tableDataTitle.filter(
          (i) => !newDataTitle.includes(i),
        );

        if (pareTitle.length === 0) {
          // console.log("이벤트가 최신입니다.")
          setEventData([...tableData.data]);
        } else {
          // 새로 받아온 이벤트의 타이틀과 compare2의 차집합 배열
          const compareNewData = newData.filter((i) => {
            const title = i.title;
            return !tableDataTitle.includes(title);
          });
          const NewDataNum = compareNewData.length;

          // 없는 타이틀의 배열을 전송
          Axios.post(
            'https://sungtt.com/api/oliveyoungApiData/get',
            compareNewData,
          );

          // 진행중인 이벤트엔없고, 기존엔 가지고있는 삭제해야할 배열 생성
          const delData = tableData.data.filter((i) => {
            const title = i.title;
            return !newDataTitle.includes(title);
          });

          // 종료된 타이틀의 배열을 전송
          Axios.post('https://sungtt.com/api/oliveyoungApiData/end', delData);

          // 새로운 데이터를 받아와서, 렌더링
          Axios.get('https://sungtt.com/api/oliveyoungApiData').then((res) => {
            setEventData([...res.data]);
            // console.log(`${NewDataNum}개가 갱신되었습니다.`);
          });
        }
        setLoading(true);
      }),
    );
  }, []);

  return (
    <>
      {loading ? (
        <>
          {' '}
          <EventForm
            Data={eventData}
            setData={setEventData}
            getApi={getApi}
            getView={getView}
          />
          <Comment
            brandName={brandName}
            getCommentApi='https://sungtt.com/api/oliveyoungApiData/comment'
            postCommentApi='https://sungtt.com/api/oliveyoungApiData/comment/post'
          />
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default React.memo(Oliveyoung);
