import { useState, useRef, useEffect, useContext } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import "../css/board.css";
import axios from "axios";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor, Viewer } from "@toast-ui/react-editor";
import { UserInfo } from "../App";
import { useInView } from "react-intersection-observer";

const Board = () => {
  const boardNumber = useRef();
  const { URL } = useContext(UserInfo);
  const [list, setList] = useState([]);
  const [ref, inView] = useInView();
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
            <div className="board_content" ref={ref}>
              {/* <span ref={boardNumber}>{i.board_index}</span> */}
              <p className="board_title">제목 : {i.board_title}</p>
              <div className="board_view">
                <Viewer initialValue={i.board_content}></Viewer>
              </div>
              <p className="board_writer">작성자 : {i.board_writer}</p>

              <div className="board_bottom">
                <span>추천수 : {i.board_like}</span>
                <span>{i.board_date}</span>
              </div>

              {/* <span>조회수 : {i.board_views}</span> */}
            </div>
            <div className="board_line"></div>
          </div>
        ))}
        <div className="board_bottomdiv"></div>
      </div>
    </>
  );
};

export default Board;
