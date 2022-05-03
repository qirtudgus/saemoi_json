import axios from 'axios';
import React, { useState, useContext } from 'react';
import { uploadFile } from 'react-s3';
import { UserInfo } from '../App';
const S3_BUCKET = 'saemoi';
const REGION = 'ap-northeast-2';
const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.REACT_APP_SECRET_ACCESS_KEY;

const config = {
  bucketName: S3_BUCKET,
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
};

const UploadImageToS3WithReactS3 = () => {
  const { userAuth, setUserAuth, URL } = useContext(UserInfo);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInput = (e) => {
    console.log(e.target.files[0].name);
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (file) => {
    uploadFile(file, config)
      .then((res) => {
        const changeProfileObj = {
          id: userAuth.id,
          profile: res.location,
        };
        return changeProfileObj;
      })
      .then((res) => {
        //아이디와 이미지주소를 서버에 보내준다.
        axios.post(`${URL}/api/authApiData/changeprofile`, res).then((res) => {
          //새로운 프로필의 주소를 받아와 setUserAuth 해준다
          setUserAuth({ ...userAuth, profile: res.data });
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <div>React S3 File Upload</div>
      <input type='file' onChange={handleFileInput} />
      <button onClick={() => handleUpload(selectedFile)}> Upload to S3</button>
    </div>
  );
};

export default UploadImageToS3WithReactS3;
