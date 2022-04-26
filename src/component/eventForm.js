import React, { useCallback } from "react";
import views from "../img/views.png";
import Axios from "axios";
import "../css/eventForm.css";

const EventForm = ({ Data, setData, getApi, getView }) => {
  const clickView = (e) => {
    const idx = e.currentTarget.id;
    console.log(idx);
    Axios.get(getApi).then((res) => {
      setData([...res.data]);
    });

    Axios.post(getView, { idx: idx });

    Axios.get(getApi).then((res) => {
      setData([...res.data]);
    });
  };
  // 배열의 일부분만 바꿔서 갱신하고 싶으면 https://github.com/kolodny/immutability-helper
  // target_blank를 쓸때 이슈 해결 https://beomsoo.me/issue/Issue-4/

  return (
    <>
      <div className="eventForm_Container">
        <div className="content">
          <main className="eventMain">
            <div className="eventWrap">
              {Data.map((i, index) => (
                <a
                  href={i.link}
                  onClick={clickView}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                  id={i.idx}
                >
                  <div className="evtForm_img">
                    <img src={i.img} alt="img" />
                  </div>
                  <h1 className="evtForm_title">{i.title}</h1>
                  <div className="evtForm_info">
                    <p className="evtForm_date">{i.date}</p>
                    <p className="evtForm_views">
                      <img src={views} alt="조회수" />
                      {i.view}
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

export default React.memo(EventForm);
