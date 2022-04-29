import { useState, useRef, useEffect, useContext } from 'react';
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  Link,
} from 'react-router-dom';
import '../css/board.css';
import axios from 'axios';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor, Viewer } from '@toast-ui/react-editor';

const Board = () => {
  const boardNumber = useRef();

  const [list, setList] = useState([]);

  useEffect(() => {
    axios
      .post('http://localhost:3001/api/boardApiData/getBoard')
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
      <div className='board_wrap'>
        {list.map((i, index) => (
          <div
            onClick={() => {
              axios.post('https://sungtt.com/api/boardApiData/views', {
                index: i.board_index,
              });
              navigate(`/board/viewboard/${i.board_index}`);
            }}
            key={i.board_index}
            className='board_list'
          >
            <div className='board_content'>
              <span ref={boardNumber}>{i.board_index}</span>
              <span className='board_title'>제목 : {i.board_title}</span>
              <span>작성자 : {i.board_writer}</span>
              <Viewer initialValue={i.board_content}></Viewer>
              <span>날짜 : {i.board_date}</span>
              <span>조회수 : {i.board_views}</span>
              <span>추천수 : {i.board_like}</span>
            </div>
            <div className='board_line'></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Board;
