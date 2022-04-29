import '../../css/auth.css';
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import cancel from '../../img/cancel_fill.svg';
import loginId from '../../img/login_id.svg';
import loginPassword from '../../img/login_password.svg';
import logoSVG from '../../img/saemoiSVG2.svg';
import { UserInfo } from '../../App';

const Login = () => {
  const navigate = useNavigate();
  const goRegister = () => {
    navigate('/register');
  };
  const goHome = () => {
    navigate('/');
  };

  const { userAuth, setUserAuth } = useContext(UserInfo);

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onChangeId = (e) => {
    setId(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    if (userAuth.auth) {
      alert('잘못된 접근입니다.');
      window.location.replace('/');
    }
  }, []);

  console.log(userAuth);

  const login = () => {
    const userLoginInfo = {};
    userLoginInfo.id = id;
    userLoginInfo.password = password;
    axios
      .post('https://sungtt.com/api/authApiData/login', userLoginInfo)
      .then((res) => {
        console.log(res);
        //로그인 성공 했을 때
        if (res.data.auth === true) {
          localStorage.setItem('token', res.data.refreshToken);
          console.log(res.data);
          const token = localStorage.getItem('token');
          console.log(token);
          const RefreshPayload = jwtDecode(token);
          const accessPayload = jwtDecode(RefreshPayload.accessToken);

          console.log(accessPayload);

          setUserAuth({ ...userAuth, id: accessPayload.userId, auth: true });

          axios.defaults.headers.common[
            'Authorization'
          ] = `${res.data.refreshToken}`; //앞으로 api통신에 토큰이 들어가있음
          goHome();
        }
        // 비밀번호가 틀렸을 때
        else if (res.data.authPassword === false) {
          alert('비밀번호가 틀렸습니다.');
        }
        // 아이디가 틀렸을 때
        else if (res.data.auth === false) {
          alert('아이디가 틀렸습니다.');
        }
      });
  };

  const resetId = () => {
    setId('');
    focusId.current.focus();
  };

  const resetPassword = () => {
    setPassword('');
    focusPassword.current.focus();
  };

  const focusId = useRef();
  const focusPassword = useRef();

  return (
    <>
      <div className='login_wrap'>
        <div className='login_container auth'>
          <div className='login_box'>
            <img className='login_logo' src={logoSVG} alt='logo' />
            <div className='login_input'>
              <div className='input_border input_top_border input_top_border_none'>
                <div>
                  <img src={loginId} alt='id' />
                </div>
                <input
                  ref={focusId}
                  name='id'
                  value={id}
                  onChange={onChangeId}
                  placeholder='아이디'
                ></input>
                <div className='input_cancel ' onClick={resetId}>
                  <img src={cancel} alt={'cancel'} />
                </div>
              </div>
              <div className='input_border  input_bottom_border'>
                <div>
                  <img src={loginPassword} alt='id' />
                </div>
                <input
                  ref={focusPassword}
                  placeholder='비밀번호'
                  type='password'
                  autocomplete='off'
                  name='password'
                  value={password}
                  onChange={onChangePassword}
                ></input>
                <div className='input_cancel' onClick={resetPassword}>
                  <img src={cancel} alt={'cancel'} />
                </div>
              </div>
            </div>
            <div>
              <button className='loginBtn mainBgColor' onClick={login}>
                로그인
              </button>
              <p className='register_p'>
                계정이 없으신가요?
                <a href='#' onClick={goRegister}>
                  회원가입
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
