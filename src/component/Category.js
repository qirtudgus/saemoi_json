import React, { useContext, useState } from 'react';
import '../css/Category.css';
import drugStore from '../img/drugStore.svg';
import clothes from '../img/clothes.svg';
import Food from '../img/Food.svg';
import Store from '../img/Store.svg';
import Board from '../img/Board.svg';
import About from '../img/About.svg';
import { useNavigate } from 'react-router-dom';
import CategoryMap from './Category_map';
import { UserInfo, goLogOut } from '../App';

const Category = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [subMenu, setSubMenu] = useState('DrugStore');
  const navigate = useNavigate();
  const { userAuth } = useContext(UserInfo);

  const tabMenu = [
    { name: '드럭스토어', func: 'subMenuClick1', img: drugStore },
    { name: '의류', func: 'subMenuClick2', img: clothes },
    { name: '식품', func: 'subMenuClick3', img: Food },
    { name: '백화점', func: 'subMenuClick4', img: Store },
    { name: '자유게시판', func: 'subMenuClick1', img: Board },
    { name: '어바웃', func: 'subMenuClick1', img: About },
  ];

  const subMenuClick1 = (e) => {
    setSubMenu('DrugStore');
  };
  const subMenuClick2 = (e) => {
    setSubMenu('clothes');
  };
  const subMenuClick3 = (e) => {
    setSubMenu('Food');
  };
  const subMenuClick4 = (e) => {
    setSubMenu('Store');
  };
  const goBack = () => {
    navigate(-1);
  };

  const goBoard = () => {
    navigate('/about');
  };
  const goAbout = () => {
    navigate('/about');
  };

  const goLogin = () => {
    navigate('/login');
  };

  const selectMenuHandler = (e) => {
    setCurrentTab(e);
    console.log(e);
    switch (e) {
      case 0:
        subMenuClick1();
        break;
      case 1:
        subMenuClick2();
        break;
      case 2:
        subMenuClick3();
        break;
      case 3:
        subMenuClick4();
        break;
      case 4:
        goBoard();
        break;

      case 5:
        goAbout();
        break;
      default:
    }
  };

  return (
    <>
      <div className='categoryContainer'>
        <div className='goback' onClick={goBack}>
          뒤로가기
        </div>
        {userAuth.auth ? (
          <div className='categoryMapHeader'>
            <p>{userAuth.id}님 세모이에 오신걸 환영해요!</p>
            <button onClick={goLogOut}>로그아웃 </button>
          </div>
        ) : (
          <div className='categoryMapHeader'>
            <p>{userAuth.id}님 세모이에 오신걸 환영해요!</p>
            <button onClick={goLogin}>로그인 </button>
          </div>
        )}

        <nav className='categoryBox'>
          <div className='categoryArea'>
            <div className='mainList'>
              <ul>
                {tabMenu.map((i, index) => (
                  <li
                    className={currentTab === index ? 'active' : null}
                    onClick={() => selectMenuHandler(index)}
                    key={index}
                  >
                    <span className='mainListIcon'>
                      <img src={i.img} alt='mainList' />
                    </span>
                    <p> {i.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <CategoryMap subMenu={subMenu} />
          </div>
        </nav>
      </div>
    </>
  );
};
export default Category;
