import axios from 'axios';
import { useEffect, useState, useContext, useRef } from 'react';
import { UserInfo } from '../../App';
import '../../css/passwordChange.css';
const PasswordChange = () => {
  const { userAuth, URL } = useContext(UserInfo);
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

  const [showPassword, setShowPassword] = useState(false);

  const showPasswords = () => {
    setShowPassword(!showPassword);
  };

  const newPasswordCurrent = useRef();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      id: userAuth.id,
      [name]: value,
    });
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,15}$/;
    const passwordCheck = newPasswordCurrent.current.value;
    console.log(passwordCheck);
    if (!passwordRegex.test(passwordCheck)) {
      setPasswordMsg('영문,숫자 포함 최소 6글자 최대 15글자입니다.');
      setIsPassword(false);
    } else {
      setPasswordMsg('올바릅니다.');
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
  }, [newPasswordCheck, newPassword]);

  useEffect(() => {
    console.log(inputs);
  }, [inputs]);

  const passwordChanger = () => {
    axios.post(`${URL}/api/authApiData/passwordChange`, inputs);
  };

  return (
    <div className='passwordChange_box'>
      <div className='passwordChange_container'>
        <div className='passwordChange_title'>비밀번호 변경</div>
        <input
          className='input_border input_top_border'
          type={showPassword ? 'text' : 'password'}
          autoComplete='off'
          maxLength={15}
          ref={newPasswordCurrent}
          name='newPassword'
          onChange={onChangeInput}
          placeholder='새 비밀번호'
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
        ></input>
        <p className='password_msg'>{passwordCheckMsg}</p>
        {/* <p>{newPassword}</p>
        <p>{newPasswordCheck}</p> */}
        <button onClick={showPasswords}>작성된 비밀번호 확인</button>
        <button
          className='decide_change'
          disabled={!(isPassword && isPasswordCheck)}
          onClick={passwordChanger}
        >
          변경하기
        </button>
      </div>
    </div>
  );
};

export default PasswordChange;
