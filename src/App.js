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

export const goLogOut = () => {
  localStorage.removeItem('token');
  window.location.replace('/');
};

export const UserInfo = React.createContext();

function App() {
  const [userAuth, setUserAuth] = useState({
    id: '',
    auth: false,
    refreshToken: '',
  });
  const userAuthContext = { userAuth, setUserAuth };
  const href = useLocation();
  console.log(href);
  const navigate = useNavigate();

  //주소가 바뀔때마다 토큰을 유무를 확인 후, userAuth 세팅
  useEffect(() => {
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
      console.log(userAuth);
      console.log('토큰 헤더 등록 완료');
    } else {
      console.log('헤더에 등록할 토큰이 없습니다.');
      setUserAuth({
        ...userAuth,
        id: '',
        auth: false,
        refreshToken: 'null',
      });
    }
  }, [href.pathname]);

  const goLogin = () => {
    navigate('/login');
  };

  const middlewere = () => {
    axios.post('http://localhost:3001/api/middlewere').then((res) => {
      console.log(res.data);
      if (res.data === true) return;
      const token = res.data;
      // localStorage.setItem("token", token);
      axios.defaults.headers.common['Authorization'] = `${token}`; //앞으로 api통신에 토큰이 들어가있음
    });
  };
  const middlewere2 = () => {
    axios.post('http://localhost:3001/api/authApiData/middle').then((res) => {
      console.log(res.data);
      axios.defaults.headers.common['Authorization'] = `${res.data}`; //앞으로 api통신에 토큰이 들어가있음
    });
  };

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
          </Route>
          <Route path='/category' element={<Category />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/auth/passwordchange' element={<PasswordChange />} />
          <Route path='/mypage' element={<MyPage />} />
        </Routes>
        {/* <Footer /> */}
        <button className='login' onClick={goLogin}>
          로그인
        </button>
        <button className='login4' onClick={goLogOut}>
          로그아웃
        </button>
        <button className='login2' onClick={middlewere}>
          미들웨어
        </button>
        <button className='login3' onClick={middlewere2}>
          라우팅 미들웨어
        </button>
        <Footerbar />
      </UserInfo.Provider>
    </>
  );
}

export default App;
