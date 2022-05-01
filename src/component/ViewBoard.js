import axios from "axios";
import { useState, useRef, useEffect, useContext } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import "../css/viewboard.css";
import backHistory from "../img/뒤로가기_흰색.svg";
import { addDate } from "./addDate";
// TOAST UI Editor import
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor, Viewer } from "@toast-ui/react-editor";
import { UserInfo } from "../App";

const ViewBoard = (pathname) => {
  const { userAuth, goLogOut, goBoard, URL, setUserAuth } =
    useContext(UserInfo);

  const navigate = useNavigate();
  const [page, setPage] = useState([]);
  const [comment, setComment] = useState();
  const [commentList, setCommentList] = useState([]);
  const [checkLikeUser, setCheckLikeUser] = useState(false);
  const [checkWriteUser, setCheckWriteUser] = useState(false);

  const key = pathname.data.replace(/[^0-9]/g, "");
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
  const commentRef = useRef();
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
      console.log("글의 작성자입니다.");
    } else {
      setCheckWriteUser(false);
      console.log("작성자가 아닙니다.");
    }
  }

  useEffect(() => {
    setUserAuth({
      ...userAuth,
      id: userAuth.id,
      auth: true,
    });
  }, []);

  //게시판 api 뿌려주기
  useEffect(() => {
    axios
      .post(`${URL}/api/boardApiData/viewBoard`, { key: key })
      .then((res) => {
        // console.log(res.data);
        setPage([...res.data]);
        checkWriter(userAuth.id, res.data[0].board_writer);
      });
  }, []);

  //해당 게시물 댓글 api 뿌려주기
  useEffect(() => {
    axios
      .post(`${URL}/api/boardApiData/comment`, { index: key })
      .then((res) => {
        console.log(res.data);
        setCommentList([...res.data]);
      });
  }, []);

  //추천 유무 확인하기
  useEffect(() => {
    let id = userAuth.id;
    axios
      .post(`${URL}/api/boardApiData/checkLikeUser`, {
        id: id,
        index: key,
      })
      .then((res) => {});
  }, []);

  const like = (index, id) => {
    axios
      .post(`${URL}/api/boardApiData/like`, {
        key: index,
        id: id,
      })
      .then((res) => {
        if (res.data === true) {
          console.log("추천되었습니다.");
          return;
        } else if (res.data === false) {
          //추천이 취소되는 기능도 만들어보자..
          //db에서 -1 해주고 리스트에서 아이디를 제거해주면 될거같다.
          console.log("추천취소!");
        }
      })
      .then((res) => {
        axios
          .post(`${URL}/api/boardApiData/viewBoard`, {
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
    axios
      .post(`${URL}/api/boardApiData/addComment`, {
        key: key,
        id: userAuth.id,
        date: addDate(),
        content: comment,
      })
      .then((res) => {
        setComment("");
        axios
          .post(`${URL}/api/boardApiData/comment`, { index: key })
          .then((res) => {
            console.log(res.data);
            setCommentList([...res.data]);
          });
      });
  };

  const removeBoard = () => {
    if (window.confirm("글을 삭제하시겠습니까?")) {
      console.log(key);
      axios.post(`${URL}/api/boardApiData/removeBoard`, {
        key: key,
      });
      goBoard();
    }
  };

  return (
    <>
      {page.reverse().map((i, index) => (
        <div key={index} className="viewboard_warp">
          <div className="viewboard_container">
            {checkWriteUser ? (
              <>
                <button
                  onClick={() => {
                    navigate(`/board/UpdateWrite/${i.board_index}`);
                  }}
                >
                  글수정
                </button>
                <button onClick={removeBoard}>글삭제</button>
              </>
            ) : null}

            <li>제목 : {i.board_title}</li>
            <li>작성날짜 : {i.board_date}</li>
            <li>작성자 : {i.board_writer}</li>
            <div className="viewboard_view">
              <Viewer initialValue={i.board_content}></Viewer>
            </div>
            <span>추천수 : {i.board_like}</span>

            <button
              className="like"
              onClick={() => {
                like(i.board_index, userAuth.id);
              }}
            >
              추천
            </button>
            <input
              value={comment}
              placeholder="댓글을 입력해주세요"
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
            <div className="viewboard_bottomdiv"></div>
          </div>
          <div className="goBack" onClick={goBack}>
            <img src={backHistory} alt="뒤로가기" />
          </div>
        </div>
      ))}
    </>
  );
};

export default ViewBoard;
