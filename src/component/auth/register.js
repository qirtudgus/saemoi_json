import '../../css/auth.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

const Register = () => {
  const navigate = useNavigate();
  const goLogin = () => {
    navigate('/login');
  };
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');

  const [idAuthText, setIdAuthText] = useState({
    text: '영문과 숫자만 입력 가능합니다.',
    idAuth: null,
  });
  const [passwordAuthText, setPasswordAuthText] = useState('');
  const [passwordCheckText, setPasswordCheckText] = useState('');

  const [isId, setIsId] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordCheck, setIsPasswordCheck] = useState(false);

  const onChangeId = async (e) => {
    const regExp = /[\s|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g; // 영문과 숫자만 입력 가능
    e.target.value = e.target.value.replace(regExp, '');
    setId(e.target.value);
    console.log(id);
  };

  // id input에서 아웃포커스 될 시 중복확인 api 통신
  const ID_CHECK_BLUR = () => {
    if (id === '') {
      setIdAuthText({
        ...idAuthText,
        text: '아이디를 입력해주세요!',
        idAuth: false,
      });
    } else {
      axios
        .post('http://localhost:3001/api/authApiData/idCheck', {
          id: id,
        })
        .then((res) => {
          if (res.data.auth === true) {
            setIdAuthText({
              ...idAuthText,
              text: '사용 가능한 아이디입니다.',
              idAuth: true,
            });
            setIsId(true);
            console.log('생성가능합니다.');
          } else {
            setIdAuthText({
              ...idAuthText,
              text: '이미 존재하는 아이디입니다..',
              idAuth: true,
            });
            setIsId(false);

            console.log('이미 있는 ID입니다.');
          }
        });
    }
  };

  //패스워드 정규표현식에 맞춰 작성한지 확인
  const onChangePassword = async (e) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,20}$/;
    const passwordCurrent = e.target.value;
    setPassword(e.target.value);
    console.log(password);

    if (!passwordRegex.test(passwordCurrent)) {
      setPasswordAuthText('영문,숫자 포함 최소 6글자 최대 15글자입니다.');
      setIsPassword(false);
    } else {
      setPasswordAuthText('올바른패스워드입니다.');
      setIsPassword(true);
    }
  };

  //패스워드 전부 일치한지 확인
  const onChangePasswordCheck = async (e) => {
    setPasswordCheck(e.target.value);
  };

  // 패스워드 확인 함수
  useEffect(() => {
    if (passwordCheck === '') {
      console.log('아무것도없음');
      setPasswordCheckText('');
      setIsPasswordCheck(false);
    } else {
      console.log('텍스트작성');
      if (password === passwordCheck) {
        setPasswordCheckText('패스워드가 일치합니다.');
        setIsPasswordCheck(true);
      } else {
        setPasswordCheckText('패스워드가 틀립니다.');
        setIsPasswordCheck(false);
      }
    }
  }, [passwordCheck, password]);

  const join = () => {
    const userInfo = {};
    userInfo.id = id;
    userInfo.password = password;
    axios.post('http://localhost:3001/api/authApiData/join', userInfo);
    setId('');
    setPassword('');
    setPasswordCheck('');
    alert('회원가입이 완료되었습니다.');
    goLogin();
  };

  return (
    <>
      <div className='login_container auth'>
        <div className='login_box'>
          <div className='login_input'>
            <p>아이디</p>
            <input
              name='id'
              onChange={onChangeId}
              onBlur={ID_CHECK_BLUR}
              value={id}
            ></input>
            <p>{idAuthText.text}</p>
            <p>비밀번호</p>
            <input
              autocomplete='off'
              maxLength={15}
              name='password'
              onChange={onChangePassword}
              value={password}
            ></input>
            <p>{passwordAuthText}</p>
            <p>비밀번호 확인</p>
            <input
              autocomplete='off'
              maxLength={15}
              name='password_check'
              onChange={onChangePasswordCheck}
              value={passwordCheck}
            ></input>
            <p>{passwordCheckText}</p>
          </div>
          <div>
            <button
              disabled={!(isId && isPassword && isPasswordCheck)}
              onClick={join}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
