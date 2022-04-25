import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserInfo } from '../App';

const MyPage = () => {
  const navigate = useNavigate();
  const { userAuth, setUserAuth, goLogOut, goLogin } = useContext(UserInfo);
  const goHome = () => {
    navigate('/');
  };

  //토큰이 없으면 아웃,
  // useEffect(() => {
  //   if (localStorage.getItem('token')) {
  //     setUserAuth({ ...userAuth });
  //   } else {
  //     alert('로그인하셔야 이용 가능합니다.');
  //     if (window.confirm('로그인하시겠습니까?')) {
  //       goLogin();
  //     } else goHome();
  //   }
  // }, [setUserAuth]);

  //setState도 context로 받아와서 상태값을 변경시킬 수 있다.
  const contextSetState = () => {
    setUserAuth({ ...userAuth, id: 'hahaha' });
  };

  const passwordChange = () => {
    navigate('/auth/passwordChange');
  };

  const check_Direct_MiddlewereToken = () => {
    axios.post('http://localhost:3001/api/middlewere').then((res) => {
      console.log(`서버 api jwt토큰검증 정상 Token = ${res.data}`);
      if (res.data === true) return;
      const token = res.data;
      // localStorage.setItem("token", token);
      axios.defaults.headers.common['Authorization'] = `${token}`; //앞으로 api통신에 토큰이 들어가있음
    });
  };
  const check_Router_MiddlewereToken = () => {
    axios.post('http://localhost:3001/api/authApiData/middle').then((res) => {
      console.log(`라우팅 api jwt토큰검증 정상 Token = ${res.data}`);
      axios.defaults.headers.common['Authorization'] = `${res.data}`; //앞으로 api통신에 토큰이 들어가있음
    });
  };

  return (
    <>
      {userAuth.auth ? (
        <>
          <div> {userAuth.id}님</div>
          <button onClick={contextSetState}>
            콘텍스트로 받은 세터함수로 변경
          </button>
          <button onClick={check_Direct_MiddlewereToken}>
            서버api 토큰 체크
          </button>
          <button onClick={check_Router_MiddlewereToken}>
            라우팅api 토큰 체크
          </button>
          <button onClick={passwordChange}>비밀번호 변경하기</button>
          <button onClick={goLogOut}>로그아웃</button>
          {/* <p>지금 당신의 토큰은! {userAuth.refreshToken}</p> */}
        </>
      ) : (
        <div>
          <p>비회원이시네요! 로그인 하시겠어요?</p>
          <button onClick={goLogin}>로그인</button>
        </div>
      )}
    </>
  );
};
export default MyPage;