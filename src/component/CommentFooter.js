import { useCallback, useContext, useRef, useState } from 'react';
import '../css/commentFooter.css';
import axios from 'axios';
import { addDate } from './addDate';
import { UserInfo } from '../App';

const CommentFooter = ({
  setCommentList,
  key,
  addComment,
  setComment,
  comment,
}) => {
  const { userAuth, URL } = useContext(UserInfo);
  const area = useRef();
  console.log(setCommentList);
  console.log(key);

  const areaResize = useCallback(() => {
    if (area === null || area.current === null) {
      return;
    }
    area.current.style.height = '50px';
    area.current.style.height = area.current.scrollHeight + 'px';
  }, []);

  //댓글 등록하기
  //   const addComment = () => {
  //     axios
  //       .post(`${URL}/api/boardApiData/addComment`, {
  //         key: key,
  //         id: userAuth.id,
  //         date: addDate(),
  //         content: comment,
  //       })
  //       .then((res) => {
  //         setComment('');
  //         axios
  //           .post(`${URL}/api/boardApiData/comment`, { index: key })
  //           .then((res) => {
  //             console.log(res.data);
  //             setCommentList([...res.data]);
  //           });
  //       });
  //   };

  return (
    <>
      <div className='comment_footer_wrap'>
        <div className='comment_footer_container'>
          <textarea
            value={comment}
            placeholder='댓글을 입력해주세요.'
            ref={area}
            className='comment_footer_input'
            onChange={(e) => {
              areaResize();
              setComment(e.target.value);
            }}
          ></textarea>
          <button onClick={addComment}>등록</button>
        </div>
      </div>
    </>
  );
};

export default CommentFooter;
