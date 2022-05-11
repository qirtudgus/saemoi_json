import React, { useEffect, useState, useContext } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/css/bundle';
import views from '../img/views.png';
import axios from 'axios';
import '../css/favForm.css';
import { UserInfo } from '../App';
import Footer from './footer';
import jwtDecode from 'jwt-decode';
import Favorites_Skeleton from './Favorites_Skeleton';
import Loading from './loading';
const Favorites = () => {
  const { URL, userAuth, setUserProfile } = useContext(UserInfo);
  const today = new Date();
  const [favoritesList, setFavoritesList] = useState({
    olive: false,
    oliveName: '올리브영',
    rangkingdak: false,
    rangkingdakName: '랭킹닭컴',
    starFieldName: '스타필드',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOlive, setIsOlive] = useState(false);
  const [isRangkingDak, setIsRangkingDak] = useState(false);
  const [isStarField, setIsStarField] = useState(false);

  const [skeleton, setSkeleton] = useState([]);

  const getDateDiff = (d1, d2) => {
    if (d2 === null) {
      return '이벤트 종료 시 까지';
    }

    let dateOrigin = '20' + d2.slice(10).replaceAll('.', '-');
    const date1 = new Date(d1);
    const date2 = new Date(dateOrigin);
    const diffDate = date1.getTime() - date2.getTime();
    const date = Math.abs(Math.ceil(diffDate / (1000 * 60 * 60 * 24)));
    //랭킹닭컴은 문자열이 들어가있어서 그에 대한 예외처리

    if (isNaN(date)) {
      return '이벤트 종료 시 까지';
    }
    return date;
  };

  const [favorites2, setFavorites2] = useState([]);
  const [favorites3, setFavorites3] = useState([]);
  const [favorites4, setFavorites4] = useState([]);

  // useEffect(() => {
  //   setFavorites([...getJson]);
  // }, []);

  async function getUserFavoritesList() {
    return await axios
      .post(`${URL}/api/favorites/favoritesData`, {
        id: userAuth.id,
      })
      .then((res) => {
        localStorage.setItem('fav', res.data[0].favorites);
      });
  }

  let RegOlive = /olive/g;
  let RegRangkingDak = /rangkingdak/g;
  let RegStarField = /starfield/g;

  //유저의 즐겨찾기값을 받아와 로컬스토리지에 저장한다.
  useEffect(() => {
    // getUserFavoritesList();
    let storageFavorites = localStorage.getItem('fav');
    if (RegOlive.test(storageFavorites)) {
      console.log('올리브영 즐찾확인');
      setSkeleton([...skeleton, 1]);
      setIsOlive(true);
      axios.post(`${URL}/api/dbolive`).then((res) => {
        setFavorites2([...res.data]);
      });
    }
    if (RegRangkingDak.test(storageFavorites)) {
      console.log('랭킹닭컴 즐찾확인');
      setSkeleton([...skeleton, 2]);
      setIsRangkingDak(true);
      axios.post(`${URL}/api/dbrangkingdak`).then((res) => {
        setFavorites3([...res.data]);
      });
    }
    if (RegStarField.test(storageFavorites)) {
      console.log('스타필드 즐찾확인');
      setSkeleton([...skeleton, 2]);
      setIsStarField(true);
      axios.post(`${URL}/api/dbstarfield`).then((res) => {
        setFavorites4([...res.data]);
      });
    }

    setIsLoading(true);
  }, []);

  //스켈레톤 상태값의 길이가 0이면 스켈레톤 컴포넌트 출력
  if (skeleton.length === 0) return <Favorites_Skeleton />;

  return (
    <>
      <div className='fav_top_div'></div>
      {isLoading ? (
        <>
          {isOlive ? (
            <div className='fav_wrap'>
              <p className='fav_title'>{favoritesList.oliveName}</p>

              <Swiper
                slidesPerView={1}
                centeredSlides={true}
                spaceBetween={30}
                grabCursor={true}
                pagination={{
                  type: 'fraction',
                  clickable: true,
                }}
                modules={[Pagination]}
                breakpoints={{
                  1068: {
                    slidesPerView: 4,
                    centeredSlides: false,
                  },
                  1900: {
                    slidesPerView: 5,
                    centeredSlides: false,
                  },
                }}
                className='mySwiper'
              >
                {favorites2.map((i, index) => (
                  <SwiperSlide>
                    <div className='eventWrap pa_10'>
                      <a
                        rel='noopener noreferrer'
                        target='_blank'
                        id={i.event_index}
                        key={i.event_index}
                        href={i.event_link}
                      >
                        <div className='evtForm_img'>
                          <img src={i.event_img} alt='img'></img>
                        </div>
                        <h1 className='evtForm_title'>{i.event_title}</h1>
                        <div className='evtForm_info'>
                          <p className='d_day'>
                            {' '}
                            {getDateDiff(
                              today,
                              // YYYY-MM-DD 의 양식으로 변경해주어 인자에 전달하고,
                              // DB에선 YY.MM.DD- YY.MM.DD의 양식을 유지한다.
                              // 문자열 가공을 함수로 옮기자..
                              i.event_date,
                            )}
                            일 남음
                          </p>
                          <p className='evtForm_date'>{i.event_date}</p>
                          <p className='evtForm_views'>
                            <img src={views} alt='조회수' />0
                          </p>
                        </div>
                      </a>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : null}

          {isStarField ? (
            <div className='fav_wrap'>
              <p className='fav_title'>{favoritesList.starFieldName}</p>

              <Swiper
                slidesPerView={1}
                centeredSlides={true}
                spaceBetween={30}
                grabCursor={true}
                pagination={{
                  type: 'fraction',
                  clickable: true,
                }}
                modules={[Pagination]}
                breakpoints={{
                  1068: {
                    slidesPerView: 4,
                    centeredSlides: false,
                  },
                  1900: {
                    slidesPerView: 5,
                    centeredSlides: false,
                  },
                }}
                className='mySwiper'
              >
                {favorites4.map((i, index) => (
                  <SwiperSlide>
                    <div className='eventWrap pa_10'>
                      <a
                        rel='noopener noreferrer'
                        target='_blank'
                        id={i.event_index}
                        key={i.event_index}
                        href={i.event_link}
                      >
                        <div className='evtForm_img'>
                          <img src={i.event_img} alt='img'></img>
                        </div>
                        <h1 className='evtForm_title'>{i.event_title}</h1>
                        <div className='evtForm_info'>
                          <p className='d_day'>
                            {' '}
                            {getDateDiff(
                              today,
                              // YYYY-MM-DD 의 양식으로 변경해주어 인자에 전달하고,
                              // DB에선 YY.MM.DD- YY.MM.DD의 양식을 유지한다.
                              // 문자열 가공을 함수로 옮기자..
                              i.event_date,
                            )}
                            일 남음
                          </p>
                          <p className='evtForm_date'>{i.event_date}</p>
                          <p className='evtForm_views'>
                            <img src={views} alt='조회수' />0
                          </p>
                        </div>
                      </a>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : null}

          {isRangkingDak ? (
            <div className='fav_wrap'>
              <p className='fav_title'>{favoritesList.rangkingdakName}</p>

              <Swiper
                slidesPerView={1}
                centeredSlides={true}
                spaceBetween={30}
                grabCursor={true}
                pagination={{
                  type: 'fraction',
                  clickable: true,
                }}
                modules={[Pagination]}
                breakpoints={{
                  1068: {
                    slidesPerView: 4,
                    centeredSlides: false,
                  },
                  1900: {
                    slidesPerView: 5,
                    centeredSlides: false,
                  },
                }}
                className='mySwiper'
              >
                {favorites3.map((i, index) => (
                  <SwiperSlide>
                    <div className='eventWrap pa_10'>
                      <a
                        rel='noopener noreferrer'
                        target='_blank'
                        id={i.event_index}
                        key={i.event_index}
                        href={i.event_link}
                      >
                        <div className='evtForm_img'>
                          <img src={i.event_img} alt='img'></img>
                        </div>
                        <h1 className='evtForm_title'>{i.event_title}</h1>
                        <div className='evtForm_info'>
                          <p className='d_day'>
                            {' '}
                            {getDateDiff(
                              today,
                              // YYYY-MM-DD 의 양식으로 변경해주어 인자에 전달하고,
                              // DB에선 YY.MM.DD- YY.MM.DD의 양식을 유지한다.
                              // 문자열 가공을 함수로 옮기자..
                              i.event_date,
                            )}
                            일 남음
                          </p>
                          <p className='evtForm_date'>{i.event_date}</p>
                          <p className='evtForm_views'>
                            <img src={views} alt='조회수' />0
                          </p>
                        </div>
                      </a>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : null}
          <div className='fav_bottom_div'></div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Favorites;
