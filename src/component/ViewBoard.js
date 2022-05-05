import axios from "axios";
import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/viewboard.css";
import backHistory from "../img/뒤로가기_흰색.svg";
import { addDate } from "./addDate";
// TOAST UI Editor import
import "@toast-ui/editor/dist/toastui-editor.css";
import { Viewer } from "@toast-ui/react-editor";
import { UserInfo } from "../App";
import CommentFooter from "./CommentFooter";
import BottomDiv from "./BottomDiv";

const ViewBoard = () => {
  const { userAuth, goBoard, URL, pathname } = useContext(UserInfo);

  const navigate = useNavigate();
  const [comment, setComment] = useState();

  const key = pathname.replace(/[^0-9]/g, "");

  const [arr, setArr] = useState({
    page: [],
    commentList: [],
    profile: "",
    checkWriteUser: false,
  });

  console.log("안녕");

  const goBack = () => {
    navigate(-1);
  };

  //토큰의 아이디와 게시판 작성자를 비교하여 게시물 수정 삭제 버튼 생성
  function checkWriter(userAuth, writer) {
    if (userAuth === writer) {
      console.log("글의 작성자입니다.");
      return true;
    } else {
      console.log("작성자가 아닙니다.");
      return false;
    }
  }

  function viewBoardData() {
    return axios
      .post(`${URL}/api/boardApiData/viewBoard`, { key: key })
      .then((res) => {
        return res.data;
      });
  }

  function viewBoardCommentData() {
    return axios
      .post(`${URL}/api/boardApiData/comment`, { index: key })
      .then((res) => {
        return res.data;
      });
  }

  useEffect(() => {
    try {
      axios.all([viewBoardData(), viewBoardCommentData()]).then(
        axios.spread(function (pageData, commentData) {
          console.log(pageData.profile);
          console.log(pageData.result);
          setArr({
            ...arr,
            page: [...pageData.result],
            commentList: [...commentData],
            profile: pageData.profile,
            checkWriteUser: checkWriter(
              userAuth.id,
              pageData.result[0].board_writer,
            ),
          });
        }),
      );
    } catch (err) {
      console.log(err);
    }
  }, []);

  //게시판 api 뿌려주기
  // useEffect(() => {
  //   //게시물
  //   axios
  //     .post(`${URL}/api/boardApiData/viewBoard`, { key: key })
  //     .then((res) => {
  //       // console.log(res.data);
  //       setPage([...res.data]);
  //       checkWriter(userAuth.id, res.data[0].board_writer);
  //     });
  //   //댓글목록
  //   axios
  //     .post(`${URL}/api/boardApiData/comment`, { index: key })
  //     .then((res) => {
  //       console.log(res.data);
  //       setCommentList([...res.data]);
  //     });
  // }, []);

  // 추천 유무 확인하기
  // useEffect(() => {
  //   let id = userAuth.id;
  //   axios
  //     .post(`${URL}/api/boardApiData/checkLikeUser`, {
  //       id: id,
  //       index: key,
  //     })
  //     .then((res) => {});
  // }, []);

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
            setArr({ ...arr, page: [...res.data.result] });
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
            setArr({ ...arr, commentList: [...res.data] });
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

  //댓글 삭제
  const removeComment = (e) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      let comment_index = "num";
      //댓글index에 접근하기위해 임의의 어트리뷰트를 지정한 뒤 값에 접근
      //https://violetboralee.medium.com/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%86%8D%EC%84%B1-attribute-%EA%B3%BC-%ED%94%84%EB%A1%9C%ED%8D%BC%ED%8B%B0-property-d2f9b772addf
      let index = e.target.parentNode.parentNode.getAttribute(comment_index);
      console.log(index);
      axios
        .post(`${URL}/api/boardApiData/removeComment`, {
          comment_index: index,
          board_index: key,
        })
        .then((res) => {
          axios
            .post(`${URL}/api/boardApiData/comment`, { index: key })
            .then((res) => {
              console.log(res.data);
              setArr({ ...arr, commentList: [...res.data] });
            });
        });
    } else return;
  };

  return (
    <>
      {arr.page.reverse().map((i, index) => (
        <div key={index} className="viewboard_warp">
          <div className="viewboard_container">
            <div className="viewboard_middiv">
              <div className="viewboard_writer">
                <div className="board_writer">
                  <img src={arr.profile} alt="profile"></img>
                  {i.board_writer}
                </div>

                <div>{i.board_date}</div>
              </div>
            </div>
            <div className="viewboard_title">{i.board_title}</div>

            <div className="viewboard_view">
              <Viewer initialValue={i.board_content}></Viewer>
            </div>
            <div className="viewboard_like">
              <div>
                추천수 : {i.board_like}{" "}
                <button
                  className="like"
                  onClick={() => {
                    like(i.board_index, userAuth.id);
                  }}
                >
                  추천
                </button>
              </div>
              <div>
                {arr.checkWriteUser ? (
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
              </div>
            </div>

            {arr.commentList.map((i, index) => (
              <div
                className="comment_wrap"
                key={i.comment_index}
                num={i.comment_index}
              >
                <div className="comment_middiv">
                  <div className="comment_writer">{i.comment_writer}</div>
                  <div className="comment_date">{i.comment_date}</div>
                </div>
                <div className="comment_bottomdiv">
                  <div className="comment_content">{i.comment_content}</div>

                  {
                    //접속한 아이디와 동일한 작성자만 삭제 버튼 활성화
                    userAuth.id === i.comment_writer ? (
                      <button onClick={removeComment}>삭제</button>
                    ) : null
                  }
                </div>
              </div>
            ))}

            <CommentFooter
              key={key}
              addComment={addComment}
              setComment={setComment}
              comment={comment}
            />
          </div>
          <div className="goBack" onClick={goBack}>
            <img src={backHistory} alt="뒤로가기" />
          </div>
        </div>
      ))}
      <BottomDiv />
    </>
  );
};

export default React.memo(ViewBoard);
