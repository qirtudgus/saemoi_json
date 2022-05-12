import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { UserInfo } from '../../App';
import Footer from './../footer';
import Loading from './../loading';
import NewEventForm from './../NewEventForm';
import fav_before from '../../img/fav_ico_before.svg';
import fav_after from '../../img/fav_ico_after.svg';
const RangkingDak = () => {
  const { URL, userAuth, goLogin } = useContext(UserInfo);
  const [eventData, setEventData] = useState([]);
  const [ing, setIng] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [favoritesDecide, setFavoritesDecide] = useState(false);

  const [isFav, setIsFav] = useState(false);

  console.log('렌더링 횟수 테스트');

  //DB에 들어있는 랭킹닭컴 데이터를 가져오는 것
  async function getDakDB() {
    return await axios.post(`${URL}/api/dbrangkingdak`).then((res) => {
      return res.data;
    });
  }

  //조회수 증가시키는 API
  const viewApi = `${URL}/rangkingdak/views`;
  //조회수 증가 후 리렌더링을 위한 DB APi
  const getApi = `${URL}/dbrangkingdak`;

  //현재 올리브영이 진행하고있는 데이터를 가져오는 것.
  async function getDakHTML() {
    return await axios
      .post(`${URL}/api/rangkingdak`, {
        url: 'https://www.rankingdak.com/promotion/event/list?nowPageNo=&keywordType=&keyword=&status=200&eventCd=&eventType=',
      })
      .then((res) => {
        return res.data;
      });
  }

  async function addDakDB(arr) {
    return await axios.post(`${URL}/api/rangkingdak/add`, arr);
  }
  async function removeDakDB(arr) {
    return await axios.post(`${URL}/api/rangkingDak/remove`, arr);
  }

  useEffect(() => {
    axios.all([getDakDB(), getDakHTML()]).then(
      axios.spread((dbdata, newdata) => {
        // console.log(dbdata);
        // console.log(newdata);
        // console.log(dbdata.length); // db데이터 길이
        // console.log(newdata.length); // new데이터 길이

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
        axios.all([addDakDB(pareArr), removeDakDB(pareArr2)]).then((res) => {
          getDakDB().then((res) => {
            setEventData([...res]);
            setIng(res.length);
            setIsLoading(true);
          });
        });
      }),
    );
  }, []);

  //즐겨찾기 버튼
  //여기서 미리 로컬스토리지에 저장한다.
  const addFavorites = () => {
    if (userAuth.auth) {
      axios
        .post(`${URL}/api/favorites/addfavorites`, {
          id: userAuth.id,
          favoritesName: 'rangkingdak',
        })
        .then((res) => {
          console.log(res.data);
          localStorage.setItem('fav', res.data);
        });
      setIsFav(!isFav);
      return;
    }
    if (!userAuth.auth) {
      setFavoritesDecide(true);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('fav')) {
      const favoritesList = localStorage.getItem('fav');
      if (favoritesList.includes('rangkingdak')) {
        setIsFav(true);
      }
    } else {
      return;
    }
  }, []);

  return (
    <>
      {favoritesDecide ? (
        <>
          <div className='decide_wrap'>
            <div className='decide_modal'>
              <p className='decide_title'>회원이신분만 즐겨찾기가 가능해요!</p>
              <button className='decide_change' onClick={goLogin}>
                로그인
              </button>
              <button
                className='decide_cancel'
                onClick={() => {
                  setFavoritesDecide(false);
                }}
              >
                그냥 볼래요
              </button>
            </div>
          </div>
        </>
      ) : null}
      {isLoading ? (
        <>
          <div className='ing_event_box'>
            <p className='ing_event'>현재 진행중인 이벤트 {ing}개!</p>
            <div className='fav_box' onClick={addFavorites}>
              <span className='fav_txt'>즐겨찾기</span>
              <img src={isFav ? fav_after : fav_before} alt='fav'></img>
            </div>
          </div>
          <NewEventForm
            Data={eventData}
            setData={setEventData}
            viewApi={viewApi}
            getApi={getApi}
          />
          <Footer />
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default React.memo(RangkingDak);
