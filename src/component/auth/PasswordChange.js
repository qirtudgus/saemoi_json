import axios from "axios";
import { useEffect, useState, useContext, useRef } from "react";
import { UserInfo } from "../../App";
const PasswordChange = () => {
  const { userAuth } = useContext(UserInfo);
  console.log(userAuth);
  const [inputs, setInputs] = useState({
    id: "",
    newPassword: "",
    newPasswordCheck: "",
  });
  const { id, newPassword, newPasswordCheck } = inputs;
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordCheckMsg, setPasswordCheckMsg] = useState("");
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordCheck, setIsPasswordCheck] = useState(false);

  const newPasswordCurrent = useRef();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      id: userAuth.id,
      [name]: value,
    });
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,20}$/;
    const passwordCheck = newPasswordCurrent.current.value;
    console.log(passwordCheck);
    if (!passwordRegex.test(passwordCheck)) {
      setPasswordMsg("영문,숫자 포함 최소 6글자 최대 15글자입니다.");
      setIsPassword(false);
    } else {
      setPasswordMsg("올바릅니다.");
      setIsPassword(true);
    }
  };

  useEffect(() => {
    if (newPassword === newPasswordCheck) {
      setPasswordCheckMsg("일치합니다");
      setIsPasswordCheck(true);
    } else {
      setPasswordCheckMsg("비밀번호가 트렬요");
      setIsPasswordCheck(false);
    }
  }, [newPasswordCheck]);

  useEffect(() => {
    console.log(inputs);
  }, [inputs]);

  const passwordChanger = () => {
    axios.post("http://localhost:3001/api/authApiData/passwordChange", inputs);
  };

  return (
    <div>
      패스워드 변겅
      <input
        ref={newPasswordCurrent}
        name="newPassword"
        onChange={onChangeInput}
        placeholder="새 비밀번호"
      ></input>
      <p>{passwordMsg}</p>
      <input
        name="newPasswordCheck"
        onChange={onChangeInput}
        placeholder="새 비밀번호 확인"
      ></input>
      <p>{passwordCheckMsg}</p>
      <p>{newPassword}</p>
      <p>{newPasswordCheck}</p>
      <button
        disabled={!(isPassword && isPasswordCheck)}
        onClick={passwordChanger}
      >
        변경하기
      </button>
    </div>
  );
};

export default PasswordChange;
