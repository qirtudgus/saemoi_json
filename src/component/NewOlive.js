import React, { useState, useEffect, useContext } from 'react';
import Comment from './comment';
import EventForm from './eventForm';
import Axios from 'axios';
import cheerio from 'cheerio';
import Loading from './loading';
import { UserInfo } from '../App';
import axios from 'axios';
import NewEventForm from './NewEventForm';
import Footer from './footer';

const NewOlive = () => {
  const { URL } = useContext(UserInfo);
  const [eventData, setEventData] = useState([]);
  const [ing, setIng] = useState();

  console.log('렌더링 횟수 테스트');

  //조회수 증가시키는 API
  const viewApi = `${URL}/newolive/views`;
  //조회수 증가 후 리렌더링을 위한 DB APi
  const getApi = `${URL}/dbolive`;

  //DB에 들어있는 올리브영 데이터를 가져오는 것
  async function getOliveDB() {
    return await axios.post(`${URL}/dbolive`).then((res) => {
      return res.data;
    });
  }

  //현재 올리브영이 진행하고있는 데이터를 가져오는 것.
  async function getOliveHTML() {
    return await axios
      .post(`${URL}/newolive`, {
        url: 'https://www.oliveyoung.co.kr/store/main/getEventList.do',
      })
      .then((res) => {
        return res.data;
      });
  }

  async function addOliveDB(arr) {
    return await axios.post(`${URL}/newolive/add`, arr);
  }
  async function removeOliveDB(arr) {
    return await axios.post(`${URL}/newolive/remove`, arr);
  }

  useEffect(() => {
    axios.all([getOliveDB(), getOliveHTML()]).then(
      axios.spread((dbdata, newdata) => {
        // console.log(dbdata);
        // console.log(newdata);
        console.log(dbdata.length); // db데이터 길이
        console.log(newdata.length); // new데이터 길이

        const dbTitle = dbdata.map((i) => i.event_title); // db데이터 타이틀
        const newTitle = newdata.map((i) => i.event_title); // new데이터 타이틀

        // db에만 있는 제목값을 출력해줌 => 삭제 , 이 값의 길이가 1 이상이면 삭제할 이벤트가 있다는 뜻.
        const pareTitle = dbTitle.filter((i) => !newTitle.includes(i));

        // db에는 없는 제목값을 출력해줌 => 추가, 이 값의 길이가 0이면 추가할 이벤트는 없다는 뜻.
        const pareTitle2 = newTitle.filter((i) => !dbTitle.includes(i));

        // db에는 없는 이벤트를 출력해줌 => api통신으로 올리브영DB에 저장해야함
        // 배열째로 보내서 서버에서 map과 쿼리문을 사용하여 한번에 추가하자.
        const pareArr = newdata.filter((i) => {
          const title = i.event_title;
          return !dbTitle.includes(title);
        });

        // db에만 있는 이벤트를 출력해줌 => api통신으로 올리브영DB에서 삭제해야함
        // db에서 가져온건 index번호가 있기때문에 index번호를 보내준다.
        const pareArr2 = dbdata.filter((i) => {
          const title = i.event_title;
          return !newTitle.includes(title);
        });

        if (pareTitle2.length === 0) {
          console.log('이벤트가 최신입니다.');
        } else {
          console.log('새로운 이벤트가 있군요..');
        }

        if (pareTitle.length >= 1) {
          console.log('종료된 이벤트가 있군요..');
        } else {
          console.log('종료된 이벤트는 없습니다.');
        }

        //마지막으로 이벤트 삭제와 추가를 한번씩 호출하고, 최신값이 들어있는 DB를 호출하여
        //최신값을 유지합니다.
        axios
          .all([addOliveDB(pareArr), removeOliveDB(pareArr2)])
          .then((res) => {
            getOliveDB().then((res) => {
              console.log(res);
              setEventData([...res]);
              setIng(res.length);
            });
          });
      }),
    );
  }, []);

  return (
    <>
      <p>현재 진행중인 이벤트 {ing}개!</p>
      <NewEventForm
        Data={eventData}
        setData={setEventData}
        viewApi={viewApi}
        getApi={getApi}
      />
      <Footer />
    </>
  );
};
export default React.memo(NewOlive);
