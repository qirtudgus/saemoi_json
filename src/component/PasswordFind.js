const PasswordFind = () => {
  return (
    <>
      <p>이메일을 적어주세요!</p>
      <input placeholder='이메일'></input>
      <select placeholder='이메일'>
        <option value='americano'>naver.com</option>
        <option value='caffe latte'>gmail.com</option>
        <option value='cafe au lait'>kakao.com</option>
        <option value='espresso'>daum.net</option>
      </select>

      <button>인증번호 전송하기</button>
    </>
  );
};

export default PasswordFind;
