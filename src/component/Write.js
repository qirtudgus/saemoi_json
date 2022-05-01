import axios from 'axios';
import React, { useState, useRef, useEffect, useContext } from 'react';
// TOAST UI Editor import
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor, Viewer } from '@toast-ui/react-editor';
import { UserInfo } from '../App';
import { addDate } from './addDate';

const Write = () => {
  const { userAuth, goLogOut, goBoard, goHome, goLogin, URL } =
    useContext(UserInfo);

  const [board, setBoard] = useState({
    board_title: '',
    board_content: '',
    board_writer: userAuth.id,
    board_date: '',
  });

  const [editText, setEditText] = useState([]);

  const title = useRef();
  //   const title_content = title.current().text();
  const editor = useRef();
  //https://github.com/nhn/tui.editor/issues/1071 인스턴스 오류나는 이유
  //   const editorInstance = editor.current.getInstance();
  //   const editor_content = editorInstance.getHTML();
  const viewer = useRef();
  //   const viewerInstance = viewer.current.getInstance();
  //   const viewer_content = editorInstance.setHTML();

  useEffect(() => {
    if (userAuth.auth) {
      return;
    }
    if (!userAuth.auth) {
      alert('회원만 작성하실 수 있습니다. 로그인 해 주세요!');
      goLogin();
    }
  }, []);

  const goWrite = async () => {
    // console.log(editorInstance.getHTML());
    let content = editor.current.getInstance().getHTML();
    // setBoard({
    //   ...board,

    //   board_content: editor.current.getInstance().getHTML(),
    // });
    let arr = {
      board_title: board.board_title,
      board_content: content,
      board_writer: board.board_writer,
      board_date: addDate(),
    };
    await axios.post(`${URL}/api/boardApiData/write`, arr).then((res) => {
      console.log(res);
      goBoard();
    });
  };

  const title_write = (e) => {
    setBoard({ ...board, board_title: e.target.value });
  };

  const goSee = async () => {
    await axios.post(`${URL}/api/boardApiData/getBoard`).then((res) => {
      console.log(res.data);
      setEditText([...res.data]);
      console.log(res.data[1].board_content);
      // setBoard({ ...board, board_content: res.data[1].board_content });
      editText.concat(res.data[1].board_content);
      editText.push('zz');
    });
  };

  return (
    <>
      <input
        name='title'
        placeholder='제목을 입력해주세요'
        ref={title}
        onChange={title_write}
      ></input>
      <Editor ref={editor} initialEditType='wysiwyg'></Editor>
      <button onClick={goWrite}>작성</button>
    </>
  );
};

export default React.memo(Write);
