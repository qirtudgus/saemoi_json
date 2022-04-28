import axios from 'axios';
import { useState, useRef, useEffect, useContext } from 'react';
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  useParams,
} from 'react-router-dom';

import backHistory from '../img/뒤로가기_흰색.svg';

// TOAST UI Editor import
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor, Viewer } from '@toast-ui/react-editor';
import { UserInfo } from '../App';

const ViewBoard = (pathname) => {
  const { userAuth, goLogOut } = useContext(UserInfo);

  const navigate = useNavigate();
  const [page, setPage] = useState([]);

  const key = pathname.data.replace(/[^0-9]/g, '');
  console.log(key);

  const params = useParams();
  //필요가 없네..?
  const profile = page[params.boardnumber];

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    axios
      .post('http://localhost:3001/api/boardApiData/viewBoard', { key: key })
      .then((res) => {
        console.log(res.data);
        setPage([...res.data]);
      });
  }, []);

  const like = (index, id) => {
    axios
      .post('http://localhost:3001/api/boardApiData/like', {
        key: index,
        id: id,
      })
      .then((res) => {
        if (res.data === true) {
          console.log('추천되었습니다.');
          return;
        } else if (res.data === false) {
          //추천이 취소되는 기능도 만들어보자..
          //db에서 -1 해주고 리스트에서 아이디를 제거해주면 될거같다.
          alert('이미 추천했어요');
        }
      })
      .then((res) => {
        axios
          .post('http://localhost:3001/api/boardApiData/viewBoard', {
            key: key,
          })
          .then((res) => {
            console.log(res.data);
            setPage([...res.data]);
          });
      });
  };

  return (
    <>
      {page.reverse().map((i, index) => (
        <div key={index}>
          <li>제목 : {i.board_title}</li>
          <li>작성날짜 : {i.board_date}</li>
          <li>작성자 : {i.board_writer}</li>
          <Viewer initialValue={i.board_content}></Viewer>
          <span>추천수 : {i.board_like}</span>

          <button
            className='like'
            onClick={() => {
              like(i.board_index, userAuth.id);
            }}
          >
            추천
          </button>
          <div className='goBack' onClick={goBack}>
            <img src={backHistory} alt='뒤로가기' />
          </div>
        </div>
      ))}
    </>
  );
};

export default ViewBoard;
