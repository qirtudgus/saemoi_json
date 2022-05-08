import React, { useCallback } from 'react';
import views from '../img/views.png';
import Axios from 'axios';
import '../css/eventForm.css';

const NewEventForm = ({ Data, setData, getApi, viewApi }) => {
  const clickView = (e) => {
    const idx = e.currentTarget.id;
    console.log(idx);

    Axios.post(viewApi, { idx: idx }).then((res) => {});

    Axios.post(getApi).then((res) => {
      setData([...res.data]);
    });
  };
  // 배열의 일부분만 바꿔서 갱신하고 싶으면 https://github.com/kolodny/immutability-helper
  // target_blank를 쓸때 이슈 해결 https://beomsoo.me/issue/Issue-4/

  const today = new Date();

  const getDateDiff = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const diffDate = date1.getTime() - date2.getTime();
    const date = Math.abs(Math.ceil(diffDate / (1000 * 60 * 60 * 24)));
    //랭킹닭컴은 문자열이 들어가있어서 그에 대한 예외처리
    if (isNaN(date)) {
      return '이벤트 종료 시 까지';
    }
    return date;
  };

  return (
    <>
      <div className='eventForm_Container'>
        <div className='content'>
          <main className='eventMain'>
            <div className='eventWrap'>
              {Data.map((i, index) => (
                <a
                  href={i.event_link}
                  onClick={clickView}
                  target='_blank'
                  rel='noopener noreferrer'
                  key={i.event_index}
                  id={i.event_index}
                >
                  <div className='evtForm_img'>
                    <img src={i.event_img} alt='img' />
                  </div>
                  <h1 className='evtForm_title'>{i.event_title}</h1>
                  <div className='evtForm_info'>
                    <p className='d_day'>
                      {getDateDiff(
                        today,
                        // YYYY-MM-DD 의 양식으로 변경해주어 인자에 전달하고,
                        // DB에선 YY.MM.DD- YY.MM.DD의 양식을 유지한다.
                        '20' + i.event_date.slice(10).replaceAll('.', '-'),
                      )}
                      일 남음
                    </p>
                    <p className='evtForm_date'>{i.event_date}</p>
                    <p className='evtForm_views'>
                      <img src={views} alt='조회수' />
                      {i.event_view}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default React.memo(NewEventForm);
