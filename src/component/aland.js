import axios from 'axios';
import Comment from './comment';
import cheerio from 'cheerio';
import React, { useState, useEffect, useContext } from 'react';
import Loading from './loading';
import EventForm from './eventForm';
import { UserInfo } from '../App';

const Aland = () => {
  const { URL } = useContext(UserInfo);
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(false);
  const brandName = 'aland';

  const getApi = `${URL}/api/alandApiData`;
  const getView = `${URL}/api/alandApiData/views`;

  const getCommentApi = `${URL}/api/alandApiData/comment`;
  const postCommentApi = `${URL}/api/alandApiData/comment/post`;

  function getAlandData() {
    return axios.get(getApi);
  }

  async function getNewAlandData() {
    const res = await axios.get(
      'https://www.a-land.co.kr/event/promotion_list.php',
    );
    let titleList = [];
    let dateList = [];
    let imgList = [];
    let linkList = [];
    let eventList = [];
    const $ = cheerio.load(res.data);
    const title = $('.wrap-event-list .ename');
    console.log('title: ', title);
    const date = $('.wrap-event-list .period');
    const img = $('.wrap-event-list .thumb').children('img');
    const link = $('.ajax_hash');
    title.each(function (i) {
      titleList[i] = {
        title: $(this)
          .text()
          .replace(/[\n\t]/g, ''),
      };
    });
    date.each(function (i_1) {
      dateList[i_1] = {
        date: $(this)
          .text()
          .replace(/[/]/g, '.')
          .replace(/ /g, '')
          .substring(2)
          .replaceAll('20', ''),
      };
    });
    img.each(function (i_2) {
      imgList[i_2] = {
        img: 'https://www.a-land.co.kr' + $(this).attr('src'),
      };
    });
    link.each(function (i_3) {
      linkList[i_3] = {
        link: 'https://www.a-land.co.kr' + $(this).attr('href'),
      };
    });
    eventList = titleList
      .map((item, i_4) => ({ ...item, ...dateList[i_4] }))
      .map((item_1, i_5) => ({ ...item_1, ...imgList[i_5] }))
      .map((item_2, i_6) => ({ ...item_2, ...linkList[i_6] }));
    console.log(eventList);
    return eventList;
  }

  useEffect(() => {
    axios.get(`${URL}/api/alandApiData`).then((res) => {
      setEventData([...res.data]);
    });

    axios.all([getAlandData(), getNewAlandData()]).then(
      axios.spread(function (tableData, newData) {
        const tableDataTitle = tableData.data.map((i) => i.title);
        const newDataTitle = newData.map((i) => i.title);
        const pareTitle = tableDataTitle.filter(
          (i) => !newDataTitle.includes(i),
        );

        if (pareTitle.length < 0) {
          console.log('???????????? ???????????????.');
          setEventData([...tableData.data]);
        } else {
          // ?????? ????????? ???????????? ???????????? compare2??? ????????? ??????
          const compareNewData = newData.filter((i) => {
            const title = i.title;
            return !tableDataTitle.includes(title);
          });
          const NewDataNum = compareNewData.length;

          // ?????? ???????????? ????????? ??????
          axios.post(`${URL}/api/alandApiData/get`, compareNewData);

          // ???????????? ??????????????????, ????????? ??????????????? ??????????????? ?????? ??????
          const delData = tableData.data.filter((i) => {
            const title = i.title;
            return !newDataTitle.includes(title);
          });

          // ????????? ???????????? ????????? ??????
          axios.post(`${URL}/api/alandApiData/end`, delData);

          // ????????? ???????????? ????????????, ?????????
          axios.get(`${URL}/api/alandApiData`).then((res) => {
            setEventData([...res.data]);
            // console.log(`${NewDataNum}?????? ?????????????????????.`);
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
            getCommentApi={getCommentApi}
            postCommentApi={postCommentApi}
          />
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};
export default Aland;
