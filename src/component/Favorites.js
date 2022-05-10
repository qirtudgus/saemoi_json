import React, { useEffect, useState, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css/bundle";
import views from "../img/views.png";
import axios from "axios";
import "../css/favForm.css";
import { UserInfo } from "../App";
import Footer from "./footer";
const Favorites = () => {
  const { URL } = useContext(UserInfo);
  const today = new Date();

  const getDateDiff = (d1, d2) => {
    if (d2 === null) {
      return "이벤트 종료 시 까지";
    }

    let dateOrigin = "20" + d2.slice(10).replaceAll(".", "-");
    const date1 = new Date(d1);
    const date2 = new Date(dateOrigin);
    const diffDate = date1.getTime() - date2.getTime();
    const date = Math.abs(Math.ceil(diffDate / (1000 * 60 * 60 * 24)));
    //랭킹닭컴은 문자열이 들어가있어서 그에 대한 예외처리

    if (isNaN(date)) {
      return "이벤트 종료 시 까지";
    }
    return date;
  };
  const getJson = [
    {
      idx: 1,
      title: "신학기 맞이 쇼룸 프로모션",
      date: "22.02.15~22.03.19",
      img: "https://cdn.mustit.co.kr/lib/upload/event/list_upload/8fa77d155f16240db24381edb2c81750.jpeg/_dims_/resize/500x320",
      link: "https://mustit.co.kr/etc/event_view?number=219&click=event",
      view: 0,
    },
    {
      idx: 2,
      title: "2월 농협카드 즉시할인 프로모션",
      date: "22.02.15~22.02.28",
      img: "https://cdn.mustit.co.kr/lib/upload/event/list_upload/8c6e0ff70431eeca3c3b11d35135e3b7.jpeg/_dims_/resize/500x320",
      link: "https://mustit.co.kr/etc/event_view?number=218&click=event",
      view: 0,
    },
    {
      idx: 3,
      title: "2월 머스트잇 APP 혜택",
      date: "22.02.03~22.02.28",
      img: "https://cdn.mustit.co.kr/lib/upload/event/list_upload/9a5ac0d3cbbc47100de01efddca341a4.jpeg/_dims_/resize/500x320",
      link: "https://mustit.co.kr/etc/event_view?number=217&click=event",
      view: 0,
    },
    {
      idx: 4,
      title: "2월 신용카드 무이자 할부 이벤트",
      date: "22.02.03~22.02.28",
      img: "https://cdn.mustit.co.kr/lib/upload/event/list_upload/cc46a9fadfd171e2a7b56d08c06e9f94.jpeg/_dims_/resize/500x320",
      link: "https://mustit.co.kr/etc/event_view?number=214&click=event",
      view: 0,
    },
    {
      idx: 5,
      title: "이번 달 월간 잇 피플 공개!",
      date: "22.02.03~22.04.01",
      img: "https://cdn.mustit.co.kr/lib/upload/event/list_upload/4817e8326d251dd320d40a526e63c409.jpeg/_dims_/resize/500x320",
      link: "https://mustit.co.kr/etc/event_view?number=185&click=event",
      view: 0,
    },
    {
      idx: 6,
      title: "리뷰 서비스 안내",
      date: "23.03.10~23.04.10",
      img: "https://cdn.mustit.co.kr/lib/upload/event/list_upload/2e37b972aa84a6c876f20baa287e2030.jpeg/_dims_/resize/500x320",
      link: "https://mustit.co.kr/etc/event_view?number=135&click=event",
      view: 0,
    },
  ];

  const [favorites, setFavorites] = useState([]);
  const [favorites2, setFavorites2] = useState([]);

  useEffect(() => {
    setFavorites([...getJson]);
  }, []);

  useEffect(() => {
    axios.post(`${URL}/api/dbolive`).then((res) => {
      setFavorites2([...res.data]);
    });
  }, []);

  return (
    <>
      <div className="fav_wrap">
        <p className="fav_title">이벤트명</p>

        <Swiper
          slidesPerView={1}
          centeredSlides={true}
          spaceBetween={30}
          grabCursor={true}
          pagination={{
            type: "fraction",
            clickable: true,
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {favorites.map((i, index) => (
            <SwiperSlide>
              <div className="eventWrap pa_10">
                <a rel="noopener noreferrer" href={i.link}>
                  <div className="evtForm_img">
                    <img src={i.img} alt="img"></img>
                  </div>
                  <h1 className="evtForm_title">{i.title}</h1>
                  <div className="evtForm_info">
                    <p className="d_day">20일 남음</p>
                    <p className="evtForm_date">{i.date}</p>
                    <p className="evtForm_views">
                      <img src={views} alt="조회수" />0
                    </p>
                  </div>
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="fav_wrap">
        <p className="fav_title">이벤트명</p>

        <Swiper
          slidesPerView={1}
          centeredSlides={true}
          spaceBetween={30}
          grabCursor={true}
          pagination={{
            type: "fraction",
            clickable: true,
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {favorites2.map((i, index) => (
            <SwiperSlide>
              <div className="eventWrap pa_10">
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  id={i.event_index}
                  key={i.event_index}
                  href={i.event_link}
                >
                  <div className="evtForm_img">
                    <img src={i.event_img} alt="img"></img>
                  </div>
                  <h1 className="evtForm_title">{i.event_title}</h1>
                  <div className="evtForm_info">
                    <p className="d_day">
                      {" "}
                      {getDateDiff(
                        today,
                        // YYYY-MM-DD 의 양식으로 변경해주어 인자에 전달하고,
                        // DB에선 YY.MM.DD- YY.MM.DD의 양식을 유지한다.
                        // 문자열 가공을 함수로 옮기자..
                        i.event_date,
                      )}
                      일 남음
                    </p>
                    <p className="evtForm_date">{i.event_date}</p>
                    <p className="evtForm_views">
                      <img src={views} alt="조회수" />0
                    </p>
                  </div>
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Favorites;
