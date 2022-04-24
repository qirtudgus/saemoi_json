import '../../css/auth.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const Login = () => {
  const navigate = useNavigate();
  const goRegister = () => {
    navigate('/register');
  };
  const goHome = () => {
    navigate('/');
  };

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    axios
      .post('http://localhost:3001/api/authApiData/tokenVerify')
      .then((res) => {
        console.log(res.data);
        console.log(jwtDecode(res.data.refreshToken));
        const token = res.data.refreshToken;
        localStorage.removeItem('token');
        localStorage.setItem('token', res.data.refreshToken);
        axios.defaults.headers.common['Authorization'] = `${token}`; //앞으로 api통신에 토큰이 들어가있음
      });
  }, []);

  const onChangeId = (e) => {
    setId(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const login = () => {
    const userLoginInfo = {};
    userLoginInfo.id = id;
    userLoginInfo.password = password;
    axios
      .post('http://localhost:3001/api/authApiData/login', userLoginInfo)
      .then((res) => {
        console.log(res);
        //로그인 성공 했을 때
        if (res.data.auth === true) {
          localStorage.setItem('token', res.data.refreshToken);

          const token = localStorage.getItem('token');
          const RefreshPayload = jwtDecode(token);
          const accessPayload = jwtDecode(RefreshPayload.accessToken);
          console.log(RefreshPayload);
          console.log(accessPayload);
          axios.defaults.headers.common['Authorization'] = `${token}`; //앞으로 api통신에 토큰이 들어가있음
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

  return (
    <>
      <div className='login_container auth'>
        <div className='login_box'>
          <div className='login_input'>
            <p>아이디</p>
            <input name='id' value={id} onChange={onChangeId}></input>
            <p>비밀번호</p>
            <input
              name='password'
              value={password}
              onChange={onChangePassword}
            ></input>
          </div>
          <div>
            <button onClick={login}>로그인</button>
            <p>
              계정이 없으신가요?
              <a href='#' onClick={goRegister}>
                회원가입
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
