import React from 'react';
import '../css/home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <div className='homeBox'>
        <div className='textBox'>
          <p className='textTitle'>세상의</p>
          <p className='textTitle'>모든</p>
          <p className='textTitle'>이벤트</p>
          <p className='textSub'>
            끝나면 돌아오지않는 이벤트들..
            <br />
            놓치지말고 세모이에서 확인하자!
          </p>
          <div className='textGo'>
            <Link to='/drugstore/newolive' className='Link_a'>
              보러가기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
