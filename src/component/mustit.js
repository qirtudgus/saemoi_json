import React, { useState, useEffect, useContext } from 'react';
import EventForm from './eventForm';
import Comment from './comment';
import { UserInfo } from '../App';

const getJson = [
  {
    idx: 1,
    title: '신학기 맞이 쇼룸 프로모션',
    date: '22.02.15~22.03.19',
    img: 'https://cdn.mustit.co.kr/lib/upload/event/list_upload/8fa77d155f16240db24381edb2c81750.jpeg/_dims_/resize/500x320',
    link: 'https://mustit.co.kr/etc/event_view?number=219&click=event',
    view: 0,
  },
  {
    idx: 2,
    title: '2월 농협카드 즉시할인 프로모션',
    date: '22.02.15~22.02.28',
    img: 'https://cdn.mustit.co.kr/lib/upload/event/list_upload/8c6e0ff70431eeca3c3b11d35135e3b7.jpeg/_dims_/resize/500x320',
    link: 'https://mustit.co.kr/etc/event_view?number=218&click=event',
    view: 0,
  },
  {
    idx: 3,
    title: '2월 머스트잇 APP 혜택',
    date: '22.02.03~22.02.28',
    img: 'https://cdn.mustit.co.kr/lib/upload/event/list_upload/9a5ac0d3cbbc47100de01efddca341a4.jpeg/_dims_/resize/500x320',
    link: 'https://mustit.co.kr/etc/event_view?number=217&click=event',
    view: 0,
  },
  {
    idx: 4,
    title: '2월 신용카드 무이자 할부 이벤트',
    date: '22.02.03~22.02.28',
    img: 'https://cdn.mustit.co.kr/lib/upload/event/list_upload/cc46a9fadfd171e2a7b56d08c06e9f94.jpeg/_dims_/resize/500x320',
    link: 'https://mustit.co.kr/etc/event_view?number=214&click=event',
    view: 0,
  },
  {
    idx: 5,
    title: '이번 달 월간 잇 피플 공개!',
    date: '22.02.03~22.04.01',
    img: 'https://cdn.mustit.co.kr/lib/upload/event/list_upload/4817e8326d251dd320d40a526e63c409.jpeg/_dims_/resize/500x320',
    link: 'https://mustit.co.kr/etc/event_view?number=185&click=event',
    view: 0,
  },
  {
    idx: 6,
    title: '리뷰 서비스 안내',
    date: '23.03.10~23.04.10',
    img: 'https://cdn.mustit.co.kr/lib/upload/event/list_upload/2e37b972aa84a6c876f20baa287e2030.jpeg/_dims_/resize/500x320',
    link: 'https://mustit.co.kr/etc/event_view?number=135&click=event',
    view: 0,
  },
];

const Mustit = () => {
  const brandName = 'mustit';
  const { URL } = useContext(UserInfo);
  const getCommentApi = `${URL}/api/mustitApiData/comment`;
  const postCommentApi = `${URL}/api/mustitApiData/comment/post`;
  const [eventData, setEventData] = useState([]);

  const getView = (eventData) => {
    setEventData([...eventData]);
  };

  useEffect(() => {
    setEventData([...getJson]);
  }, []);

  return (
    <>
      <EventForm Data={eventData} setData={setEventData} getView={getView} />
      <Comment
        brandName={brandName}
        getCommentApi={getCommentApi}
        postCommentApi={postCommentApi}
        // getCommentApi='http://localhost:3001/api/mustitApiData/comment'
        // postCommentApi='http://localhost:3001/api/mustitApiData/comment/post'
      />
    </>
  );
};

export default Mustit;
