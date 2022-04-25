const SECRET_TOKEN = process.env.SECRET_TOKEN;
const jwt = require('jsonwebtoken');
const { default: jwtDecode } = require('jwt-decode');

//유효한 토큰은 그대로 사용
//만료된 토큰은 재발급하여 req에 담아놓음
const tokenCheck = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = jwtDecode(req.headers.authorization);
    const accessToken = token.accessToken;
    const { userId } = token;
    try {
      jwt.verify(accessToken, SECRET_TOKEN, (error, decoded) => {
        if (error) {
          console.log('만료된 액세스토큰입니다. 토큰을 재발급합니다.');

          const accessToken = jwt.sign({ userId: userId }, SECRET_TOKEN, {
            expiresIn: '10s',
          });
          const refreshToken = jwt.sign(
            { userId: userId, accessToken },
            SECRET_TOKEN,
            { expiresIn: '1d' },
          );
          //모든 api통신의 req에 토큰값 넣어주기
          req.authorization = refreshToken;
          // res.send(user);
          next();
        }
        if (decoded) {
          console.log('유효한 액세스토큰');
          req.authorization = req.headers.authorization;
          next();
        }
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    next();
  }
};

module.exports = tokenCheck;
