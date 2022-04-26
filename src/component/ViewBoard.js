import axios from "axios";
import { useState, useRef, useEffect, useContext } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";

// TOAST UI Editor import
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor, Viewer } from "@toast-ui/react-editor";
import { UserInfo } from "../App";

const ViewBoard = (pathname) => {
  const { userAuth, goLogOut } = useContext(UserInfo);

  const [page, setPage] = useState([]);

  const key = pathname.data.replace(/[^0-9]/g, "");
  console.log(key);

  const params = useParams();
  const profile = page[params.boardnumber];

  useEffect(() => {
    axios
      .post("http://localhost:3001/api/boardApiData/viewBoard", { key: key })
      .then((res) => {
        console.log(res.data);
        setPage([...res.data]);
      });
  }, []);

  return (
    <>
      <div>{profile}</div>
      {page.map((i, index) => (
        <div key={index}>
          <Viewer initialValue={i.board_content}></Viewer>
          <li>제목 : {i.board_title}</li>
          <li>작성날짜 : {i.board_date}</li>
          <li>작성자 : {i.board_writer}</li>
        </div>
      ))}
    </>
  );
};

export default ViewBoard;
