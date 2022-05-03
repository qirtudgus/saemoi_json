import "../css/changeProfile.css";
import UploadImageToS3WithReactS3 from "./s3";
import React, { useContext } from "react";
import { UserInfo } from "../App";
import { useNavigate } from "react-router-dom";
import backHistory from "../img/뒤로가기_흰색.svg";

const ChangeProfile = () => {
  const { userAuth } = useContext(UserInfo);
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/mypage");
  };

  return (
    <>
      <UploadImageToS3WithReactS3 />

      <div className="goBack" onClick={goBack}>
        <img src={backHistory} alt="뒤로가기" />
      </div>
    </>
  );
};

export default ChangeProfile;
