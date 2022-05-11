import '../css/favorites_skeleton.css';
import fav_skeleton from '../img/SVG/fav_skeleton.svg';
const Favorites_Skeleton = () => {
  return (
    <>
      <div className='fav_st_bg'></div>
      <div className='fav_st_wrap'>
        <p className='fav_st_title '>아직 즐겨찾기를 안하셨어요!</p>
        <p className='fav_st_desc'>
          원하시는 이벤트로 들어가 상단의 즐겨찾기를 누르시면 앞으로 이곳에서
          확인이 가능해요!
        </p>
        <div className='fav_st_box'>
          <div className='fav_st_img'>
            <img src={fav_skeleton}></img>{' '}
          </div>
          <div className='fav_st_date'></div>
        </div>
      </div>
    </>
  );
};

export default Favorites_Skeleton;
