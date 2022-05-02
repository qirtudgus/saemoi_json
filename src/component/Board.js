import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../css/board.css";
import axios from "axios";
import bubble from "../img/말풍선.svg";

import "@toast-ui/editor/dist/toastui-editor.css";
import { Viewer } from "@toast-ui/react-editor";
import { UserInfo } from "../App";
import AddBoard from "../AddBoard";

const Board = () => {
  const { URL } = useContext(UserInfo);
  const [list, setList] = useState([]);
  useEffect(() => {
    axios
      .post(`${URL}/api/boardApiData/getBoard`)
      .then((res) => {
        console.log(res.data);

        //최신순으로 보기위해 배열 뒤집기
        let arr = res.data;
        let recent = arr.reverse();
        setList([...recent]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <div className="board_wrap">
        {list.map((i, index) => (
          <div
            onClick={() => {
              axios.post(`${URL}/api/boardApiData/views`, {
                index: i.board_index,
              });
              navigate(`/board/viewboard/${i.board_index}`);
            }}
            key={i.board_index}
            className="board_list"
          >
            <div className="board_content">
              {/* <span ref={boardNumber}>{i.board_index}</span> */}
              <div className="board_title">{i.board_title}</div>
              <div className="board_view">
                <Viewer initialValue={i.board_content}></Viewer>
              </div>
              <div className="board_writer">{i.board_writer}</div>

              <div className="board_bottom">
                <div className="board_bottom_wrap">
                  <span>추천수 : {i.board_like}</span>
                  <div className="board_bottom_bubble">
                    <img src={bubble} alt="bubble"></img>
                    <span className="board_count">
                      댓글 {i.board_commentCount}
                    </span>
                  </div>
                  <span>{i.board_date}</span>
                </div>
              </div>

              {/* <span>조회수 : {i.board_views}</span> */}
            </div>
            <div className="board_line"></div>
          </div>
        ))}
        <div className="board_bottomdiv"></div>
      </div>
      <AddBoard />
    </>
  );
};

export default Board;
