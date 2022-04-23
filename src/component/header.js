import React, { useState, useEffect, useRef } from 'react';
import logoSVG from '../img/saemoiSVG2.svg';
import { Link, NavLink, Outlet } from 'react-router-dom';
import '../css/header.css';
// import menu from '../img/menu_black.svg';
// import close from '../img/close_black.svg';
import triangle from '../img/whiteArrow0.svg';
// import downArrow from '../img/downArrow.png';
// import upArrow from '../img/upArrow.png';
const throttle = function (callback, waitTime) {
  let timerId = null;
  return (e) => {
    if (timerId) return;
    timerId = setTimeout(() => {
      callback.call(this, e);
      timerId = null;
    }, waitTime);
  };
};

const Header = () => {
  const [visible, setVisible] = useState(false);
  // const [activeSubMenu1, setActiveSubMenu1] = useState(false);
  // const [activeSubMenu2, setActiveSubMenu2] = useState(false);
  // const [activeSubMenu3, setActiveSubMenu3] = useState(false);
  // const [activeSubMenu4, setActiveSubMenu4] = useState(false);

  const [hide, setHide] = useState(false);
  const [pageY, setPageY] = useState(0);

  const documentRef = useRef(document);

  const handleScroll = () => {
    const { pageYOffset } = window;
    const deltaY = pageYOffset - pageY;
    const hide = pageYOffset !== 0 && deltaY >= 0;
    const hide2 = pageYOffset === 0 && deltaY >= 0;
    setVisible(hide2);
    setHide(hide);
    setPageY(pageYOffset);
  };

  const throttleScroll = throttle(handleScroll, 50);

  useEffect(() => {
    documentRef.current.addEventListener('scroll', throttleScroll);
    return () =>
      documentRef.current.removeEventListener('scroll', throttleScroll);
  }, [pageY]);

  // const toggleMenu = () => {
  //   setVisible((visible) => !visible);
  // };

  // const changeMenu = (e) => {
  //   setVisible(false);
  // };

  // const subMenuClick1 = (e) => {
  //   setActiveSubMenu1((activeSubMenu1) => !activeSubMenu1);
  // };
  // const subMenuClick2 = (e) => {
  //   setActiveSubMenu2((activeSubMenu2) => !activeSubMenu2);
  // };
  // const subMenuClick3 = (e) => {
  //   setActiveSubMenu3((activeSubMenu3) => !activeSubMenu3);
  // };
  // const subMenuClick4 = (e) => {
  //   setActiveSubMenu4((activeSubMenu3) => !activeSubMenu3);
  // };

  // const joinSubMenu = (e) => {
  //   setVisible(false);
  //   setActiveSubMenu1(false);
  //   setActiveSubMenu2(false);
  //   setActiveSubMenu3(false);
  //   setActiveSubMenu4(false);
  // };

  return (
    <>
      <header className='header'>
        <div className={hide ? 'headerWrap hide' : 'headerWrap'}>
          <div className='headerContent'>
            <div className='logoBtnBox'>
              <Link to='/'>
                <div className='logo'>
                  <img src={logoSVG} alt='logo' />
                </div>
              </Link>
              <div className='pcMenu'>
                <ul className='pcMenuBox'>
                  <li className='pcMainMenu'>
                    <NavLink
                      to='/drugstore'
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className={({ isActive }) =>
                        isActive ? 'active' : undefined
                      }
                    >
                      드럭스토어
                    </NavLink>
                    <ul className='pcSubMenu'>
                      <div className='triangle'></div>
                      <img src={triangle} alt='menu'></img>

                      <Link to='/drugstore/olive'>
                        <li>올리브영</li>
                      </Link>
                      <Link to='/sorry'>
                        {' '}
                        <li>랄라블라</li>
                      </Link>
                      <Link to='/sorry'>
                        {' '}
                        <li>롭스</li>
                      </Link>
                    </ul>
                  </li>
                  <li className='pcMainMenu'>
                    <NavLink
                      to='/clothes'
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className={({ isActive }) =>
                        isActive ? 'active' : undefined
                      }
                    >
                      의류
                    </NavLink>
                    <ul className='pcSubMenu'>
                      <div className='triangle'></div>
                      <img src={triangle} alt='menu'></img>
                      <Link to='/clothes/aland'>
                        {' '}
                        <li>에이랜드</li>
                      </Link>
                      <Link to='/sorry'>
                        <li>무신사</li>
                      </Link>
                      <Link to='/clothes/mustit'>
                        {' '}
                        <li>머스트잇</li>
                      </Link>
                    </ul>
                  </li>
                  <li className='pcMainMenu'>
                    <NavLink
                      to='/stores'
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className={({ isActive }) =>
                        isActive ? 'active' : undefined
                      }
                    >
                      백화점
                    </NavLink>
                    <ul className='pcSubMenu'>
                      <div className='triangle'></div>
                      <img src={triangle} alt='menu'></img>
                      <Link to='/store/lotteon'>
                        <li>롯데백화점</li>
                      </Link>
                      <Link to='/sorry'>
                        {' '}
                        <li>SSG</li>
                      </Link>
                      <Link to='/sorry'>
                        {' '}
                        <li>두타</li>
                      </Link>
                    </ul>
                  </li>
                  <li className='pcMainMenu'>
                    <NavLink
                      to='/food'
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className={({ isActive }) =>
                        isActive ? 'active' : undefined
                      }
                    >
                      식품
                    </NavLink>
                    <ul className='pcSubMenu'>
                      <div className='triangle'></div>
                      <img src={triangle} alt='menu'></img>
                      <Link to='/sorry'>
                        <li>랭킹닭컴</li>
                      </Link>
                      <Link to='/sorry'>
                        {' '}
                        <li>편의점</li>
                      </Link>
                      <Link to='/vips'>
                        {' '}
                        <li>VIPS</li>
                      </Link>
                    </ul>
                  </li>
                  <li>
                    <Link to='/sorry'>자유게시판</Link>
                  </li>
                  <li>
                    <Link to='/about'>어바웃</Link>
                  </li>
                </ul>
              </div>
              {/* 안쓰는 햄버거메뉴 */}
              {/* <div className='btnHome' onClick={toggleMenu}>
                {visible ? (
                  <img src={close} alt='close' />
                ) : (
                  <img src={menu} alt='menu' />
                )}
              </div> */}
            </div>
          </div>
        </div>

        {/* 안쓰는 햄버거메뉴 */}
        {/* <div className={visible ? 'headerSlide active' : 'headerSlide hide'}>
          <ul>
            <Link to='/' onClick={changeMenu}>
              <li>홈</li>
            </Link>
            <li onClick={subMenuClick1}>
              드럭스토어
              <img
                className='menuArrow'
                src={activeSubMenu1 ? upArrow : downArrow}
                alt='arrow'
              ></img>
              <ul
                className={activeSubMenu1 ? 'MsubMenu active' : 'MsubMenu hide'}
              >
                <Link to='/drugstore/olive'>
                  {' '}
                  <li onClick={joinSubMenu}>올리브영</li>{' '}
                </Link>
                <Link to='/sorry'>
                  {' '}
                  <li onClick={joinSubMenu}>랄라블라</li>
                </Link>
                <Link to='/sorry'>
                  <li onClick={joinSubMenu}>롭스</li>
                </Link>
              </ul>
            </li>

            <li onClick={subMenuClick4}>
              백화점
              <img
                className='menuArrow'
                src={activeSubMenu4 ? upArrow : downArrow}
                alt='arrow'
              ></img>
              <ul
                className={activeSubMenu4 ? 'MsubMenu active' : 'MsubMenu hide'}
              >
                <Link to='/sorry'>
                  <li onClick={joinSubMenu}>롯데백화점</li>
                </Link>
                <Link to='/sorry'>
                  <li onClick={joinSubMenu}>SSG</li>
                </Link>
                <Link to='/sorry'>
                  <li onClick={joinSubMenu}>두타</li>
                </Link>
              </ul>
            </li>

            <li onClick={subMenuClick2}>
              의류
              <img
                className='menuArrow'
                src={activeSubMenu2 ? upArrow : downArrow}
                alt='arrow'
              ></img>
              <ul
                className={activeSubMenu2 ? 'MsubMenu active' : 'MsubMenu hide'}
              >
                <Link to='/clothes/aland'>
                  <li onClick={joinSubMenu}>에이랜드</li>
                </Link>
                <Link to='sorry'>
                  <li onClick={joinSubMenu}>무신사</li>
                </Link>
                <Link to='/clothes/mustit'>
                  <li onClick={joinSubMenu}>머스트잇</li>
                </Link>
              </ul>
            </li>
            <li onClick={subMenuClick3}>
              식품
              <img
                className='menuArrow'
                src={activeSubMenu3 ? upArrow : downArrow}
                alt='arrow'
              ></img>
              <ul
                className={activeSubMenu3 ? 'MsubMenu active' : 'MsubMenu hide'}
              >
                <Link to='sorry'>
                  <li onClick={joinSubMenu}>랭킹닭컴</li>
                </Link>
                <Link to='sorry'>
                  <li onClick={joinSubMenu}>편의점</li>
                </Link>
                <Link to='sorry'>
                  <li onClick={joinSubMenu}>VIPS</li>
                </Link>
              </ul>
            </li>
            <Link to='about'>
              <li onClick={joinSubMenu}>자유게시판</li>
            </Link>
            <Link to='about'>
              <li onClick={joinSubMenu}>어바웃</li>
            </Link>
          </ul>
        </div> */}
        {visible ? <div className='noneTouchBox'></div> : null}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Header;
