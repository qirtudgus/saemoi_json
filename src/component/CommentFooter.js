import { useCallback, useContext, useRef, useState } from 'react';
import '../css/commentFooter.css';

const CommentFooter = ({ addComment, setComment, comment }) => {
  const area = useRef();

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
