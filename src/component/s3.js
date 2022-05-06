import axios from 'axios';
import React, { useState, useContext } from 'react';
import { uploadFile } from 'react-s3';
import { UserInfo } from '../App';
import { useNavigate } from 'react-router-dom';
import '../css/s3.css';
import imageCompression from 'browser-image-compression';
import addWhite from '../img/add_white.svg';
import addBlack from '../img/add.png';
import guest from '../img/비회원.jpg';

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
  const navigate = useNavigate();
  const goBack = () => {
    navigate('/mypage');
  };
  const { userAuth, setUserAuth, URL, userProfile, setNoti } =
    useContext(UserInfo);
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputFile, setInputFile] = useState(false);

  const [fileSize, setFileSize] = useState(2000);
  const [addFileSize, setAddFileSize] = useState(0);

  const [profileDecide, setProfileDecide] = useState(false);

  const [image, setImage] = useState();

  const actionImgCompress = async (fileSrc) => {
    console.log('압축 시작');
    const options = {
      maxSizeMB: 1, // 0.001 1KB / 0.01 10KB 0.1 100KB 1 1024KB
      maxWidthOrHeight: 500, // 이미지 최대 높이와 넓이
      useWebWorker: true,
      maxIteration: 100, // 몇번까지 압축을 시도할건지 기본 10
      initialQuality: 1, // 기본 1의 화질에서 몇까지 깎을건지
    };
    try {
      // 압축 결과, 여기에 이미지가 담겨있다.
      const compressedFile = await imageCompression(fileSrc, options);

      encodeFileToBase64(compressedFile);
      console.log(compressedFile);

      setSelectedFile(compressedFile);
      setAddFileSize(compressedFile.size);
    } catch (error) {
      console.log(error);
    }
  };

  //이미지 프리뷰 인자로 이미지를 전달하여 호출하면 된다.
  const encodeFileToBase64 = (fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImage(reader.result);
        resolve();
      };
    });
  };

  // 파일 선택 시 호출 된다.
  const handleFileInput = (e) => {
    const addfile = e.target.files[0];
    actionImgCompress(addfile);
    setInputFile(true);
    console.log(e.target.files[0]);
    //state SelectedFile이 업로드된다. 그러니까 미리 압축 후에 SelectedFile state에 할당해주자.
    // setSelectedFile(image);

    //업로드한 파일의 사이즈를 보여준다.
    // setAddFileSize(image.size);
    if (addfile.size === 1898) {
      // alert("적절한 사이즈");
    }
  };

  //s3 업로드 시 호출 된다.
  const handleUpload = async (file) => {
    console.log(file);
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
        axios
          .post(`${URL}/api/authApiData/changeprofile`, res)
          .then((res) => {
            console.log('변경 후 받아온 주소');
            console.log(res.data);
            //새로운 프로필의 주소를 받아와 setUserAuth 해준다
            setUserAuth({ ...userAuth, profile: res.data });
          })
          .then((res) => {
            goBack();
            // setNoti(true);
          });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className='s3_box'>
      <div className='s3_title'>프로필 수정</div>

      <div className='profile_decide_box'>
        <div className='profile_decide'>
          <img src={image || userProfile || guest} alt='preview' />
        </div>
        <label className='uploads_label' htmlFor='image_uploads'>
          <img src={addBlack} alt='zz' />
        </label>
      </div>

      <input
        id='image_uploads'
        name='image_uploads'
        className='inputFile'
        type='file'
        //인풋파일의 확장자 유도하기
        accept='.png, .jpg, .jpeg, .gif '
        onChange={handleFileInput}
      />

      <button
        className='decide_change'
        disabled={!inputFile}
        onClick={() => {
          setProfileDecide(true);
        }}
      >
        변경하기
      </button>

      {profileDecide ? (
        <>
          <div className='decide_wrap'>
            <div className='decide_modal'>
              <button
                className='decide_change'
                onClick={() => handleUpload(selectedFile)}
              >
                변경 한다구요!
              </button>
              <button
                className='decide_cancel'
                onClick={() => {
                  setProfileDecide(false);
                }}
              >
                취소
              </button>
            </div>
          </div>
        </>
      ) : null}

      <p>jpg,jpeg,png,gif 확장자만 가능해요!</p>
      <p>너무 큰 파일은 자동으로 최적화 돼요!</p>
      <p>최대용량 {fileSize}</p>
      <p>파일용량 {addFileSize}</p>
    </div>
  );
};

export default UploadImageToS3WithReactS3;
