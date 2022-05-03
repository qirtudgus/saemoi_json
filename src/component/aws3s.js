// import { useRef } from 'react';
// import S3 from 'react-aws-s3';

// const Upload = () => {
//   const fileInput = useRef();
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const file = fileInput.current.files[0];
//     const newFileName = fileInput.current.files[0].name;
//     const config = {
//       bucketName: 'saemoi',
//       region: 'ap-northeast-2',
//       accessKeyId: process.env.REACT_APP_ACCESS_KEY,
//       secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
//     };
//     const ReactS3Client = new S3(config);

//     ReactS3Client.uploadFile(file, newFileName).then((data) => {
//       console.log(data);

//       if (data.status === 204) {
//         console.log('berhasil diupload');
//       } else {
//         console.log('gagal');
//       }
//     });
//   };
//   return (
//     <>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Upload file: <br />
//         </label>
//         <input type='file' ref={fileInput} />
//         <br />
//         <button type='submit'> Upload </button>
//       </form>
//     </>
//   );
// };

// export default Upload;
