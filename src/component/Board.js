import { useState, useRef, useEffect, useContext } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

import axios from "axios";

const Board = () => {
  const [boardList, setBoardList] = useState({
    board_index: "",
    board_title: "",
    board_writer: "",
    board_like: "",
    board_views: "",
  });
  const boardNumber = useRef();

  const [list, setList] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:3001/api/boardApiData/getBoard")
      .then((res) => {
        console.log(res.data);
        setList([...res.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const boardIndex = useRef();

  const navigate = useNavigate();

  return (
    <>
      {list.map((i, index) => (
        <div key={i.board_index}>
          <span ref={boardNumber}>{i.board_index}</span>
          <span
            onClick={() => {
              navigate(`/board/viewboard/${i.board_index}`);
            }}
          >
            제목 : {i.board_title}
          </span>
          <span>작성자 : {i.board_writer}</span>
          <span>날짜 : {i.board_date}</span>
          <span>조회수 : {i.board_views}</span>
          <span>추천수 : {i.board_like}</span>
        </div>
      ))}
    </>
  );
};

export default Board;
