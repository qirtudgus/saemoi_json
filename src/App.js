import './App.css';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
// import Modal from 'react-modal';

import Oliveyoung from './component/oliveyoung';
import Home from './component/home';
import Header from './component/header';
import Mustit from './component/mustit';
import About from './component/about';
import NotReady from './component/notReady';
import Aland from './component/aland';
import Footerbar from './component/Footerbar';
import Category from './component/Category';
import Layout from './component/Layout';
import Login from './component/auth/login';
import Register from './component/auth/register';
import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import MyPage from './component/MyPage';
import PasswordChange from './component/auth/PasswordChange';
import Write from './component/Write';
import UpdateWrite from './component/UpdateWrite';
import Board from './component/Board';
import ViewBoard from './component/ViewBoard';
import BottomDiv from './component/BottomDiv';
import ChangeProfile from './component/ChangeProfile';
import PasswordFind from './component/PasswordFind';

export const UserInfo = React.createContext();
window.Buffer = window.Buffer || require('buffer').Buffer;

// api통신 시 URL 변경용
const local = 'http://localhost:3001';
const server = 'https://sungtt.com';
// URL 할당에 따른 서버환경 변경! 아주편리하다~
const URL = local;

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  console.log('resize');
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

function App() {
  const [userProfile, setUserProfile] = useState(null);
  const href = useLocation();
  const navigate = useNavigate();

  const [userAuth, setUserAuth] = useState({
    id: '',
    auth: false,
    refreshToken: '',
    profile: '',
  });

  console.log(userAuth);

  const goLogOut = () => {
    localStorage.removeItem('token');
    setUserAuth({
      ...userAuth,
      id: '',
      auth: false,
      refreshToken: '',
    });
    goHome();
  };

  const goHome = () => {
    navigate('/');
  };

  const goBack = () => {
    navigate(-1);
  };

  const goLogin = () => {
    navigate('/login');
  };

  const goBoard = () => {
    navigate('/board');
  };

  const pathname = href.pathname;

  // 유저 프로필주소 얻어서 상태값에 할당
  async function goProfile() {
    const token = localStorage.getItem('token');
    const payload = jwtDecode(token);
    console.log(payload.userId);
    const goProFileLocation = await axios.post(`${URL}/getProfile`, {
      id: payload.userId,
    });
    console.log(goProFileLocation.data[0].profile);
    setUserProfile(goProFileLocation.data[0].profile);
  }

  // contextApi 목록
  const userAuthContext = {
    userAuth,
    setUserAuth,
    goLogOut,
    goLogin,
    goBoard,
    goBack,
    URL,
    pathname,
    userProfile,
  };

  axios.defaults.headers.common['Authorization'] = `${
    localStorage.getItem('token') || undefined
  }`;
  useEffect(() => {
    if (localStorage.getItem('token')) {
      //앞으로 api통신에 토큰이 들어가있음
      const token = localStorage.getItem('token');

      const payload = jwtDecode(token);
      console.log(payload);
      setUserAuth({
        ...userAuth,
        id: payload.userId,
        auth: true,
        refreshToken: token,
      });

      goProfile();

      axios.post(`${URL}/api/middlewere`).then((res) => {
        if (res.data === '') {
          console.log('헤더가 없습니다..');
          return;
        }
        axios.defaults.headers.common['Authorization'] = `${res.data}`;
        localStorage.setItem('token', res.data);
      });
    }
    if (localStorage.getItem('token') === null) {
      console.log('토큰없음');
      axios.defaults.headers.common['Authorization'] = `${undefined}`;
    }
  }, [href.pathname]);

  //url에 viewboard가 들어가면 footerbar 비렌더링
  const viewBoardRegExp = /viewboard/g;
  const viewBoard = viewBoardRegExp.test(href.pathname);

  return (
    <>
      {/* <Modal
        isOpen={profileDecide}
        ariaHideApp={false}
        onRequestClose={() => {
          setProfileDecide(false);
        }}
      >
        <div className='decide_wrap'></div>
      </Modal> */}

      {/* <Header /> */}
      <UserInfo.Provider value={userAuthContext}>
        <Routes>
          <Route element={<Header />}>
            <Route path='/' element={<Home />} />
            <Route path='/drugstore/olive' element={<Oliveyoung />} />
            <Route path='/clothes/aland' element={<Aland />} />
            <Route path='/clothes/mustit' element={<Mustit />} />
            <Route path='/about' element={<About />} />
            <Route path='/sorry' element={<NotReady />} />
            <Route path='/mypage' element={<MyPage />} />
            <Route path='/write' element={<Write />} />
            <Route path='/board' element={<Board />} />
            <Route
              path='/board/viewboard/:boardnumber'
              element={<ViewBoard />}
            />
            <Route
              path='/board/UpdateWrite/:boardnumber'
              element={<UpdateWrite data={href.pathname} />}
            />

            <Route path='/comment' element={<NotReady />} />
          </Route>
          <Route path='/changeprofile' element={<ChangeProfile />} />
          <Route path='/category' element={<Category />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/auth/passwordchange' element={<PasswordChange />} />
          <Route path='/auth/passwordFind' element={<PasswordFind />} />
        </Routes>
        {/* <Footer /> */}
        {viewBoard ? null : <Footerbar />}
      </UserInfo.Provider>
    </>
  );
}

export default App;
