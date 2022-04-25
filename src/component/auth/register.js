import "../../css/auth.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import logoSVG from "../../img/saemoiSVG2.svg";
import loginId from "../../img/login_id.svg";
import loginPassword from "../../img/login_password.svg";

const Register = () => {
  const navigate = useNavigate();
  const goLogin = () => {
    navigate("/login");
  };
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [idAuthText, setIdAuthText] = useState({
    text: "5~15자의 영문,숫자만 사용 가능합니다.",
    idAuth: null,
  });
  const [passwordAuthText, setPasswordAuthText] = useState("");
  const [passwordCheckText, setPasswordCheckText] = useState("");

  const [isId, setIsId] = useState();
  const [isPassword, setIsPassword] = useState();
  const [isPasswordCheck, setIsPasswordCheck] = useState();
  const regExp = /[\s|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g; // 영문과 숫자만 입력 가능

  const onChangeId = async (e) => {
    // e.target.value = e.target.value.replace(regExp, "");
    setId(e.target.value);
    console.log(id);
  };

  // id input에서 아웃포커스 될 시 중복확인 api 통신
  const ID_CHECK_BLUR = () => {
    if (id === "") {
      setIdAuthText({
        ...idAuthText,

        idAuth: false,
      });
    } else if (regExp.test(id)) {
      setIdAuthText({
        ...idAuthText,
        text: "5~15자의 영문,숫자만 사용 가능합니다.",
        idAuth: false,
      });
    } else {
      axios
        .post("https://sungtt.com/api/authApiData/idCheck", {
          id: id,
        })
        .then((res) => {
          if (res.data.auth === true) {
            setIdAuthText({
              ...idAuthText,
              text: "사용 가능한 아이디입니다.",
              idAuth: true,
            });
            setIsId(true);
            console.log("생성가능합니다.");
          } else {
            setIdAuthText({
              ...idAuthText,
              text: "이미 존재하는 아이디입니다..",
              idAuth: true,
            });
            setIsId(false);

            console.log("이미 있는 ID입니다.");
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
      setPasswordAuthText("5~20자의 영문,숫자를 사용하세요.");
      setIsPassword(false);
    } else {
      setPasswordAuthText("올바른패스워드입니다.");
      setIsPassword(true);
    }
  };

  //패스워드 전부 일치한지 확인
  const onChangePasswordCheck = async (e) => {
    setPasswordCheck(e.target.value);
  };

  // 패스워드 확인 함수
  useEffect(() => {
    if (passwordCheck === "") {
      console.log("아무것도없음");
      setPasswordCheckText("");
    } else if (isPassword) {
      console.log("텍스트작성");
      if (password === passwordCheck) {
        setPasswordCheckText("패스워드가 일치합니다.");
        setIsPasswordCheck(true);
      } else {
        setPasswordCheckText("패스워드가 틀립니다.");
        setIsPasswordCheck(false);
      }
    }
  }, [passwordCheck, password]);

  const join = () => {
    const userInfo = {};
    userInfo.id = id;
    userInfo.password = password;
    axios.post("https://sungtt.com/api/authApiData/join", userInfo);
    setId("");
    setPassword("");
    setPasswordCheck("");
    alert("회원가입이 완료되었습니다.");
    goLogin();
  };

  return (
    <>
      <div className="login_wrap">
        <div className="login_container auth">
          <div className="login_box">
            <img className="login_logo" src={logoSVG} alt="logo" />

            <div className="login_input">
              <div
                className={
                  "input_border " + (isId === false ? "input_false" : null)
                }
              >
                <div>
                  <img src={loginId} alt="id" />
                </div>
                <input
                  maxLength={15}
                  placeholder="아이디"
                  name="id"
                  onChange={onChangeId}
                  onBlur={ID_CHECK_BLUR}
                  value={id}
                ></input>
              </div>
              <p className="font-size-13">{idAuthText.text}</p>

              <div
                className={
                  "input_border " +
                  (isPassword === false ? "input_false" : null)
                }
              >
                <div>
                  <img src={loginPassword} alt="id" />
                </div>
                <input
                  placeholder="비밀번호"
                  type="password"
                  autocomplete="off"
                  maxLength={15}
                  name="password"
                  onChange={onChangePassword}
                  value={password}
                ></input>
              </div>
              <p className="font-size-13">{passwordAuthText}</p>
              <div
                className={
                  "input_border " +
                  (isPasswordCheck === false ? "input_false" : null)
                }
              >
                <div>
                  <img src={loginPassword} alt="id" />
                </div>
                <input
                  placeholder="비밀번호 확인"
                  type="password"
                  autocomplete="off"
                  maxLength={15}
                  name="password_check"
                  onChange={onChangePasswordCheck}
                  value={passwordCheck}
                ></input>
              </div>
              <p className="font-size-13">{passwordCheckText}</p>
            </div>
            <div>
              <button
                className="loginBtn mainBgColor pt"
                disabled={!(isId && isPassword && isPasswordCheck)}
                onClick={join}
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
