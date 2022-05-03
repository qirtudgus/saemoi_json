const SECRET_TOKEN = process.env.SECRET_TOKEN;
const jwt = require("jsonwebtoken");
const { default: jwtDecode } = require("jwt-decode");

function addAccesccToken(id) {
  const accesccToken = jwt.sign({ userId: id }, SECRET_TOKEN, {
    expiresIn: "10s",
  });
  return accesccToken;
}

function addRefreshToken(id, accesccToken) {
  const refreshToken = jwt.sign(
    { userId: id, accesccToken: accesccToken },
    SECRET_TOKEN,
    {
      expiresIn: "1d",
    },
  );
  return refreshToken;
}

//유효한 토큰은 그대로 사용
//만료된 토큰은 재발급하여 req에 담아놓음
const tokenCheck = async (req, res, next) => {
  console.log("토큰체크api 실행되었습니다.");
  const oldToken = req.headers.authorization;
  console.log(oldToken);
  // console.log(jwtDecode(oldToken));
  console.log(typeof oldToken);
  if (oldToken === undefined) {
    console.log("헤더에 토큰이없음 언디파인드");
    next();
  }
  if (oldToken === "undefined") {
    console.log("헤더에 토큰이없음 스트링");
    next();
  } else {
    jwt.verify(oldToken, SECRET_TOKEN, (err, decoded) => {
      const { userId, profile } = jwtDecode(oldToken);

      if (err) {
        console.log("만료된 리프레쉬");
        const refreshToken = addRefreshToken(userId, addAccesccToken(userId));
        console.log("새로만든 리프레쉬");
        req.authorization = refreshToken;
        next();
      }
      if (decoded) {
        console.log("유효한 리프레쉬");
        const oldAccessToken = decoded.accessToken;

        jwt.verify(oldAccessToken, SECRET_TOKEN, (err, decoded) => {
          if (err) {
            console.log("만료된 액세스토큰");
            const accessToken = jwt.sign(
              { userId: userId, profile: profile },
              SECRET_TOKEN,
              {
                expiresIn: "10s",
              },
            );

            const refreshToken = jwt.sign(
              { userId: userId, profile: profile, accessToken: accessToken },
              SECRET_TOKEN,
              {
                expiresIn: "1d",
              },
            );
            console.log("새로만든 리프레쉬");

            req.authorization = refreshToken;
            next();
          }
          if (decoded) {
            req.authorization = oldToken;
            console.log("유효한 액세스토큰");
            next();
          }
        });
      }
    });
  }

  // if (oldToken) {
  //   const token = jwtDecode(oldToken);
  //   const accessToken = token.accessToken;
  //   const { userId } = token;
  //   try {
  //     jwt.verify(accessToken, SECRET_TOKEN, (error, decoded) => {
  //       if (error) {
  //         console.log('만료된 액세스토큰입니다. 토큰을 재발급합니다.');
  //         console.log(error);
  //         const accessToken = jwt.sign({ userId: userId }, SECRET_TOKEN, {
  //           expiresIn: '10s',
  //         });
  //         const refreshToken = jwt.sign(
  //           { userId: userId, accessToken },
  //           SECRET_TOKEN,
  //           { expiresIn: '15s' },
  //         );
  //         //모든 api통신의 req에 토큰값 넣어주기
  //         req.authorization = refreshToken;
  //         // res.send(user);
  //         next();
  //       }
  //       if (decoded) {
  //         console.log('유효한 액세스토큰');
  //         req.authorization = req.headers.authorization;
  //         next();
  //       }
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // } else {
  //   next();
  // }
};

module.exports = tokenCheck;
