import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserInfo } from '../App';
import '../css/myPage.css';

import guest from '../img/비회원.jpg';

const MyPage = () => {
  const navigate = useNavigate();
  const { userAuth, setUserAuth, goLogOut, goLogin, URL, userProfile, noti } =
    useContext(UserInfo);

  const goHome = () => {
    navigate('/');
  };
  const goRegister = () => {
    navigate('/register');
  };

  // const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {}, []);

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

  const passwordChange = () => {
    navigate('/auth/passwordChange');
  };

  const check_Direct_MiddlewereToken = () => {
    axios.post(`${URL}/api/middlewere`).then((res) => {
      console.log(`서버 api jwt토큰검증 정상 Token = ${res.data}`);
      if (res.data === true) return;
      const token = res.data;
      // localStorage.setItem("token", token);
      axios.defaults.headers.common['Authorization'] = `${token}`; //앞으로 api통신에 토큰이 들어가있음
    });
  };

  const profileChange = () => {
    navigate('/changeprofile');
  };

  console.log('유저 프로필 주소');
  console.log(userAuth.profile);

  return (
    <>
      <div className='mypage_bg'>
        <div className='mypage_box'>
          {userAuth.auth ? (
            <div className='mypage_wrap'>
              <div className='mypage_container'>
                <div className='profile'>
                  <img src={userProfile || guest} alt='profile'></img>
                </div>

                <p className='mypage_title'>{userAuth.id}</p>

                <div>내 프로필</div>
                <button className='mypage_btn' onClick={profileChange}>
                  프로필 수정
                </button>

                <button className='mypage_btn' onClick={passwordChange}>
                  비밀번호 변경하기
                </button>
                <button
                  className='mypage_btn'
                  onClick={check_Direct_MiddlewereToken}
                >
                  서버api 토큰 체크
                </button>
                <button className='logOutBtn' onClick={goLogOut}>
                  로그아웃
                </button>
                {/* <p>지금 당신의 토큰은! {userAuth.refreshToken}</p> */}
              </div>
            </div>
          ) : (
            <div className='mypage_wrap'>
              <div className='mypage_container'>
                <div className='profile'>
                  <img src={guest} alt='profile'></img>
                </div>
                <p className='mypage_title'>비회원</p>

                <p>비회원입니다.</p>
                <button className='loginBtn mainBgColor' onClick={goLogin}>
                  로그인
                </button>
                <p className='ma_t_14'>
                  계정이 없으신가요?{' '}
                  <span className='pt bold_txt' onClick={goRegister}>
                    회원가입
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {noti ? <div className='noti'>변경완료!!</div> : null}
    </>
  );
};
export default MyPage;
