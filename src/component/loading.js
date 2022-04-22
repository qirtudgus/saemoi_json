import React from 'react';
import '../css/loading.css';

const Loading = () => {
  return (
    <div className='loader'>"Loading.."</div>
    //     <div className="loading-page">
    //     <div className="loading-container">
    //     <div className="loading"></div>
    //     <div id="loading-text">loading</div>
    // </div>
    // </div>
  );
};

export default React.memo(Loading);
