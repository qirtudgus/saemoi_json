import { useCallback, useRef } from 'react';
import '../css/commentFooter.css';
import send from '../img/send.svg';

const CommentFooter = ({ addComment, setComment, comment }) => {
  const area = useRef();
  const btn = useRef();

  const areaResize = useCallback(() => {
    if (area === null || area.current === null) {
      return;
    }
    area.current.style.height = '50px';
    area.current.style.height = area.current.scrollHeight + 'px';
  }, []);

  return (
    <>
      <div className='comment_footer_wrap'>
        <div className='comment_footer_container'>
          <div className='comment_footer_box'>
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
            <button className='comment_btn' onClick={addComment}>
              <img src={send}></img>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentFooter;
