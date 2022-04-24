import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';

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
import { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      const RefreshPayload = jwtDecode(token);
      const accessPayload = jwtDecode(RefreshPayload.accessToken);
      const { userId } = accessPayload;
      console.log(RefreshPayload);
      console.log(accessPayload);
      axios.defaults.headers.common['Authorization'] = `${token}`; //앞으로 api통신에 토큰이 들어가있음
      console.log('토큰 헤더 등록 완료');
    }
  }, []);

  // useEffect(() => {
  //   axios.post('http://localhost:3001/api/tokenCheck');
  // }, []);

  const goLogin = () => {
    navigate('/login');
  };

  const middlewere = () => {
    axios.post('http://localhost:3001/api/middlewere').then((res) => {
      console.log(res.data);
    });
  };

  return (
    <>
      {/* <Header /> */}

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
      </Routes>
      {/* <Footer /> */}
      <button className='login' onClick={goLogin}>
        로그인
      </button>
      <button className='login2' onClick={middlewere}>
        미들웨어
      </button>
      <Footerbar />
    </>
  );
}

export default App;
