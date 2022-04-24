const jwt = require('jsonwebtoken');
const { default: jwtDecode } = require('jwt-decode');
const SECRET_TOKEN = process.env.SECRET_TOKEN;

// 2 - 리프레쉬 토큰이 만료되어 새로 생성할 때 함수
const newRefreshToken = async (id) => {
  let user = {};
  const accessToken = jwt.sign({ userId: id, TokenAuth: true }, SECRET_TOKEN, {
    expiresIn: '10s',
  });
  const refreshToken = jwt.sign({ accessToken: accessToken }, SECRET_TOKEN, {
    expiresIn: '1d',
  });
  user.auth = true;
  user.refreshToken = refreshToken;
  console.log(
    `===newRefreshToken 16Line // 1단계 newRefreshToken 함수의 새로운 토큰입니다 ${user} ===`,
  );
  console.log(user);
  return user;
};

// 1 - 인자로 리프레쉬 토큰을 받아와 리프레쉬 토큰과 액세스 토큰의 유효성을 모두 검사한다.
const tokenVerify = async (targetToken) => {
  console.log('유효성 검사 시작');
  const Token = targetToken;
  const refreshToken = jwtDecode(Token);
  const accessToken = refreshToken.accessToken;
  let refreshTokenAuth = {};
  console.log(accessToken);
  // 기존의 리프레쉬 토큰을 검사한다.
  jwt.verify(Token, SECRET_TOKEN, function (err, decode) {
    // 리프레쉬 토큰이 만료 되었을 시
    if (err) {
      console.log('만료된 리프레쉬 토큰입니다.');
    }
    // 리프레쉬 토큰이 유효할 시
    else if (decode) {
      console.log('유효한 리프레쉬 토큰입니다.');
      // 리프레쉬 토큰의 유저 아이디 받아오기
      const { userId } = decode;
      refreshTokenAuth.true = true;

      // 액세스 토큰 유효성 검사 시작
      if (refreshTokenAuth.true === true) {
        jwt.verify(accessToken, SECRET_TOKEN, function (err, decode) {
          // 액세스 토큰이 만료 됐을 시
          if (err) {
            console.log('만료된 액세스 토큰입니다.');
            //액세스 토큰이 만료되었으면, 새로운 리프레쉬 토큰을 생성해준다.
            const newToken = newRefreshToken(userId);
            console.log(
              '====tokenVerify 50line // 2단계 newRefreshToken 반환값 ====',
            );
            console.log(newToken);
            // 반환해주기. 여기서 server.js로 값이 넘어가길 원합니다.
            return newToken;
          }
          //액세스 토큰이 유효 할 시
          else if (decode) {
            console.log('유효한 액세스 토큰입니다.');
          }
        });
      }
    }
  });
};
module.exports = tokenVerify;
