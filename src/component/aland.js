import axios from "axios";
import Comment from "./comment";
import cheerio from "cheerio";
import React, { useState, useEffect } from "react";
import Loading from "./loading";
import EventForm from "./eventForm";

const Aland = () => {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(false);
  const brandName = "aland";

  const getApi = "https://sungtt.com/api/alandApiData";
  const getView = "https://sungtt.com/api/alandApiData/views";

  function getAlandData() {
    return axios.get(getApi);
  }

  async function getNewAlandData() {
    const res = await axios.get(
      "https://www.a-land.co.kr/event/promotion_list.php",
    );
    let titleList = [];
    let dateList = [];
    let imgList = [];
    let linkList = [];
    let eventList = [];
    const $ = cheerio.load(res.data);
    const title = $(".wrap-event-list .ename");
    console.log("title: ", title);
    const date = $(".wrap-event-list .period");
    const img = $(".wrap-event-list .thumb").children("img");
    const link = $(".ajax_hash");
    title.each(function (i) {
      titleList[i] = {
        title: $(this)
          .text()
          .replace(/[\n\t]/g, ""),
      };
    });
    date.each(function (i_1) {
      dateList[i_1] = {
        date: $(this)
          .text()
          .replace(/[/]/g, ".")
          .replace(/ /g, "")
          .substring(2)
          .replaceAll("20", ""),
      };
    });
    img.each(function (i_2) {
      imgList[i_2] = {
        img: "https://www.a-land.co.kr" + $(this).attr("src"),
      };
    });
    link.each(function (i_3) {
      linkList[i_3] = {
        link: "https://www.a-land.co.kr" + $(this).attr("href"),
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
    axios.get("https://sungtt.com/api/alandApiData").then((res) => {
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
          console.log("이벤트가 최신입니다.");
          setEventData([...tableData.data]);
        } else {
          // 새로 받아온 이벤트의 타이틀과 compare2의 차집합 배열
          const compareNewData = newData.filter((i) => {
            const title = i.title;
            return !tableDataTitle.includes(title);
          });
          const NewDataNum = compareNewData.length;

          // 없는 타이틀의 배열을 전송
          axios.post("https://sungtt.com/api/alandApiData/get", compareNewData);

          // 진행중인 이벤트엔없고, 기존엔 가지고있는 삭제해야할 배열 생성
          const delData = tableData.data.filter((i) => {
            const title = i.title;
            return !newDataTitle.includes(title);
          });

          // 종료된 타이틀의 배열을 전송
          axios.post("https://sungtt.com/api/alandApiData/end", delData);

          // 새로운 데이터를 받아와서, 렌더링
          axios.get("https://sungtt.com/api/alandApiData").then((res) => {
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
          {" "}
          <EventForm
            Data={eventData}
            setData={setEventData}
            getApi={getApi}
            getView={getView}
          />
          <Comment
            brandName={brandName}
            getCommentApi="https://sungtt.com/api/alandApiData/comment"
            postCommentApi="https://sungtt.com/api/alandApiData/comment/post"
          />
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};
export default Aland;
