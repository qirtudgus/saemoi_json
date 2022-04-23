import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../css/footerbar.css';

const Footerbar = () => {
  const navigate = useNavigate();

  const goCategory = () => {
    navigate('/category');
  };

  return (
    <nav className='footerBox'>
      <div className='footerBar'>
        <NavLink
          to='/category'
          className={({ isActive }) =>
            `navCategory ` + (isActive ? 'active' : undefined)
          }
        >
          <span className='navIcon'></span>
          <p>카테고리</p>
        </NavLink>

        <NavLink
          to='/comment'
          className={({ isActive }) =>
            `navComment ` + (isActive ? 'active' : undefined)
          }
        >
          <span className='navIcon'></span>
          <p>댓글달기</p>
        </NavLink>

        <NavLink
          to='/'
          className={({ isActive }) =>
            `navHome ` + (isActive ? 'active' : undefined)
          }
        >
          <span className='navIcon'></span>
          <p>홈</p>
        </NavLink>

        <NavLink
          to='/write'
          className={({ isActive }) =>
            `navWrite ` + (isActive ? 'active' : undefined)
          }
        >
          <span className='navIcon'></span>
          <p>글쓰기</p>
        </NavLink>

        <NavLink
          to='/mypage'
          className={({ isActive }) =>
            `navMyPage ` + (isActive ? 'active' : undefined)
          }
        >
          <span className='navIcon'></span>
          <p>마이페이지</p>
        </NavLink>
      </div>
    </nav>
  );
};

export default Footerbar;
