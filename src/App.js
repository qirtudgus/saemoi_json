import './App.css';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';

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

export const UserInfo = React.createContext();

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
  const [userAuth, setUserAuth] = useState({
    id: '',
    auth: false,
    refreshToken: '',
  });
  const goLogOut = () => {
    localStorage.removeItem('token');
    window.location.replace('/');
    setUserAuth({ ...userAuth, id: '', auth: false, refreshToken: '' });
  };

  const goLogin = () => {
    navigate('/login');
  };

  const goBoard = () => {
    navigate('/board');
  };

  const userAuthContext = {
    userAuth,
    setUserAuth,
    goLogOut,
    goLogin,
    goBoard,
    URL,
  };
  const href = useLocation();
  // console.log(href);
  const navigate = useNavigate();

  //useLocation의 path.name을 의존성 배열로 사용
  //주소가 바뀔때마다 토큰을 유무를 확인 후, userAuth 세팅
  useEffect(() => {
    axios.post(`${URL}/api/middlewere`).then((res) => {
      console.log(`서버 api jwt토큰검증 정상 Token = ${res.data}`);
      if (res.data === false) {
        localStorage.removeItem('token');
        console.log('세션이 만료되었습니다.');
      }

      const token = res.data;
      axios.defaults.headers.common['Authorization'] = `${token}`; //앞으로 api통신에 토큰이 들어가있음
      if (localStorage.getItem('token')) {
        const token = localStorage.getItem('token');
        const RefreshPayload = jwtDecode(token);
        const accessPayload = jwtDecode(RefreshPayload.accessToken);
        const { userId } = accessPayload;
        axios.defaults.headers.common['Authorization'] = `${token}`; //앞으로 api통신에 토큰이 들어가있음
        setUserAuth({
          ...userAuth,
          id: userId,
          auth: true,
          refreshToken: token,
        });
        console.log('토큰 헤더 등록 완료');
        // console.log(`${userAuth.id}님이 로그인 하셨습니다.`);
        setUserAuth({ ...userAuth, id: userId });
      } else {
        console.log('헤더에 등록할 토큰이 없습니다.');
        setUserAuth({
          ...userAuth,
          id: '',
          auth: false,
          refreshToken: 'null',
        });
      }
    });
  }, [href.pathname]);

  return (
    <>
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
            <Route path='/board' element={<Board data={href.pathname} />} />
            <Route
              path='/board/viewboard/:boardnumber'
              element={<ViewBoard data={href.pathname} />}
            />
            <Route
              path='/board/UpdateWrite/:boardnumber'
              element={<UpdateWrite data={href.pathname} />}
            />

            <Route path='/comment' element={<NotReady />} />
          </Route>
          <Route path='/category' element={<Category />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/auth/passwordchange' element={<PasswordChange />} />
        </Routes>
        {/* <Footer /> */}

        <Footerbar />
      </UserInfo.Provider>
    </>
  );
}

export default App;
