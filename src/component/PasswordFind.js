import React, { useState, useContext, useRef, useEffect } from 'react';
import axios from 'axios';
import { UserInfo } from '../App';
const PasswordFind = () => {
  const [email, setEmail] = useState({
    id: '',
    case: '@',
    email: '',
  });

  //인증 성공 후 전송할 아이디와 비밀번호
  const [inputs, setInputs] = useState({
    id: '',
    newPassword: '',
    newPasswordCheck: '',
  });
  const { id, newPassword, newPasswordCheck } = inputs;

  const [passwordMsg, setPasswordMsg] = useState(
    '영문,숫자 포함 최소 6글자 최대 15글자입니다.',
  );
  const [passwordCheckMsg, setPasswordCheckMsg] = useState('');
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordCheck, setIsPasswordCheck] = useState(false);

  const newPasswordCurrent = useRef();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,15}$/;
    const passwordCheck = newPasswordCurrent.current.value;
    console.log(passwordCheck);
    if (!passwordRegex.test(passwordCheck)) {
      setPasswordMsg('영문,숫자 포함 최소 6글자 최대 15글자입니다.');
      setIsPassword(false);
    } else {
      setPasswordMsg('Good! 좋은 비밀번호에요');
      setIsPassword(true);
    }
  };

  useEffect(() => {
    if (newPassword === '') {
      setPasswordCheckMsg('');
      setIsPasswordCheck(false);
      return;
    }

    if (newPassword === newPasswordCheck) {
      setPasswordCheckMsg('비밀번호가 일치합니다');
      setIsPasswordCheck(true);
    } else {
      setPasswordCheckMsg('비밀번호가 일치하지 않습니다.');
      setIsPasswordCheck(false);
    }
  }, [newPasswordCheck, newPassword, id]);

  const [showPassword, setShowPassword] = useState(false);

  const showPasswords = () => {
    setShowPassword(!showPassword);
  };

  const { URL, goLogin } = useContext(UserInfo);

  const [randomNumber, setRandomNumber] = useState(null);

  const [emailAuth, setEamilAuth] = useState(null);

  const [emailAuthComplete, setEmailAuthComplete] = useState(false);
  const [emailAuthBtn, setEmailAuthBtn] = useState(true);

  const onChangeId = (e) => {
    setEmail({ ...email, id: e.target.value });
  };

  const emailAdd = async () => {
    if (email.email === '') {
      alert('메일을 선택해주세요!');
      return;
    }
    if (email.id === '') {
      alert('이메일을 입력해주세요!');
      emailIdRef.current.focus();
      return;
    }
    const userEmail = `${email.id}${email.case}${email.email}`.toString();
    const randomNum = Math.random().toString(36).slice(2);
    setRandomNumber(randomNum);
    setEmailAuthBtn(false);
    await axios.post(`${URL}/api/authApiData/passwordfind`, {
      email: userEmail,
      randomNum: randomNum,
    });
  };
  const emailIdRef = useRef();
  const userIdRef = useRef();

  const inputEmailAuth = (e) => {
    setEamilAuth(e.target.value);
  };

  const emailAuthGo = () => {
    if (emailAuth === randomNumber) {
      alert('인증 되었습니다~ㅎㅎ');
      setEmailAuthComplete(true);
      setInputs({ ...inputs, newPassword: '', newPasswordCheck: '' });
    } else {
      alert('번호가 틀려요');
      setEmailAuthComplete(false);
    }
  };
  const changePasswordFind = () => {
    axios
      .post(`${URL}/api/authApiData/changepasswordfind`, inputs)
      .then((res) => {
        alert('비밀번호가 변경되었습니다. 다시 로그인해주세요!');
        goLogin();
      });
  };

  return (
    <>
      {emailAuthComplete ? (
        <>
          <p>새로운 비밀번호를 생성합니다!</p>
          <input
            className='input_border input_top_border'
            type={showPassword ? 'text' : 'password'}
            autoComplete='off'
            maxLength={15}
            ref={newPasswordCurrent}
            name='newPassword'
            onChange={onChangeInput}
            placeholder='새 비밀번호'
            value={newPassword}
          ></input>
          <p className='password_msg'>{passwordMsg}</p>
          <input
            className='input_border input_bottom_border'
            type={showPassword ? 'text' : 'password'}
            autoComplete='off'
            maxLength={15}
            name='newPasswordCheck'
            onChange={onChangeInput}
            placeholder='새 비밀번호 확인'
            value={newPasswordCheck}
          ></input>
          <p className='password_msg'>{passwordCheckMsg}</p>

          <button onClick={showPasswords}>작성된 비밀번호 확인</button>

          <button
            disabled={!(isPassword && isPasswordCheck)}
            onClick={changePasswordFind}
          >
            비밀번호 변경
          </button>
        </>
      ) : (
        <>
          <p>찾으실 아이디를 입력해주세요</p>
          <input
            name='id'
            onChange={onChangeInput}
            placeholder='아이디'
            ref={userIdRef}
          ></input>
          <p>이메일을 적어주세요!</p>
          <input
            onChange={onChangeId}
            placeholder='이메일'
            ref={emailIdRef}
          ></input>
          <select
            onChange={(e) => {
              setEmail({ ...email, email: e.target.value });
            }}
            placeholder='이메일'
          >
            <option value=''>메일 선택</option>
            <option value='naver.com'>naver.com</option>
            <option value='gmail.com'>gmail.com</option>
            <option value='kakao.com'>kakao.com</option>
            <option value='daum.net'>daum.net</option>
          </select>

          <button disabled={!emailAuthBtn} onClick={emailAdd}>
            인증번호 전송하기
          </button>
          {emailAuthBtn ? null : <button>인증번호 재전송</button>}
          <input
            onChange={inputEmailAuth}
            placeholder='인증번호를 입력해주세요!'
          ></input>
          <button onClick={emailAuthGo}>인증</button>
        </>
      )}
    </>
  );
};

export default PasswordFind;
