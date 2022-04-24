import axios from "axios";
import jwtDecode from "jwt-decode";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserInfo } from "../App";
const MyPage = () => {
  const navigate = useNavigate();
  const { userAuth, setUserAuth } = useContext(UserInfo);
  const goHome = () => {
    navigate("/");
  };
  const goLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUserAuth({ ...userAuth });
    } else {
      alert("로그인하셔야 이용 가능합니다.");
      if (window.confirm("로그인하시겠습니까?")) {
        goLogin();
      } else goHome();
    }
  }, [setUserAuth]);

  const contextSetState = () => {
    setUserAuth({ ...userAuth, id: "hahaha" });
  };

  const passwordChange = () => {
    navigate("/auth/passwordChange");
  };

  return (
    <>
      {userAuth.auth ? (
        <>
          {" "}
          <div> {userAuth.id}안녕하세요!</div>
          <button onClick={contextSetState}>
            콘텍스트로 받은 세터함수로 변경
          </button>
          <button onClick={passwordChange}>비밀번호 변경하기</button>
          <p>지금 당신의 토큰은! {userAuth.refreshToken}</p>
        </>
      ) : (
        <div>
          <p>비회원이시네요! 로그인 하시겠어요?</p>
          <button>로그인</button>
        </div>
      )}
    </>
  );
};
export default MyPage;
