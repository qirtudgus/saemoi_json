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
import { addDate } from './addDate';
// TOAST UI Editor import
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor, Viewer } from '@toast-ui/react-editor';
import { UserInfo } from '../App';

const ViewBoard = (pathname) => {
  const { userAuth, goLogOut } = useContext(UserInfo);

  const navigate = useNavigate();
  const [page, setPage] = useState([]);
  const [comment, setComment] = useState();
  const [commentList, setCommentList] = useState([]);
  const [checkLikeUser, setCheckLikeUser] = useState(false);
  const [checkWriteUser, setCheckWriteUser] = useState(false);

  const key = pathname.data.replace(/[^0-9]/g, '');
  // console.log(key);

  // let commentList = [
  //   {
  //     comment_content: '저는 댓글이에요',
  //     comment_writer: userAuth.id,
  //     comment_date: '22.04.29',
  //   },
  //   {
  //     comment_content: '저는 댓글이에요222222',
  //     comment_writer: userAuth.id,
  //     comment_date: '22.06.29',
  //   },
  //   {
  //     comment_content: '저는 댓글이에요33333333',
  //     comment_writer: userAuth.id,
  //     comment_date: '22.22.29',
  //   },
  // ];

  const params = useParams();
  //필요가 없네..?
  const profile = page[params.boardnumber];

  const goBack = () => {
    navigate(-1);
  };

  //토큰의 아이디와 게시판 작성자를 비교하여 게시물 수정 삭제 버튼 생성
  function checkWriter(userAuth, writer) {
    if (userAuth === writer) {
      setCheckWriteUser(true);
      console.log('글의 작성자입니다.');
    } else {
      setCheckWriteUser(false);
      console.log('작성자가 아닙니다.');
    }
  }

  //게시판 api 뿌려주기
  useEffect(() => {
    axios
      .post('https://sungtt.com/api/boardApiData/viewBoard', { key: key })
      .then((res) => {
        // console.log(res.data);
        setPage([...res.data]);
        checkWriter(userAuth.id, res.data[0].board_writer);
      });
  }, []);

  //해당 게시물 댓글 api 뿌려주기
  useEffect(() => {
    axios
      .post('https://sungtt.com/api/boardApiData/comment', { index: key })
      .then((res) => {
        console.log(res.data);
        setCommentList([...res.data]);
      });
  }, []);

  //추천 유무 확인하기
  useEffect(() => {
    let id = userAuth.id;
    axios
      .post('https://sungtt.com/api/boardApiData/checkLikeUser', {
        id: id,
        index: key,
      })
      .then((res) => {});
  }, []);

  const like = (index, id) => {
    axios
      .post('https://sungtt.com/api/boardApiData/like', {
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
          console.log('추천취소!');
        }
      })
      .then((res) => {
        axios
          .post('https://sungtt.com/api/boardApiData/viewBoard', {
            key: key,
          })
          .then((res) => {
            // console.log(res.data);
            setPage([...res.data]);
          });
      });
  };

  //댓글 등록하기
  const addComment = () => {
    axios.post('https://sungtt.com/api/boardApiData/addComment', {
      key: key,
      id: userAuth.id,
      date: addDate(),
      content: comment,
    });
  };

  return (
    <>
      {page.reverse().map((i, index) => (
        <div key={index}>
          {checkWriteUser ? (
            <>
              <button
                onClick={() => {
                  navigate(`/board/UpdateWrite/${i.board_index}`);
                }}
              >
                글수정
              </button>
              <button>글삭제</button>
            </>
          ) : null}

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
          <input
            placeholder='댓글을 입력해주세요'
            onChange={(e) => {
              setComment(e.target.value);
            }}
          ></input>
          <button onClick={addComment}>댓글 등록</button>
          {commentList.map((i, index) => (
            <div key={i.comment_index}>
              <p>{i.comment_date}</p>
              <p>{i.comment_content}</p>
              <p>{i.comment_writer}</p>
            </div>
          ))}

          <div className='goBack' onClick={goBack}>
            <img src={backHistory} alt='뒤로가기' />
          </div>
        </div>
      ))}
    </>
  );
};

export default ViewBoard;
