import React, { useState, useContext } from 'react';
import AWS from 'aws-sdk';
import imageCompression from 'browser-image-compression';
import addWhite from '../img/add_white.svg';
import addBlack from '../img/add.png';
import guest from '../img/비회원.jpg';
import { uploadFile } from 'react-s3';
import { UserInfo } from '../App';
import { useNavigate } from 'react-router-dom';

const S3_BUCKET = 'saemoi3';
const REGION = 'ap-northeast-2';

AWS.config.update({
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
});

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

const UploadImageToS3WithNativeSdk = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate('/mypage');
  };
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSize, setFileSize] = useState(2000);
  const [addFileSize, setAddFileSize] = useState(0);
  const [inputFile, setInputFile] = useState(false);
  const [image, setImage] = useState();

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
    const addfile = e.target.files[0];
    console.log(addfile);
    actionImgCompress(addfile);
    setInputFile(true);
  };

  const actionImgCompress = async (fileSrc) => {
    console.log('압축 시작');
    const options = {
      maxSizeMB: 1, // 0.001 1KB / 0.01 10KB 0.1 100KB 1 1024KB
      maxWidthOrHeight: 500, // 이미지 최대 높이와 넓이
      useWebWorker: true,
      maxIteration: 100, // 몇번까지 압축을 시도할건지 기본 10
      initialQuality: 1, // 기본 1의 화질에서 몇까지 깎을건지
    };
    // 압축 결과, 여기에 이미지가 담겨있다.
    const compressedFile = await imageCompression(fileSrc, options);

    encodeFileToBase64(compressedFile);
    console.log(compressedFile);

    setSelectedFile(compressedFile);
    setAddFileSize(compressedFile.size);
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
  //압축한 파일을 올리는거까지는 완료. 이제 주소를 따서 DB에 저장해줘야한다.

  const handleUpload = async (file) => {
    console.log(file);
    try {
      uploadFile(selectedFile);
    } catch (err) {
      console.log(err);
    }
  };

  const uploadFile = (file) => {
    const params = {
      ACL: 'public-read',
      Body: file,
      Bucket: S3_BUCKET,
      Key: file.name,
    };

    myBucket
      .putObject(params)
      .on('httpUploadProgress', (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      })
      .send((err, data) => {
        console.log(data);
        if (err) console.log(err);
      });
  };

  return (
    <div className='super'>
      <p>jpg,jpeg,png,gif 확장자만 가능해요!</p>
      <p>너무 큰 파일은 자동으로 최적화 돼요!</p>
      <p>최대용량 {fileSize}</p>
      <p>파일용량 {addFileSize}</p>
      <div>Native SDK File Upload Progress is {progress}%</div>
      <input type='file' onChange={handleFileInput} />
      <button onClick={() => uploadFile(selectedFile)}> Upload to S3</button>
    </div>
  );
};

export default UploadImageToS3WithNativeSdk;
