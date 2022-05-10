import axios from "axios";
import React, { useState, useRef, useEffect, useContext } from "react";
// TOAST UI Editor import
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { UserInfo } from "../App";
import { addDate } from "./addDate";
import { useNavigate } from "react-router-dom";

const UpdateWrite = ({ pathname }) => {
  const { userAuth, URL } = useContext(UserInfo);
  // console.log(pathname);
  const key = pathname.replace(/[^0-9]/g, "");
  console.log(key);
  const [board, setBoard] = useState({
    board_title: "",
    board_content: "zzzzzzzzzzzzz",
    board_writer: userAuth.id,
    board_date: "",
  });

  const navigate = useNavigate();
  const [editText, setEditText] = useState([]);

  const title = useRef();
  //   const title_content = title.current().text();
  const editor = useRef();
  //https://github.com/nhn/tui.editor/issues/1071 인스턴스 오류나는 이유
  //   const editorInstance = editor.current.getInstance();
  //   const editor_content = editorInstance.getHTML();

  //기존게시글 데이터 불러오기
  useEffect(() => {
    axios
      .post(`${URL}/api/boardApiData/viewBoard`, { key: key })
      .then((res) => {
        console.log(res.data.result[0]);
        //기존의 글 제목 불러오기 성공
        setBoard({
          ...board,
          board_title: res.data.result[0].board_title,
        });
        setEditText([...res.data.result]);
      });
  }, []);

  const goUpdate = async () => {
    let content = editor.current.getInstance().getHTML();
    // setBoard({
    //   ...board,

    //   board_content: editor.current.getInstance().getHTML(),
    // });
    let arr = {
      board_index: key,
      board_title: board.board_title,
      board_content: content,
      board_writer: board.board_writer,
      board_date: addDate(),
    };
    await axios.post(`${URL}/api/boardApiData/updatewrite`, arr).then((res) => {
      navigate(`/board/viewboard/${key}`, { replace: true });
    });
  };

  const title_write = (e) => {
    setEditText([{ ...editText, board_title: e.target.value }]);
  };

  return (
    <>
      {editText.map((i, index) => (
        <>
          <input
            name="title"
            placeholder="제목을 입력해주세요"
            ref={title}
            onChange={title_write}
            value={i.board_title}
          ></input>
          <Editor
            initialEditType="wysiwyg"
            ref={editor}
            initialValue={i.board_content}
          ></Editor>
          <button onClick={goUpdate}>수정하기</button>
        </>
      ))}
    </>
  );
};

export default React.memo(UpdateWrite);
