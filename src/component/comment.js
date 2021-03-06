import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import Footer from './footer';
// import cryptoJs from "crypto-js";
import React, { useEffect, useState, useRef, useContext } from 'react';
import { addDate } from './addDate';
import { UserInfo } from '../App';

const Comment = ({ getCommentApi, postCommentApi, brandName }) => {
  const [comment, setComment] = useState([]);
  const { URL } = useContext(UserInfo);
  useEffect(() => {
    axios.get(getCommentApi).then((res) => {
      console.log(res.data);
      setComment([...res.data]);
    });
  }, []);

  const commentContent = useRef();
  const passwordValue = useRef();
  const commentList = useRef();

  const postComment = async () => {
    const value = commentContent.current.value;
    const password = passwordValue.current.value;
    const hashPassword = sha256(password).words.join('');
    const commentData = {
      sumbitDate: addDate(),
      value,
      hashPassword,
    };
    console.log(commentData);
    if (value.length === 0) {
      alert('작성된 내용이 없습니다!');
      commentContent.current.focus();
    } else if (password.length === 0) {
      alert('비밀번호를 입력해주세요!');
      passwordValue.current.focus();
    } else {
      window.location.reload(); //댓글 등록 후 새로고침
      await axios.post(postCommentApi, commentData);
    }
  };

  const delComment = (e) => {
    const idx = parseInt(
      e.target.parentNode.parentNode.querySelector('#comm_num').innerText,
    );
    const delConfirm = window.prompt('댓글의 비밀번호를 입력해주세요!');
    const hash = sha256(delConfirm).words.join('');
    const passwordCheckValue = { idx, hash, brandName };
    axios
      .get(`${URL}/api/${brandName}ApiData/comment_password_check_${brandName}`)
      .then((res) => {
        let userInfo = res.data;
        let password = userInfo.find((i) => i.idx === idx).password;
        return password;
      })
      .then((res) => {
        if (hash === res) {
          axios.post(`${URL}/api/comment_password_check`, passwordCheckValue);
          alert('댓글이 삭제되었습니다.');
          window.location.reload(); //댓글 삭제 후 새로고침
        } else alert('비밀번호가 틀립니다.');
      });
  };

  return (
    <div>
      <div className='comm_box'>
        <h1 className='comm_title'>
          한줄 코멘트!
          <br />
          <p className='comm_sub'>
            이벤트에 관한 여러분의 다양한 생각을 나눠보세요!
          </p>
        </h1>
        {comment.map((i, index) => {
          const content = i.content;
          const date = i.date;
          return (
            <div key={index}>
              <li ref={commentList} className='comm_content'>
                <span id='comm_num'>{i.idx}</span>
                <div className='comm_text'>{content}</div>
                <div className='comm_info'>
                  <span className='comm_date'>{date} </span>{' '}
                  <span id='comm_del' onClick={delComment}>
                    삭제
                  </span>
                </div>
              </li>
            </div>
          );
        })}
        <div className='input_box'>
          <textarea
            maxLength={60}
            className='comm_area'
            placeholder='댓글을 입력해주세요.(최대60자)'
            ref={commentContent}
          />
          <div className='input_inbox'>
            <input
              className='input_pw'
              type='password'
              placeholder='비밀번호를 입력해주세요'
              ref={passwordValue}
            ></input>
            <input
              className='submitBtn'
              type='submit'
              value='등 록'
              onClick={postComment}
            ></input>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Comment;
