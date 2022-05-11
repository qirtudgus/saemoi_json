import '../css/changeProfile.css';
import UploadImageToS3WithReactS3 from './s3';
import React, { useContext } from 'react';
import { UserInfo } from '../App';
import { useNavigate } from 'react-router-dom';
import backHistory from '../img/뒤로가기_흰색.svg';
import Upload from './aws3s';

const ChangeProfile = () => {
  const { userAuth, userProfile } = useContext(UserInfo);
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/mypage');
  };

  return (
    <>
      <div className='changeprofile_box'>
        <div className='changeprofile_wrap'>
          {/* <UploadImageToS3WithReactS3 /> */}
          <Upload />

          <div className='goBack' onClick={goBack}>
            <img src={backHistory} alt='뒤로가기' />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeProfile;
